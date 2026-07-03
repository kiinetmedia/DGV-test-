/**
 * PremiumGlobeCanvas — client-only R3F component.
 * Photorealistic texture-mapped globe using satellite imagery.
 * Texture is equirectangular — maps directly onto SphereGeometry UVs.
 */
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore — Vite resolves static assets to URL strings
import globeImg from "@/assets/globe-texture.jpg";

/* ─────────────────────────────────────────────────────────────
   GLSL — Photorealistic textured sphere
   · Equirectangular UV maps directly to Three.js SphereGeometry
   · Day/night blend via dot(worldNormal, sunDir)
   · Water specular: detect blue-dominant pixels
   · Fresnel atmosphere tint at limb
───────────────────────────────────────────────────────────── */
const SPHERE_VERT = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldNormal;
void main(){
  vUv          = uv;
  vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
  vNormal      = normalize(normalMatrix * normal);
  vViewDir     = normalize(-mvPos.xyz);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position  = projectionMatrix * mvPos;
}`;

const SPHERE_FRAG = `
uniform sampler2D uMap;
uniform vec3      uSunDir;
varying vec2      vUv;
varying vec3      vNormal;
varying vec3      vViewDir;
varying vec3      vWorldNormal;

void main(){
  vec3 tex = texture2D(uMap, vUv).rgb;
  vec3 sun = normalize(uSunDir);

  // Diffuse + terminator
  float NdotL  = dot(vWorldNormal, sun);
  float diffuse = smoothstep(-0.28, 0.58, NdotL);
  float shadow  = smoothstep(0.06, -0.18, NdotL);

  // Water detection — blue dominant, low red
  float isWater = smoothstep(0.0, 0.45, tex.b - tex.r * 0.58 - tex.g * 0.28);

  // Specular highlight on water
  vec3  halfDir = normalize(sun + vViewDir);
  float spec    = pow(max(0.0, dot(vNormal, halfDir)), 80.0)
                  * isWater * max(0.0, NdotL);

  // Fresnel edge
  float fr = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 3.5);

  // Day colour with specular
  vec3 dayColor  = tex * (0.10 + 0.90 * diffuse)
                 + vec3(0.88, 0.96, 1.00) * spec * 0.50;

  // Night side — very dark with slight blue city-light cast
  vec3 nightColor = tex * 0.035 + vec3(0.005, 0.010, 0.025);

  // Blend day → night across terminator
  vec3 color = mix(dayColor, nightColor, shadow * 0.94);

  // Subtle atmosphere tint at limb
  color = mix(color, vec3(0.28, 0.50, 0.88), fr * 0.09);

  gl_FragColor = vec4(color, 1.0);
}`;

/* ─────────────────────────────────────────────────────────────
   DATA — arcs & glow markers (geographic positions)
───────────────────────────────────────────────────────────── */
const GLOW_MARKERS = [
  { lat:  19.076, lon:  72.877, r: 0.19, delay: 0.80 }, // India
  { lat:  25.204, lon:  55.270, r: 0.08, delay: 0.95 }, // UAE
  { lat:   1.352, lon: 103.820, r: 0.07, delay: 1.05 }, // Singapore
  { lat:  51.507, lon:  -0.127, r: 0.10, delay: 1.15 }, // UK
  { lat:  51.160, lon:  10.450, r: 0.10, delay: 1.20 }, // Germany
  { lat:  46.230, lon:   2.210, r: 0.11, delay: 1.25 }, // France
  { lat:  37.090, lon: -95.710, r: 0.19, delay: 1.35 }, // USA
  { lat:  43.653, lon: -79.383, r: 0.17, delay: 1.40 }, // Canada
  { lat: -14.235, lon: -51.925, r: 0.18, delay: 1.45 }, // Brazil
  { lat: -28.000, lon:  24.000, r: 0.13, delay: 1.55 }, // South Africa
  { lat: -25.274, lon: 133.775, r: 0.19, delay: 1.60 }, // Australia
];

const ARC_PAIRS: [number, number, number, number][] = [
  [  19.076,  72.877,  25.204,  55.270 ],
  [  25.204,  55.270,   1.352, 103.820 ],
  [  51.507,  -0.127,  51.160,  10.450 ],
  [  51.160,  10.450,  46.230,   2.210 ],
  [  43.653, -79.383,  37.090, -95.710 ],
  [  37.090, -95.710, -14.235, -51.925 ],
  [  19.076,  72.877,  51.507,  -0.127 ],
  [  19.076,  72.877, -25.274, 133.775 ],
];

/* ─────────────────────────────────────────────────────────────
   REUSABLE TEMP VECTORS
───────────────────────────────────────────────────────────── */
const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function ll2v3(lat: number, lon: number, r = 1.0): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta) * r,
     Math.cos(phi) * r,
     Math.sin(phi) * Math.sin(theta) * r,
  );
}

function buildArc(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
  lift = 0.26, n = 60,
): [number, number, number][] {
  const a   = ll2v3(lat1, lon1, 1.01);
  const b   = ll2v3(lat2, lon2, 1.01);
  const mid = new THREE.Vector3().addVectors(a, b).normalize().multiplyScalar(1 + lift);
  return new THREE.QuadraticBezierCurve3(a, mid, b)
    .getPoints(n)
    .map((v) => [v.x, v.y, v.z] as [number, number, number]);
}

/* ─────────────────────────────────────────────────────────────
   TEXTURED SPHERE — suspends via useTexture until image is ready
───────────────────────────────────────────────────────────── */
function TexturedSphere() {
  const texture = useTexture(globeImg as string);

  const material = useMemo(() => {
    texture.colorSpace  = THREE.SRGBColorSpace;
    texture.anisotropy  = 8;
    texture.needsUpdate = true;
    return new THREE.ShaderMaterial({
      vertexShader:   SPHERE_VERT,
      fragmentShader: SPHERE_FRAG,
      uniforms: {
        uMap:    { value: texture },
        uSunDir: { value: new THREE.Vector3(0.55, 0.38, 0.74).normalize() },
      },
    });
  }, [texture]);

  return (
    <mesh material={material} renderOrder={1}>
      <sphereGeometry args={[1, 128, 64]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   COUNTRY GLOW DISC
───────────────────────────────────────────────────────────── */
const glowGrad = (() => {
  const c   = document.createElement("canvas");
  c.width   = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g   = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0.00, "rgba(255,210,80,1.0)");
  g.addColorStop(0.28, "rgba(210,160,40,0.55)");
  g.addColorStop(0.60, "rgba(160,110,20,0.18)");
  g.addColorStop(1.00, "rgba(100,70,10,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t       = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
})();

function CountryGlow({ lat, lon, r, delay }: {
  lat: number; lon: number; r: number; delay: number;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const elapsed  = useRef(0);

  const { pos, quat } = useMemo(() => {
    const pos    = ll2v3(lat, lon, 1.005);
    const normal = pos.clone().normalize();
    const quat   = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), normal,
    );
    return { pos, quat };
  }, [lat, lon]);

  useFrame(({ camera }, delta) => {
    if (!meshRef.current) return;
    elapsed.current += delta;
    const reveal = Math.max(0, Math.min(1, (elapsed.current - delay) / 0.70));

    _va.setFromMatrixPosition(meshRef.current.matrixWorld);
    _vb.subVectors(camera.position, _va).normalize();
    const facing = Math.max(0, _va.clone().normalize().dot(_vb));

    const mat   = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = reveal * facing * 0.12;
  });

  return (
    <mesh ref={meshRef} position={pos} quaternion={quat} renderOrder={5}>
      <circleGeometry args={[r, 48]} />
      <meshBasicMaterial
        map={glowGrad}
        color="#ca8a04"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN SCENE
───────────────────────────────────────────────────────────── */
function GlobeScene({
  dragVelocity,
  userInteracting,
  hovered,
}: {
  dragVelocity:    React.MutableRefObject<{ x: number; y: number }>;
  userInteracting: React.MutableRefObject<boolean>;
  hovered:         React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Initial rotation: puts India / Middle East toward the camera.
  // ll2v3 and SphereGeometry UVs share the same coordinate system,
  // so arcs, glow markers and texture all rotate together consistently.
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = 3.42;
  }, []);

  const arcSets = useMemo(
    () => ARC_PAIRS.map(([la, lo, lb, ob]) => buildArc(la, lo, lb, ob)),
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (userInteracting.current) {
      groupRef.current.rotation.y += dragVelocity.current.x;
      groupRef.current.rotation.x  = Math.max(
        -0.42,
        Math.min(0.42, groupRef.current.rotation.x + dragVelocity.current.y),
      );
      dragVelocity.current.x *= 0.90;
      dragVelocity.current.y *= 0.90;
    } else {
      const speed = hovered.current ? 0.0005 : 0.0010;
      groupRef.current.rotation.y += speed * delta * 60;
      groupRef.current.rotation.x *= 0.97;
    }
  });

  return (
    <>
      <group ref={groupRef}>

        {/* ── 1. Photorealistic textured sphere ── */}
        <TexturedSphere />

        {/* ── 2. Country glow blooms ── */}
        {GLOW_MARKERS.map((m) => (
          <CountryGlow key={`${m.lat},${m.lon}`} {...m} />
        ))}

        {/* ── 3. Connection arcs ── */}
        {arcSets.map((pts, i) => (
          <Line
            key={i}
            points={pts}
            color={0xca8a04}
            lineWidth={0.45}
            transparent
            opacity={0.18}
          />
        ))}

      </group>

      {/* Sun light for the scene */}
      <directionalLight color="#fff8e7" intensity={1.6} position={[2.2, 1.5, 3.0]} />
      <ambientLight color="#18203a" intensity={0.30} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   CANVAS WRAPPER
───────────────────────────────────────────────────────────── */
export default function GlobeCanvas() {
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const isDragging      = useRef(false);
  const lastPointer     = useRef({ x: 0, y: 0 });
  const dragVelocity    = useRef({ x: 0, y: 0 });
  const userInteracting = useRef(false);
  const hovered         = useRef(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const sens = 0.0040;
      dragVelocity.current = {
        x: (e.clientX - lastPointer.current.x) * sens,
        y: (e.clientY - lastPointer.current.y) * sens,
      };
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (wrapperRef.current) wrapperRef.current.style.cursor = "grab";
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        userInteracting.current = false;
      }, 2000);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", aspectRatio: "1 / 1", cursor: "grab", touchAction: "none" }}
      onPointerEnter={() => { hovered.current = true; }}
      onPointerLeave={() => { hovered.current = false; }}
      onPointerDown={(e) => {
        isDragging.current      = true;
        userInteracting.current = true;
        lastPointer.current     = { x: e.clientX, y: e.clientY };
        if (wrapperRef.current) wrapperRef.current.style.cursor = "grabbing";
        clearTimeout(inactivityTimer.current);
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
        camera={{ position: [0.4, 0.1, 4.8], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <GlobeScene
          dragVelocity={dragVelocity}
          userInteracting={userInteracting}
          hovered={hovered}
        />
      </Canvas>
    </div>
  );
}

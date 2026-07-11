import { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";
import { useLocation } from "@tanstack/react-router";
import { useMailtoHref } from "@/lib/contact";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
// Rigid Boxes
import rigidMagneticClosure from "@/assets/products/rigid-magnetic-closure.webp";
import rigidDrawerBoxes from "@/assets/products/rigid-drawer-boxes.webp";
import rigidLidBase from "@/assets/products/rigid-lid-base.webp";
import rigidFoldable from "@/assets/products/rigid-foldable.webp";
import rigidJewellery from "@/assets/products/rigid-jewellery.webp";
import rigidCosmetic from "@/assets/products/rigid-cosmetic.webp";
import rigidCorporateGift from "@/assets/products/rigid-corporate-gift.webp";

// Paper Bags
import bagsKraft from "@/assets/products/bags-kraft.webp";
import bagsLaminated from "@/assets/products/bags-laminated.webp";
import bagsLuxury from "@/assets/products/bags-luxury.webp";
import bagsRetailCarry from "@/assets/products/bags-retail-carry.webp";
import bagsCustomPrinted from "@/assets/products/bags-custom-printed.webp";

// Commercial Printing
import printBrochure from "@/assets/products/print-brochure.webp";
import printCatalogue from "@/assets/products/print-catalogue.webp";
import printFlyers from "@/assets/products/print-flyers.webp";
import printLetterhead from "@/assets/products/print-letterhead.webp";
import printNotebooks from "@/assets/products/print-notebooks.webp";
import printCorporateStationery from "@/assets/products/print-corporate-stationery.webp";

// Barcode Labels
import labelProductBarcode from "@/assets/products/label-product-barcode.webp";
import labelPharmaceutical from "@/assets/products/label-pharmaceutical.webp";
import labelCosmetic from "@/assets/products/label-cosmetic.webp";
import labelFmcgFood from "@/assets/products/label-fmcg-food.webp";
import labelChemicalIndustrial from "@/assets/products/label-chemical-industrial.webp";
import labelVinylTransparent from "@/assets/products/label-vinyl-transparent.webp";
import labelTamperEvident from "@/assets/products/label-tamper-evident.webp";

// Calendars & Diaries
import calWall from "@/assets/products/cal-wall.webp";
import calDesk from "@/assets/products/cal-desk.webp";
import calCorporateDiaries from "@/assets/products/cal-corporate-diaries.webp";
import calExecutiveDiaries from "@/assets/products/cal-executive-diaries.webp";
import calCustomDiaries from "@/assets/products/cal-custom-diaries.webp";

// Marketing & Branding
import mktProductCatalogues from "@/assets/products/mkt-product-catalogues.webp";
import mktAnnualReports from "@/assets/products/mkt-annual-reports.webp";
import mktCorporateFiles from "@/assets/products/mkt-corporate-files.webp";
import mktDanglersWobblers from "@/assets/products/mkt-danglers-wobblers.webp";
import mktExhibitionMaterials from "@/assets/products/mkt-exhibition-materials.webp";

// Corrugated Boxes
import corrEcommerce from "@/assets/products/corr-ecommerce.webp";
import corrStandard from "@/assets/products/corr-standard.webp";
import corrHeavyDuty from "@/assets/products/corr-heavy-duty.webp";
import corrCustomPrinted from "@/assets/products/corr-custom-printed.webp";
import corrDieCut from "@/assets/products/corr-die-cut.webp";

const EASE = [0.16, 1, 0.3, 1] as const;

const PARALLAX_SPRING = { stiffness: 45, damping: 22, mass: 1.3 } as const;

type MouseCtxType = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  sectionHovered: boolean;
};
const MouseCtx = createContext<MouseCtxType | null>(null);

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

type Subtype = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  capabilities: string[];
  useCases: string[];
  materials: string[];
  finishes: string[];
  pairings: string[];
  image: string;
  imageAlt: string;
};

type Category = {
  id: string;
  code: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  subtypes: Subtype[];
};

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const ATLAS: Category[] = [
  {
    id: "rigid-boxes",
    code: "01",
    title: "Rigid Boxes",
    intro:
      "Luxury structural packaging engineered to a specification — across magnetic closure, drawer, lid & base, foldable and jewellery formats.",
    image: rigidMagneticClosure,
    imageAlt:
      "Premium luxury rigid box collection with gold foil stamping and velvet interior",
    subtypes: [
      {
        id: "magnetic-closure",
        name: "Magnetic Closure Boxes",
        tagline: "The definitive luxury unboxing format.",
        description:
          "Magnetic closure rigid boxes deliver the most tactile unboxing moment in premium packaging. The hidden magnet mechanism creates a satisfying, precise close — associated with luxury fragrance, jewellery, and high-value gifting. Available in greyboard constructions from 1200–2400 GSM, wrapped in art, textured, or specialty papers with any finishing combination.",
        capabilities: [
          "Hidden neodymium magnet closure mechanism",
          "Custom interior foam, velvet and satin inserts",
          "Foil stamping, embossing and spot UV finishing",
          "Box-in-box and sleeve outer configurations",
        ],
        useCases: ["Luxury fragrance & cosmetics", "High-value gifting & hampers", "Premium jewellery retail"],
        materials: ["Greyboard 1200–2400 GSM", "Art paper wrap 130–170 GSM", "Specialty textured wrap"],
        finishes: ["Soft-touch lamination", "Hot foil stamping", "Spot UV", "Embossing / Debossing"],
        pairings: ["paper-bags", "marketing-branding", "commercial-printing"],
        image: rigidMagneticClosure,
        imageAlt: "Luxury rigid box with magnetic closure and gold foil embossed logo on velvet interior",
      },
      {
        id: "drawer-boxes",
        name: "Drawer Type Boxes",
        tagline: "Sliding reveal. Engineered for discovery.",
        description:
          "Drawer boxes create a horizontal reveal that positions the product as the centrepiece. Ideal for jewellery, watches, cosmetics and corporate gifting, they can be produced with ribbon pull tabs, custom velvet trays, and multi-compartment inserts. The sliding motion adds a layer of ceremony to the unboxing experience.",
        capabilities: [
          "Ribbon pull tab mechanism",
          "Velvet and foam tray inserts",
          "Multi-compartment configurations",
          "Sleeve and outer box pairing",
        ],
        useCases: ["Watches & jewellery", "Corporate gifts", "Premium confectionery"],
        materials: ["Greyboard 1600–2000 GSM", "Duplex and texture wrap", "Velvet and satin lining"],
        finishes: ["Matte lamination", "Foil blocking", "Debossing", "Varnish coating"],
        pairings: ["paper-bags", "corrugated-boxes"],
        image: rigidDrawerBoxes,
        imageAlt: "Drawer style rigid packaging box with velvet tray insert and ribbon pull tab",
      },
      {
        id: "lid-base",
        name: "Lid & Base Boxes",
        tagline: "Classic structure. Timeless presence.",
        description:
          "Lid and base rigid boxes are the most versatile format in the rigid box family — stackable, reusable, and suitable for everything from apparel to electronics. The separate lid and base construction allows full independent decoration of both components, enabling layered branding experiences across the full outer surface.",
        capabilities: [
          "Telescope and crash-lock base formats",
          "Full independent lid and base decoration",
          "Foam, tissue and custom tray interiors",
          "Straight wall and stepped lid profiles",
        ],
        useCases: ["Luxury apparel & accessories", "Electronics and tech gifting", "Premium food & confectionery"],
        materials: ["Greyboard 1200–1600 GSM", "Art paper wrap", "Uncoated and textured wrap"],
        finishes: ["Gloss lamination", "Matte lamination", "Spot UV", "Foil blocking"],
        pairings: ["corrugated-boxes", "paper-bags"],
        image: rigidLidBase,
        imageAlt: "Classic lid and base rigid box with premium matte laminate finish and brand identity",
      },
      {
        id: "foldable-rigid",
        name: "Foldable Rigid Boxes",
        tagline: "Full rigid quality. Flat-pack efficiency.",
        description:
          "Foldable rigid boxes deliver the look and feel of a traditional rigid box but collapse flat for shipping and storage — reducing freight costs without compromising on material quality or structural integrity. The magnetic or velcro closure mechanism locks the box securely in its assembled form, making them ideal for e-commerce premium delivery.",
        capabilities: [
          "Flat-pack for cost-efficient shipping",
          "Magnetic or velcro closure lock",
          "Full rigid board construction",
          "Custom interior configurations",
        ],
        useCases: ["E-commerce premium delivery", "Subscription box programmes", "Corporate gifting at scale"],
        materials: ["Greyboard 800–1200 GSM", "Art paper and texture wraps", "EVA foam inserts"],
        finishes: ["Soft-touch lamination", "Cold foil", "Spot UV", "Embossing"],
        pairings: ["corrugated-boxes", "marketing-branding"],
        image: rigidFoldable,
        imageAlt: "Foldable rigid box in flat-pack form with magnetic closure mechanism and premium wrap",
      },
      {
        id: "jewellery-boxes",
        name: "Jewellery Boxes",
        tagline: "Precision at the smallest scale.",
        description:
          "Jewellery packaging demands precision at every scale — from ring boxes to multi-tier presentation cases. Our jewellery box range spans micro constructions for single stones to full tiered display cases, all available with custom velvet, suede, and microfibre interiors engineered to hold your specific product without movement.",
        capabilities: [
          "Ring, bangle, bracelet and necklace formats",
          "Velvet, suede and microfibre interiors",
          "Multi-tier display cases",
          "Custom cut foam inserts",
        ],
        useCases: ["Fine jewellery retail", "Luxury fashion accessories", "Bridal and occasion gifting"],
        materials: ["Premium leatherette wrap", "Velvet and suede interior", "Rigid foam padding"],
        finishes: ["Gold foil debossing", "Stitched edges", "Mirror-polished clasps"],
        pairings: ["paper-bags", "marketing-branding"],
        image: rigidJewellery,
        imageAlt: "Premium jewellery box with velvet interior and gold foil debossed brand logo",
      },
      {
        id: "cosmetic-packaging",
        name: "Cosmetic Packaging Boxes",
        tagline: "Where skincare meets structural excellence.",
        description:
          "Cosmetic packaging sits at the intersection of regulatory compliance and brand desire. Our cosmetic box range accommodates standard product dimensions across serums, creams, perfumes and beauty tools — with full colour printing, tactile finishing, and interior insert configurations that keep product secure and presentation precise.",
        capabilities: [
          "Product-specific interior die-cuts",
          "Full CMYK + Pantone colour accuracy",
          "Tamper-evident closure options",
          "Eco-certified substrate options",
        ],
        useCases: ["Luxury skincare brands", "Fragrance houses", "Premium beauty retail"],
        materials: ["Art board 300–400 GSM", "Recycled and FSC-certified stocks", "Specialty textured wraps"],
        finishes: ["Soft-touch lamination", "Spot UV", "Foil blocking", "Embossing"],
        pairings: ["paper-bags", "marketing-branding", "commercial-printing"],
        image: rigidCosmetic,
        imageAlt: "Premium cosmetic packaging box with matte texture finish and spot UV brand logo",
      },
      {
        id: "corporate-gift-boxes",
        name: "Corporate Gift Boxes",
        tagline: "The brand impression that lasts all year.",
        description:
          "Corporate gift boxes are brand investments — the quality of the packaging communicates the company's values before the gift is revealed. We engineer corporate gift boxes to accommodate multi-product configurations, custom foam and fabric inserts, and all finishing options from foil to soft-touch, ensuring your gifting programme reflects your brand standard.",
        capabilities: [
          "Multi-product interior configurations",
          "Custom fabric and foam inserts",
          "Ribbon, magnet and velcro closures",
          "Branded tissue paper and filler",
        ],
        useCases: ["Year-end corporate gifting", "Client acquisition programmes", "Employee recognition"],
        materials: ["Greyboard 1400–2000 GSM", "Premium wrap papers", "Custom interior fabric"],
        finishes: ["Soft-touch lamination", "Hot foil stamping", "Embossing", "Custom ribbon"],
        pairings: ["calendars-diaries", "marketing-branding", "commercial-printing"],
        image: rigidCorporateGift,
        imageAlt: "Corporate gift box with multi-product foam interior, branded ribbon and foil stamped logo",
      },
    ],
  },
  {
    id: "paper-bags",
    code: "02",
    title: "Paper Bags",
    intro:
      "Retail and luxury paper bags — from kraft essentials to premium laminated board — printed, finished and handled to carry your brand with confidence.",
    image: bagsKraft,
    imageAlt: "Premium luxury paper bag collection with ribbon handles and foil brand details",
    subtypes: [
      {
        id: "kraft-bags",
        name: "Kraft Paper Bags",
        tagline: "Natural. Honest. Built to carry.",
        description:
          "Kraft paper bags are the foundation of sustainable retail carry packaging — available in natural brown and bleached white, in weights from 90–150 GSM. Suitable for food, grocery, retail and gifting applications, kraft bags offer a tactile, natural quality that complements both minimal and expressive brand aesthetics with complete recyclability.",
        capabilities: [
          "Natural brown and bleached white kraft",
          "Twisted, flat and rope handle options",
          "Flexographic and digital print",
          "Water-based and aqueous coatings",
        ],
        useCases: ["Food & bakery retail", "Grocery and specialty stores", "Eco-positioned brand gifting"],
        materials: ["Kraft 90–150 GSM", "Recycled and FSC-certified kraft", "Water-based coatings"],
        finishes: ["Flexographic print", "Spot UV", "Water-based varnish"],
        pairings: ["corrugated-boxes", "commercial-printing"],
        image: bagsKraft,
        imageAlt: "Natural kraft paper bag with twisted paper handle and branded flexographic print",
      },
      {
        id: "laminated-bags",
        name: "Laminated Paper Bags",
        tagline: "Structure. Sheen. Substance.",
        description:
          "Laminated paper bags combine a heavy art card substrate with a surface laminate — gloss, matte, or soft-touch — to create a rigid, premium carry format. The lamination adds structural integrity, water resistance, and a distinctly premium feel that positions the bag as an extension of the brand rather than a functional carrier.",
        capabilities: [
          "Art card 250–350 GSM construction",
          "Gloss, matte and soft-touch lamination",
          "Rope, ribbon and die-cut handle options",
          "Full offset print and foil blocking",
        ],
        useCases: ["Fashion boutique retail", "Luxury food and confectionery", "Premium beauty and cosmetics"],
        materials: ["Art card 250–350 GSM", "Premium board 350–400 GSM", "BOPP lamination films"],
        finishes: ["Gloss lamination", "Matte lamination", "Soft-touch lamination", "Foil blocking"],
        pairings: ["rigid-boxes", "marketing-branding"],
        image: bagsLaminated,
        imageAlt: "Laminated paper bag with satin ribbon handle and soft-touch matte finish brand print",
      },
      {
        id: "luxury-bags",
        name: "Luxury Paper Bags",
        tagline: "The bag that stays after the purchase.",
        description:
          "Luxury paper bags are engineered to be kept — a secondary packaging element that reinforces brand perception at the moment of purchase and beyond. Built from premium board, finished with foil, embossing or soft-touch, and fitted with satin or grosgrain ribbon handles, these bags are designed to outlast the occasion.",
        capabilities: [
          "Premium board 350–500 GSM",
          "Satin and grosgrain ribbon handles",
          "Spot UV, foil and embossing finishing",
          "Tissue paper and branded insert options",
        ],
        useCases: ["Luxury retail flagship stores", "High-end gifting and hampers", "Premium hospitality and hotel groups"],
        materials: ["Premium board 350–500 GSM", "Duplex and specialty stocks", "Satin and grosgrain ribbon"],
        finishes: ["Foil blocking", "Embossing / Debossing", "Spot UV", "Soft-touch lamination"],
        pairings: ["rigid-boxes", "marketing-branding", "commercial-printing"],
        image: bagsLuxury,
        imageAlt: "Luxury paper bag in premium board with gold foil stamping and satin ribbon handle",
      },
      {
        id: "retail-carry-bags",
        name: "Retail Carry Bags",
        tagline: "High volume. Uncompromising quality.",
        description:
          "Retail carry bags are produced at volume for consistent daily use — in stores, at exhibitions, at events. The focus is on print fidelity, handle strength, and structural repeatability across large print runs. Available in a range of sizes from small boutique formats to large department-store configurations.",
        capabilities: [
          "High-volume offset production",
          "Reinforced base and handle attachment",
          "PMS colour accuracy across runs",
          "Multiple size configurations",
        ],
        useCases: ["Department stores and retail chains", "Trade shows and exhibitions", "Pharmaceutical and FMCG retail"],
        materials: ["Art card 200–300 GSM", "Recycled board options", "Reinforced handle attachments"],
        finishes: ["Gloss lamination", "Matte lamination", "Spot UV"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: bagsRetailCarry,
        imageAlt: "Retail carry bag in high-volume production with precise brand offset print",
      },
      {
        id: "custom-printed-bags",
        name: "Custom Printed Bags",
        tagline: "Every surface. Every detail. Your brand.",
        description:
          "Custom printed bags are designed from scratch to brief — non-standard structures, bespoke handle configurations, die-cut shapes, and printed surfaces that treat the bag as a full brand canvas. We handle structural engineering, artwork preparation, and production, delivering a finished bag that is entirely unique to your brand.",
        capabilities: [
          "Fully bespoke structural design",
          "Die-cut and shaped bag formats",
          "Full canvas print — inside and out",
          "Custom handle materials and hardware",
        ],
        useCases: ["Brand identity launches", "Limited edition collections", "Luxury event gifting"],
        materials: ["Any substrate from 90–500 GSM", "Specialty and duplex boards", "Custom handle materials"],
        finishes: ["Any combination of lamination, foil, UV, embossing"],
        pairings: ["rigid-boxes", "marketing-branding", "commercial-printing"],
        image: bagsCustomPrinted,
        imageAlt: "Custom printed paper bag with bespoke die-cut shape and full-surface brand print",
      },
    ],
  },
  {
    id: "commercial-printing",
    code: "03",
    title: "Commercial Printing",
    intro:
      "High-quality commercial print across brochures, catalogues, books and stationery — produced consistently at volume with ISO-calibrated colour management.",
    image: printBrochure,
    imageAlt: "Premium commercial printing including brochures, catalogues and corporate stationery",
    subtypes: [
      {
        id: "brochures",
        name: "Brochures",
        tagline: "Your brand argument. Built to persuade.",
        description:
          "Brochures are the most versatile collateral format in commercial print — used in sales presentations, trade exhibitions, direct mail and as digital supplements. We produce brochures from single DL folds to 48-page perfect-bound formats, calibrated to ISO 12647-2 for colour consistency across any run volume.",
        capabilities: [
          "DL, A5, A4 and custom sizes",
          "Saddle-stitch, perfect bind and folded formats",
          "ISO 12647-2 colour management",
          "Short-run digital to ultra-high offset",
        ],
        useCases: ["Sales and product presentations", "Trade exhibitions and events", "Direct mail campaigns"],
        materials: ["Art paper 90–300 GSM", "Coated woodfree 80–200 GSM", "Uncoated and laid stocks"],
        finishes: ["Gloss and matte lamination", "Soft-touch lamination", "Spot UV", "Foil blocking"],
        pairings: ["marketing-branding", "calendars-diaries"],
        image: printBrochure,
        imageAlt: "Premium corporate brochure with matte lamination soft-touch cover and offset interior",
      },
      {
        id: "catalogues",
        name: "Catalogues",
        tagline: "Every product. One considered document.",
        description:
          "Product and trade catalogues demand colour accuracy, structural durability, and a layout that guides the reader through a complex range without friction. We produce catalogues from 16 to 300+ pages, with cover options from soft laminated boards to hard case binding, and paper stocks matched to the product category.",
        capabilities: [
          "16 to 300+ page configurations",
          "Soft cover to case-bound hard cover",
          "Colour-managed plate-to-plate consistency",
          "Section-sewn and burst binding options",
        ],
        useCases: ["Product range documentation", "Trade and wholesale catalogues", "Annual brand reference materials"],
        materials: ["Art paper 90–170 GSM inner", "Art board 250–350 GSM cover", "Matt and gloss coated"],
        finishes: ["Soft-touch cover lamination", "Foil blocking on cover", "Spot UV", "Ribbon marker"],
        pairings: ["marketing-branding", "rigid-boxes"],
        image: printCatalogue,
        imageAlt: "Premium product catalogue with hard case binding and foil-blocked cover detail",
      },
      {
        id: "flyers-leaflets",
        name: "Flyers & Leaflets",
        tagline: "Precision communication. Immediate impact.",
        description:
          "Flyers and leaflets are the most immediate format in commercial print — designed for single-message clarity, produced in high volume, and distributed for impact. We print flyers from 90 GSM lightweight promotional stock to 350 GSM premium board for high-value single-page presentations.",
        capabilities: [
          "90–350 GSM substrate range",
          "DL, A6, A5, A4 and custom sizes",
          "High-volume digital and offset production",
          "Water-based and UV coating options",
        ],
        useCases: ["Point of sale promotions", "Event and exhibition handouts", "Direct mail inserts"],
        materials: ["Art paper 90–170 GSM", "Art board 250–350 GSM", "Recycled and uncoated options"],
        finishes: ["Gloss UV coating", "Matte varnish", "Spot UV", "Aqueous coating"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: printFlyers,
        imageAlt: "Premium branded flyer with spot UV finish and precision full-colour offset print",
      },
      {
        id: "letterheads-envelopes",
        name: "Letterheads & Envelopes",
        tagline: "The brand detail that closes the deal.",
        description:
          "Corporate stationery is the most repeated brand touchpoint in business communication — letterheads, compliment slips and envelopes that carry your identity across every piece of correspondence. We produce stationery suites on premium bond, laid and watermarked papers for a distinguished presence in every interaction.",
        capabilities: [
          "Letterhead, compliment slip and envelope suites",
          "Watermarked and laid paper options",
          "Two-sided precision print",
          "Window and non-window envelope formats",
        ],
        useCases: ["Corporate correspondence", "Legal and professional firms", "Premium hospitality and banking"],
        materials: ["Bond 90–100 GSM", "Laid and watermarked stocks", "Premium uncoated 100–120 GSM"],
        finishes: ["Embossing / Debossing", "Foil blocking", "Thermographic print"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: printLetterhead,
        imageAlt: "Premium corporate letterhead with embossed logo on laid watermarked paper stock",
      },
      {
        id: "book-printing",
        name: "Notebooks & Book Printing",
        tagline: "Pages that hold ideas. Covers that hold attention.",
        description:
          "Book printing at DGV spans corporate notebooks, branded diaries, trade directories and commissioned publications. Each project is produced with paper stocks matched to intended use — fountain-pen compatible uncoated, smooth coated for illustration, or premium laid for a distinguished writing experience.",
        capabilities: [
          "Perfect binding, saddle-stitch, spiral and case binding",
          "Fountain-pen compatible inner stocks",
          "Custom endpapers and flyleaves",
          "Full-colour interior print with colour management",
        ],
        useCases: ["Corporate branded notebooks", "Trade publications and directories", "Commissioned books and publications"],
        materials: ["Art paper 70–120 GSM inner", "Art board 250–400 GSM cover", "Uncoated and laid stocks"],
        finishes: ["Soft-touch lamination", "Foil blocking", "Ribbon bookmark", "Gilt-edge gilding"],
        pairings: ["calendars-diaries", "marketing-branding"],
        image: printNotebooks,
        imageAlt: "Premium corporate notebook with case binding and foil-blocked cover",
      },
      {
        id: "corporate-stationery",
        name: "Corporate Stationery",
        tagline: "Coherence across every printed surface.",
        description:
          "Corporate stationery suites — covering business cards, notepads, visiting card holders, folders and presentation materials — are produced as a coherent system. Every element is colour-managed to a consistent brand specification, ensuring the card handed across a meeting table matches the folder presented in a boardroom.",
        capabilities: [
          "Business cards, notepads and compliment slips",
          "Presentation and document folders",
          "Rigid and soft card holder options",
          "Full system colour management",
        ],
        useCases: ["Corporate brand launches", "Sales team and frontline collateral", "Boardroom and executive presentations"],
        materials: ["Art board 300–400 GSM cards", "Bond paper 80–120 GSM notepads", "Premium folder board"],
        finishes: ["Spot UV", "Foil blocking", "Soft-touch lamination", "Die-cutting"],
        pairings: ["marketing-branding", "commercial-printing"],
        image: printCorporateStationery,
        imageAlt: "Complete corporate stationery suite with business cards, notepads and premium folder",
      },
    ],
  },
  {
    id: "barcode-labels",
    code: "04",
    title: "Barcode Labels",
    intro:
      "Precision-printed self-adhesive labels for product identification, compliance and traceability — produced on high-speed narrow-web flexographic presses across paper, film and specialty label stocks.",
    image: labelProductBarcode,
    imageAlt: "Roll and sheet barcode labels applied to bottles, jars, cartons and boxes with matching gold hexagon brand mark",
    subtypes: [
      {
        id: "product-barcode-labels",
        name: "Product & Barcode Labels",
        tagline: "Every unit, identified and traceable.",
        description:
          "Product and barcode labels are produced on narrow-web flexographic presses for exceptional print consistency at volume, with printing, varnishing, die-cutting, slitting and rewinding completed in a single continuous pass.",
        capabilities: [
          "Single-pass print, varnish and die-cut",
          "Water-based, UV-curable and LED UV ink systems",
          "Slitting and rewinding to roll or sheet",
          "Sequential and variable barcode data",
        ],
        useCases: ["Product identification", "Inventory and warehouse tracking", "Retail point-of-sale scanning"],
        materials: ["Self-adhesive paper", "PP (BOPP)", "PET", "Specialty label stocks"],
        finishes: ["Gloss and matte lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: labelProductBarcode,
        imageAlt: "Roll and sheet barcode labels applied to bottles, jars, cartons and boxes with matching gold hexagon brand mark",
      },
      {
        id: "pharmaceutical-labels",
        name: "Pharmaceutical Labels",
        tagline: "Precision where accuracy is non-negotiable.",
        description:
          "Pharmaceutical labels are produced with the same single-pass flexographic precision used across our label range — printing, laminating and die-cutting inline for consistent, legible results across every unit in the run.",
        capabilities: [
          "Variable information printing (batch, expiry, dosage)",
          "Water-based, UV-curable and LED UV ink systems",
          "Self-adhesive and specialty pharma-grade stocks",
          "Narrow-web precision die-cutting",
        ],
        useCases: ["Pharmaceutical packaging", "Dosage and batch compliance", "Cold-chain and blister labelling"],
        materials: ["Self-adhesive paper", "PET", "Specialty label stocks"],
        finishes: ["Matte and gloss lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["commercial-printing", "rigid-boxes"],
        image: labelPharmaceutical,
        imageAlt: "Pharmaceutical labels on vials, amber bottles, tablet jars and cartons with matching gold hexagon brand mark",
      },
      {
        id: "cosmetic-labels",
        name: "Cosmetic Labels",
        tagline: "Shelf presence, printed to specification.",
        description:
          "Cosmetic labels are produced on narrow-web flexographic presses with inline lamination and UV varnish, delivering the print consistency and finish quality that beauty and personal care packaging demands.",
        capabilities: [
          "High-opacity metallic and specialty finishes",
          "Water-based, UV-curable and LED UV ink systems",
          "Transparent and film-based label stocks",
          "Narrow-web precision die-cutting",
        ],
        useCases: ["Beauty and personal care retail", "Boutique and premium cosmetic lines", "Gift and travel packaging"],
        materials: ["Vinyl", "Transparent films", "Metallic label stocks", "PET"],
        finishes: ["Gloss and matte lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["rigid-boxes", "marketing-branding"],
        image: labelCosmetic,
        imageAlt: "Cosmetic labels on serum bottles, pump dispensers, tubes and jars with matching gold hexagon brand mark",
      },
      {
        id: "fmcg-food-labels",
        name: "FMCG & Food Labels",
        tagline: "Built for volume. Compliant by design.",
        description:
          "FMCG and food & beverage labels are produced at high speed on narrow-web flexographic presses, with substrate and ink systems selected to meet food-contact and durability requirements at production volume.",
        capabilities: [
          "High-speed narrow-web production",
          "Water-based, UV-curable and LED UV ink systems",
          "Waterproof and moisture-resistant stocks",
          "Slitting and rewinding to roll or sheet",
        ],
        useCases: ["FMCG retail packaging", "Food and beverage labelling", "High-volume distribution and export"],
        materials: ["Self-adhesive paper", "PP (BOPP)", "Waterproof materials"],
        finishes: ["Gloss and matte lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["commercial-printing", "corrugated-boxes"],
        image: labelFmcgFood,
        imageAlt: "FMCG and food labels on cooking oil, sauce and jam jars, snack pouches, cartons and wrappers with matching gold hexagon brand mark",
      },
      {
        id: "chemical-labels",
        name: "Chemical & Industrial Labels",
        tagline: "Durable identification for demanding environments.",
        description:
          "Chemical and industrial labels are produced on durable, chemical- and abrasion-resistant stocks, printed inline with the same flexographic precision used across our narrow-web label range.",
        capabilities: [
          "Chemical and abrasion-resistant stocks",
          "Water-based, UV-curable and LED UV ink systems",
          "Sequential and variable data printing",
          "Narrow-web precision die-cutting",
        ],
        useCases: ["Chemical drum and container labelling", "Industrial and logistics identification", "Shipping and warehouse tracking"],
        materials: ["PP (BOPP)", "PET", "Waterproof materials"],
        finishes: ["Matte lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["corrugated-boxes", "commercial-printing"],
        image: labelChemicalIndustrial,
        imageAlt: "Chemical and industrial labels with GHS hazard pictograms on drums, pails and containers with matching gold hexagon brand mark",
      },
      {
        id: "vinyl-transparent-labels",
        name: "Vinyl & Transparent Labels",
        tagline: "The no-label look, printed to precision.",
        description:
          "Vinyl and transparent labels are printed on clear and film-based stocks for a seamless, no-label aesthetic — produced with the same inline lamination and die-cutting precision as our full label range.",
        capabilities: [
          "Clear and film-based substrates",
          "Water-based, UV-curable and LED UV ink systems",
          "No-label-look application",
          "Narrow-web precision die-cutting",
        ],
        useCases: ["Premium beverage and cosmetic packaging", "Window and glass application", "Brand-forward retail presentation"],
        materials: ["Transparent films", "Vinyl", "PET"],
        finishes: ["Gloss lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["marketing-branding", "rigid-boxes"],
        image: labelVinylTransparent,
        imageAlt: "Vinyl labels on dark bottles, pouches and jars, and transparent no-label-look labels on clear bottles and jars, with matching gold hexagon brand mark",
      },
      {
        id: "tamper-evident-labels",
        name: "Tamper-Evident & Security Labels",
        tagline: "Visible proof the seal was never broken.",
        description:
          "Tamper-evident and security labels are engineered to leave a visible void or fracture pattern on removal, giving buyers a clear, reliable signal of product integrity from production through to point of sale.",
        capabilities: [
          "Void and fracture-pattern security stocks",
          "Water-based, UV-curable and LED UV ink systems",
          "Sequential numbering and security codes",
          "Narrow-web precision die-cutting",
        ],
        useCases: ["Pharmaceutical and healthcare seals", "Food and beverage safety seals", "Warranty and electronics packaging"],
        materials: ["Security label stocks", "PET", "Self-adhesive paper"],
        finishes: ["Matte lamination", "UV varnish coating", "Die-cut to shape"],
        pairings: ["commercial-printing", "rigid-boxes"],
        image: labelTamperEvident,
        imageAlt: "Tamper-evident void labels, holographic security seals, QR verification and security code cards with matching gold hexagon brand mark",
      },
    ],
  },
  {
    id: "calendars-diaries",
    code: "05",
    title: "Calendars & Diaries",
    intro:
      "Branded calendars and diaries designed and produced in-house — a daily brand touchpoint engineered to be used, kept, and seen every day of the year.",
    image: calCorporateDiaries,
    imageAlt: "Premium corporate diary collection with PU leather covers and gilt-edge pages",
    subtypes: [
      {
        id: "wall-calendars",
        name: "Wall Calendars",
        tagline: "365 days on the wall. One year of brand presence.",
        description:
          "Wall calendars are the most consistent daily brand impression available in corporate gifting — visible to your client every day of the year. We design and produce wall calendars from A3 format through to large-format showpieces, with art direction, photography selection, and layout all handled by our in-house studio.",
        capabilities: [
          "A3, A2 and custom large formats",
          "Full colour art direction in-house",
          "Spiral wire-o and saddle-stitch binding",
          "Tear-off monthly and annual formats",
        ],
        useCases: ["Corporate gifting and client retention", "Real estate and financial brands", "FMCG and retail brand campaigns"],
        materials: ["Art paper 130–170 GSM inner", "Art board 300–400 GSM cover", "Spiral wire binding"],
        finishes: ["Gloss and matte lamination", "Foil blocking on cover", "Spot UV"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: calWall,
        imageAlt: "Premium corporate wall calendar with art direction and full-bleed photography",
      },
      {
        id: "desk-calendars",
        name: "Desk Calendars",
        tagline: "The daily desk presence. Always in view.",
        description:
          "Desk calendars occupy a permanent position in the client's workspace — referred to multiple times a day. Our desk calendar range includes standing tent formats, flat desk pads, and spiral-bound easel configurations, all designed with a consistent brand grid that ensures legibility and brand prominence at every date.",
        capabilities: [
          "Tent, easel and flat desk pad formats",
          "Tear-off monthly and weekly date formats",
          "Easel stand in card, acrylic and metal",
          "Branded logo panel at base of each sheet",
        ],
        useCases: ["Office supply gifting", "Financial and insurance firms", "Pharmaceutical client gifting"],
        materials: ["Art paper 120–200 GSM", "Spiral wire binding", "Acrylic and card easel bases"],
        finishes: ["Matte lamination on covers", "Spot UV on logo panel"],
        pairings: ["commercial-printing", "calendars-diaries"],
        image: calDesk,
        imageAlt: "Premium corporate desk calendar in easel format with branded logo panel at base",
      },
      {
        id: "corporate-diaries",
        name: "Corporate Diaries",
        tagline: "Used every day. Seen by everyone.",
        description:
          "Corporate diaries are the single most used gifting format in Indian business culture — a daily brand touchpoint that persists across the entire year. We produce corporate diaries with PU leather, hard-cover board, and specialty material covers, on 80–100 GSM inner stocks suited to fountain pen and ballpoint writing.",
        capabilities: [
          "PU leather, hard board and specialty covers",
          "Dated and undated formats",
          "80–100 GSM inner stock options",
          "Ribbon bookmark, elastic closure, pen loop",
        ],
        useCases: ["Year-end corporate gifting", "Employee recognition programmes", "Client retention gifting"],
        materials: ["PU leather covers", "Art board 300–400 GSM covers", "Bond 80–100 GSM inner"],
        finishes: ["Foil blocking on cover", "Debossing", "Ribbon bookmark", "Gilt-edge gilding"],
        pairings: ["calendars-diaries", "marketing-branding"],
        image: calCorporateDiaries,
        imageAlt: "Premium corporate diary with PU leather cover gilt-edge pages and ribbon bookmark",
      },
      {
        id: "executive-diaries",
        name: "Executive Diaries",
        tagline: "The gift that signals distinction.",
        description:
          "Executive diaries are produced to a higher material specification — genuine leather or premium leatherette covers, gilt-edge paper, silk ribbon markers, and presentation boxed delivery. Designed for C-suite gifting and high-value client relationships, they communicate brand quality through material choice alone.",
        capabilities: [
          "Genuine leather and premium leatherette",
          "Gilt-edge and silver-edge page gilding",
          "Multiple silk ribbon markers",
          "Presentation box delivery",
        ],
        useCases: ["C-suite and board gifting", "High-value client relationships", "Brand ambassador and awards"],
        materials: ["Genuine leather covers", "Premium leatherette", "90–100 GSM inner stock"],
        finishes: ["Gilt-edge gilding", "Silver-edge gilding", "Blind embossing", "Presentation boxed"],
        pairings: ["rigid-boxes", "marketing-branding"],
        image: calExecutiveDiaries,
        imageAlt: "Executive diary in genuine leather with gilt-edge pages and presentation gift box",
      },
      {
        id: "custom-diaries",
        name: "Custom Designed Diaries",
        tagline: "Every page. Your brand.",
        description:
          "Custom designed diaries are produced entirely to brief — cover design, internal layout, month spread architecture, divider pages, and branded content sections all designed by our studio. The result is a diary that is not an off-the-shelf product with a logo added but an original branded artefact, unique to your organisation.",
        capabilities: [
          "Full studio design from brief",
          "Custom month spread and layout",
          "Branded divider and section pages",
          "Dated and non-dated formats",
        ],
        useCases: ["Brand identity reinforcement", "Luxury brand gifting", "High-specification corporate gifting"],
        materials: ["Any cover material", "Any inner stock from 70–100 GSM"],
        finishes: ["Any — foil, emboss, UV, lamination, gilding"],
        pairings: ["commercial-printing", "marketing-branding", "rigid-boxes"],
        image: calCustomDiaries,
        imageAlt: "Custom branded diary with full studio-designed layout and foil blocked cover",
      },
    ],
  },
  {
    id: "marketing-branding",
    code: "06",
    title: "Marketing & Branding",
    intro:
      "Print collaterals that carry your brand into presentations, exhibitions and decision-maker hands — finished to a standard that communicates before a word is read.",
    image: mktProductCatalogues,
    imageAlt: "Premium marketing and branding collateral including folders and exhibition materials",
    subtypes: [
      {
        id: "product-catalogues",
        name: "Product Catalogues",
        tagline: "Your complete range. One reference document.",
        description:
          "Product catalogues are produced as comprehensive brand reference documents — designed to be kept, shared, and consulted. We handle the full process: layout, colour management, paper specification, binding and finishing, producing a catalogue that represents your complete product range with editorial precision.",
        capabilities: [
          "16 to 300+ page formats",
          "Product photography integration",
          "Colour-managed plate-to-plate consistency",
          "Hard and soft cover options",
        ],
        useCases: ["Trade and wholesale distribution", "Exhibition and showroom reference", "Retail buyer presentations"],
        materials: ["Art paper 90–170 GSM inner", "Art board 250–350 GSM cover"],
        finishes: ["Soft-touch lamination", "Foil blocking", "Spot UV", "Case binding"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: mktProductCatalogues,
        imageAlt: "Premium product catalogue with editorial layout and foil-blocked cover design",
      },
      {
        id: "corporate-profiles",
        name: "Corporate Profiles & Annual Reports",
        tagline: "The document that defines the company.",
        description:
          "Corporate profiles and annual reports are produced to the highest standard in our portfolio — the document that represents an organisation to its stakeholders, investors and board. We produce these with the full range of premium finishes, specialty papers, and structural complexity that the occasion demands.",
        capabilities: [
          "Print Studio art direction and layout",
          "Premium specialty paper stocks",
          "Case binding and ribbon markers",
          "Multiple insert and section configurations",
        ],
        useCases: ["Investor relations and AGM", "Stakeholder communications", "Corporate brand launches"],
        materials: ["Premium art paper 120–200 GSM", "Specialty and tactile stocks", "Art board 300–400 GSM cover"],
        finishes: ["Soft-touch lamination", "Foil blocking", "Spot UV", "Embossing"],
        pairings: ["commercial-printing", "calendars-diaries"],
        image: mktAnnualReports,
        imageAlt: "Premium annual report with soft-touch cover and foil-blocked corporate identity",
      },
      {
        id: "presentation-folders",
        name: "Presentation Folders",
        tagline: "The carrier for your most important argument.",
        description:
          "Presentation folders are produced to hold and organise collateral presented in sales meetings, pitches and tenders. Available with single and double pockets, card slots, and USB inserts, they are finished to the same standard as the brochures they carry — ensuring that the folder is not a compromise on the materials inside.",
        capabilities: [
          "Single and double pocket configurations",
          "Business card and USB inserts",
          "Spine options from 3mm to 50mm",
          "Full bleed interior print options",
        ],
        useCases: ["Sales pitches and tenders", "Conference and exhibition presentations", "New business development"],
        materials: ["Art board 300–400 GSM", "Premium duplex stocks", "Specialty textured boards"],
        finishes: ["Soft-touch lamination", "Foil blocking", "Spot UV", "Die-cutting"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: mktCorporateFiles,
        imageAlt: "Premium presentation folder with double pocket and embossed corporate logo",
      },
      {
        id: "danglers-wobblers",
        name: "Danglers & Wobblers",
        tagline: "Motion at point of sale. Attention by design.",
        description:
          "Danglers and wobblers are point-of-sale materials engineered to capture attention in retail environments. Wobblers use a flexible adhesive arm that creates movement at shelf level; danglers hang from ceilings, gondola ends and display fixtures. Both are produced with high-impact colour print and water-resistant coatings for retail durability.",
        capabilities: [
          "Wobbler arm and adhesive base",
          "Ceiling hang and gondola configurations",
          "Water-resistant coatings",
          "Die-cut custom shapes",
        ],
        useCases: ["FMCG shelf promotions", "Pharmacy and supermarket POS", "Retail brand events"],
        materials: ["PVC 250–350 micron", "Art board 300–400 GSM", "Synthetic substrates"],
        finishes: ["Gloss UV coating", "Water-resistant varnish", "Die-cutting"],
        pairings: ["commercial-printing"],
        image: mktDanglersWobblers,
        imageAlt: "Retail wobbler at point of sale with high-impact brand print in FMCG aisle",
      },
      {
        id: "exhibition-materials",
        name: "Exhibition Materials",
        tagline: "Stand presence at every format.",
        description:
          "Exhibition materials span the full range of large and small format print required for trade show presence — from roller banners and fabric backdrops to counter cards and shelf displays. We maintain substrate inventory for common exhibition formats to support rapid turnaround requirements of 3–7 working days.",
        capabilities: [
          "Roller banners, fabric backdrops and large format",
          "Counter cards and table displays",
          "3–7 working day rush turnaround",
          "Portable mounting and display systems",
        ],
        useCases: ["Trade shows and industry events", "Brand activations", "Retail and in-store events"],
        materials: ["Fabric and banner media", "Foam board and rigid PVC", "Backlit film substrates"],
        finishes: ["UV printing", "Gloss and matte lamination", "Mounting and display hardware"],
        pairings: ["commercial-printing", "marketing-branding"],
        image: mktExhibitionMaterials,
        imageAlt: "Exhibition roller banner with large format brand print for trade show stand",
      },
    ],
  },
  {
    id: "corrugated-boxes",
    code: "07",
    title: "Corrugated Boxes",
    intro:
      "Industrial-strength corrugated packaging for e-commerce, transit and storage — engineered to real load and stacking conditions across all flute profiles and print options.",
    image: corrStandard,
    imageAlt: "Industrial corrugated packaging boxes for e-commerce and freight transit",
    subtypes: [
      {
        id: "ecommerce-boxes",
        name: "E-commerce Shipping Boxes",
        tagline: "The last mile begins with the right box.",
        description:
          "E-commerce shipping boxes are specified to the actual product load, stacking conditions, and fulfilment environment — not assumed. We produce e-commerce boxes in E-flute and B-flute constructions with flexographic or litho-laminated print, optimised for packing line speed and consumer unboxing experience.",
        capabilities: [
          "E-flute and B-flute construction",
          "Auto-bottom and RSC formats",
          "Flexographic and litho-laminated print",
          "Custom tape closure and seal strip options",
        ],
        useCases: ["Direct-to-consumer e-commerce", "Subscription box programmes", "Last-mile delivery systems"],
        materials: ["E-flute 1.2mm corrugated", "B-flute 3mm corrugated", "Kraft and white liner options"],
        finishes: ["Flexographic 1–4 colour", "Litho-laminated full colour", "Water-based coatings"],
        pairings: ["rigid-boxes", "paper-bags"],
        image: corrEcommerce,
        imageAlt: "Custom printed e-commerce shipping box with brand flexographic print and auto-bottom",
      },
      {
        id: "standard-corrugated",
        name: "Standard Corrugated Boxes",
        tagline: "Proven. Scalable. Reliable.",
        description:
          "Standard corrugated boxes — RSC, HSC, and FEFCO standard configurations — are produced to consistent dimensional tolerance and burst factor specifications. For high-volume distribution, we produce on automated corrugating and cutting lines, delivering dimensional accuracy and consistent board quality at any volume.",
        capabilities: [
          "RSC, HSC and FEFCO standard formats",
          "BCT and burst factor specification",
          "High-volume automated production",
          "Custom dimensions to ±1mm tolerance",
        ],
        useCases: ["FMCG distribution", "Industrial component packaging", "General freight and storage"],
        materials: ["B-flute 3mm", "C-flute 4mm", "Double-wall EB and BC flute"],
        finishes: ["Flexographic 1–2 colour", "Plain kraft board"],
        pairings: ["commercial-printing"],
        image: corrStandard,
        imageAlt: "Standard RSC corrugated box in B-flute construction with flexographic print",
      },
      {
        id: "heavy-duty-corrugated",
        name: "Heavy-Duty Corrugated Boxes",
        tagline: "Engineered for the hardest conditions.",
        description:
          "Heavy-duty corrugated boxes are specified for export freight, industrial component packaging, and multi-layer stacking environments. Double-wall and triple-wall constructions deliver the BCT values required for pallet loads of 500kg+ and stacking heights of 4m+. Every specification is documented and tested in-house.",
        capabilities: [
          "Double-wall EB/BC and triple-wall constructions",
          "BCT and ECT in-house testing",
          "Export-grade fumigation options",
          "Stretch wrap and pallet configuration",
        ],
        useCases: ["Export freight and international shipping", "Industrial and engineering components", "Heavy appliance packaging"],
        materials: ["Double-wall EB flute", "Triple-wall heavy duty", "Kraft and virgin liner"],
        finishes: ["Water-based coating", "Flexographic print"],
        pairings: ["commercial-printing"],
        image: corrHeavyDuty,
        imageAlt: "Heavy-duty double-wall corrugated box for export freight and industrial packaging",
      },
      {
        id: "custom-printed-corrugated",
        name: "Custom Printed Corrugated Boxes",
        tagline: "Transit packaging becomes brand packaging.",
        description:
          "Custom printed corrugated boxes treat the outer box as a brand surface — with litho-laminated print or high-quality flexographic print transforming the shipping box into a premium brand experience at point of delivery. Particularly effective for direct-to-consumer brands building unboxing as a brand moment.",
        capabilities: [
          "Litho-laminated full CMYK print",
          "High-quality flexographic up to 6 colours",
          "Interior print options",
          "Custom structural configurations",
        ],
        useCases: ["Premium D2C e-commerce brands", "Subscription and gift box programmes", "Luxury FMCG distribution"],
        materials: ["Litho-laminated board", "B-flute and E-flute construction", "White-top liner for print quality"],
        finishes: ["Litho-laminated print", "Flexographic 4–6 colour", "Gloss UV coating"],
        pairings: ["rigid-boxes", "paper-bags", "marketing-branding"],
        image: corrCustomPrinted,
        imageAlt: "Custom litho-laminated corrugated box with full brand print and premium finish",
      },
      {
        id: "die-cut-corrugated",
        name: "Die-Cut Corrugated Boxes",
        tagline: "Precision structure. Retail readiness.",
        description:
          "Die-cut corrugated boxes are produced from custom dielines to create non-standard structures — display-ready retail boxes, shelf-ready packaging, shaped cartons, and multi-piece configurations. The die-cutting process delivers dimensional precision for automated packing line use and retail shelf compliance.",
        capabilities: [
          "Custom dieline structural design",
          "Shelf-ready and display-ready formats",
          "Multi-piece and combination structures",
          "Automated packing line compatible",
        ],
        useCases: ["Retail-ready packaging", "Shelf display configurations", "Point-of-sale display units"],
        materials: ["E-flute and B-flute board", "Litho-laminated and flexographic liner", "White-top liner"],
        finishes: ["Die-cut precision cutting", "Litho-laminated print", "Flexographic print"],
        pairings: ["marketing-branding", "commercial-printing"],
        image: corrDieCut,
        imageAlt: "Die-cut corrugated retail-ready box with display configuration and brand print",
      },
    ],
  },
];

const CAT_LABELS: Record<string, string> = {
  "rigid-boxes": "Rigid Boxes",
  "paper-bags": "Paper Bags",
  "commercial-printing": "Commercial Printing",
  "barcode-labels": "Barcode Labels",
  "calendars-diaries": "Calendars & Diaries",
  "marketing-branding": "Marketing & Branding",
  "corrugated-boxes": "Corrugated Boxes",
};

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

type View = "index" | "category" | "subtype";

function BuiltTogether({ pairings }: { pairings: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2">
      {pairings.map((pid, i) => (
        <motion.span
          key={pid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: EASE }}
          className="flex items-center"
        >
          <a
            href={`#${pid}`}
            className="group inline-flex items-center gap-2 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[var(--sand-700)] hover:text-foreground border border-[var(--sand-300)] hover:border-foreground transition-all duration-200"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] flex-shrink-0"
            />
            {CAT_LABELS[pid]}
          </a>
          {i < pairings.length - 1 && (
            <span className="h-px w-3 bg-[var(--sand-300)]/50 mx-0" />
          )}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT DISCOVERY — 2-panel layout
   LEFT 35% DiscoveryNav · RIGHT 65% ExplorerPanel
   Entry easing: cubic-bezier(0.22, 1, 0.36, 1) — in 520ms, out 380ms
───────────────────────────────────────────────────────────────────────────── */

const DISC_IN  = { duration: 0.72, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };
const DISC_OUT = { duration: 0.92, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

/* ── ProductRow: staggered item with x-slide + "View ↗" reveal ──────────── */
function ProductRow({
  sub,
  index,
  onClick,
}: {
  sub: Subtype;
  index: number;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const t = hov ? DISC_IN : DISC_OUT;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.08 + index * 0.04 }}
    >
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        className="relative flex items-center justify-between w-full py-3.5 border-b border-[var(--sand-300)]/30 last:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--gold)]/40"
      >
        {/* Warm tint — compositor layer */}
        <motion.span
          aria-hidden
          animate={{ opacity: hov ? 1 : 0 }}
          transition={t}
          style={{ position: "absolute", inset: 0, background: "oklch(0.965 0.012 75 / 0.22)", pointerEvents: "none" }}
        />
        {/* Number + name */}
        <div className="relative z-10 flex items-center gap-5">
          <motion.span
            animate={{ color: hov ? "var(--gold)" : "oklch(0.68 0.02 70)" }}
            transition={t}
            style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.22em", minWidth: 20 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <motion.span
            animate={{ x: hov ? 10 : 0 }}
            transition={t}
            style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.17em", lineHeight: 1.2 }}
            className={hov ? "text-foreground" : "text-[var(--sand-700)]"}
          >
            {sub.name}
          </motion.span>
        </div>
        {/* "View ↗" reveal */}
        <motion.span
          aria-hidden
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -10 }}
          transition={t}
          style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.24em", pointerEvents: "none" }}
          className="relative z-10 pr-1 flex-shrink-0 text-[var(--gold)]"
        >
          View ↗
        </motion.span>
      </button>
    </motion.div>
  );
}

/* ── IdleView: editorial intro when no category is selected ──────────────── */
function IdleView() {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col justify-center px-12 md:px-16"
    >
      <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-[var(--sand-400)]">
        <span className="h-px w-6 bg-[var(--sand-300)]" />
        Product Discovery
      </div>
      <h2 className="mt-8 font-display text-[clamp(2.6rem,4.2vw,5rem)] leading-[0.91] tracking-tight text-balance max-w-lg">
        Discover every format.
        <br />
        <span className="italic font-light">Select a product family.</span>
      </h2>
      <p className="mt-8 text-[var(--sand-700)] leading-relaxed text-sm max-w-xs">
        Six product families. Thirty-three formats.
        <br />
        One trusted partner in print and packaging.
      </p>
      <div className="mt-12 flex flex-col max-w-xs">
        {ATLAS.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, ease: EASE, delay: 0.18 + i * 0.06 }}
            className="flex items-center gap-3 py-2.5 border-b border-[var(--sand-300)]/30 last:border-0"
          >
            <span className="font-mono text-[8px] text-[var(--gold)] tracking-[0.22em] w-6">{cat.code}</span>
            <span className="h-px flex-1 bg-[var(--sand-300)]/30" />
            <span className="text-[8.5px] uppercase tracking-[0.18em] text-[var(--sand-500)]">{cat.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CategoryExplorerView({
  category,
  onSelectSubtype,
}: {
  category: Category;
  onSelectSubtype: (i: number) => void;
}) {
  const [ctaHov, setCtaHov] = useState(false);
  const mailtoHref = useMailtoHref();
  const ct = ctaHov ? DISC_IN : DISC_OUT;

  const mouse = useContext(MouseCtx);
  const _fb = useMotionValue(0);
  const _sx = mouse?.sx ?? _fb;
  const _sy = mouse?.sy ?? _fb;
  const reduced = useReducedMotion() ?? false;
  const imgX = useTransform(_sx, [-1, 1], [-14, 14]);
  const imgY = useTransform(_sy, [-1, 1], [-10, 10]);

  return (
    <motion.div
      key={`cat-${category.id}`}
      initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
      transition={DISC_IN}
      className="h-full flex overflow-hidden relative"
    >
      {/* Category image — right half, editorial overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden" aria-hidden>
        <motion.img
          src={category.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            opacity: 0.18,
            filter: "grayscale(0.3) contrast(1.1)",
            scale: 1.06,
            x: reduced ? 0 : imgX,
            y: reduced ? 0 : imgY,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, var(--background) 0%, oklch(0.97 0.005 80 / 0.85) 38%, transparent 100%)" }}
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-10 md:px-14 py-10 md:py-14 w-full">
        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.3em] text-[var(--sand-400)]">
          <span className="font-mono text-[var(--gold)]">{category.code}</span>
          <span className="h-px w-3 bg-[var(--sand-300)]" />
          Product Family
        </div>
        <h2 className="mt-5 font-display text-[clamp(2rem,3.2vw,4rem)] leading-[0.93] tracking-tight">
          {category.title}
        </h2>
        <p className="mt-5 text-[var(--sand-700)] leading-relaxed text-sm max-w-sm">
          {category.intro}
        </p>
        <div className="my-7 h-px bg-[var(--sand-300)]/50" />
        <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-5">
          {category.subtypes.length} formats in this family
        </div>
        <div className="flex flex-col">
          {category.subtypes.map((sub, i) => (
            <ProductRow key={sub.id} sub={sub} index={i} onClick={() => onSelectSubtype(i)} />
          ))}
        </div>
        <div className="mt-10">
          <a
            href={mailtoHref}
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            className="relative inline-flex items-center gap-3 border border-foreground px-7 py-3.5 text-[10px] uppercase tracking-[0.28em] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <span className="relative flex h-[1.15em] flex-col overflow-hidden">
              <motion.span animate={{ y: ctaHov ? "-110%" : "0%" }} transition={ct} className="block whitespace-nowrap">
                Request {category.title} Samples
              </motion.span>
              <motion.span
                animate={{ y: ctaHov ? "0%" : "110%" }}
                transition={ct}
                className="block absolute inset-0 text-[var(--gold)] whitespace-nowrap"
              >
                Request {category.title} Samples
              </motion.span>
            </span>
            <motion.span animate={{ x: ctaHov ? 4 : 0 }} transition={ct}>→</motion.span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Breadcrumb({
  category,
  subtype,
  onGoToAtlas,
  onGoToCategory,
}: {
  category: Category;
  subtype: Subtype;
  onGoToAtlas: () => void;
  onGoToCategory: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.22em] text-[var(--sand-400)] mb-6 flex-wrap">
      <button onClick={onGoToAtlas} className="hover:text-foreground transition-colors duration-200 cursor-pointer">
        All Products
      </button>
      <span className="h-px w-3 bg-[var(--sand-300)]" />
      <button onClick={onGoToCategory} className="hover:text-foreground transition-colors duration-200 cursor-pointer">
        {category.title}
      </button>
      <span className="h-px w-3 bg-[var(--sand-300)]" />
      <span className="text-foreground/70">{subtype.name}</span>
    </div>
  );
}

function NextPrevBar({
  category,
  subtypeIndex,
  onNavigate,
}: {
  category: Category;
  subtypeIndex: number;
  onNavigate: (j: number) => void;
}) {
  const prev = subtypeIndex > 0 ? category.subtypes[subtypeIndex - 1] : null;
  const next = subtypeIndex < category.subtypes.length - 1 ? category.subtypes[subtypeIndex + 1] : null;
  return (
    <div className="mt-10 pt-6 border-t border-[var(--sand-300)]/40 flex items-center justify-between">
      {prev ? (
        <button
          onClick={() => onNavigate(subtypeIndex - 1)}
          className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
            <path d="M16 5H0M6 1L0 5L6 9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {prev.name}
        </button>
      ) : <div />}
      {next ? (
        <button
          onClick={() => onNavigate(subtypeIndex + 1)}
          className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          {next.name}
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
            <path d="M0 5H16M10 1L16 5L10 9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : <div />}
    </div>
  );
}

function ProductDetailView({
  subtype,
  category,
  subtypeIndex,
  onBack,
  onReset,
  onNavigate,
}: {
  subtype: Subtype;
  category: Category;
  subtypeIndex: number;
  onBack: () => void;
  onReset: () => void;
  onNavigate: (j: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mailtoHref = useMailtoHref();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = 0;
  }, [subtype.id]);

  const mouse = useContext(MouseCtx);
  const _fb = useMotionValue(0);
  const _sx = mouse?.sx ?? _fb;
  const _sy = mouse?.sy ?? _fb;
  const reduced = useReducedMotion() ?? false;

  // Content: 0.45x depth
  const contentX = useTransform(_sx, [-1, 1], [-4, 4]);
  const contentY = useTransform(_sy, [-1, 1], [-3, 3]);

  // Image: 1.0x depth — slight oversample (scale 1.02) so edges never show during translation
  const imgX = useTransform(_sx, [-1, 1], [-9, 9]);
  const imgY = useTransform(_sy, [-1, 1], [-7, 7]);
  const imgScale = useTransform([_sx, _sy], ([x, y]: number[]) =>
    1.01 + 0.012 * Math.min(1, Math.sqrt((x as number) ** 2 + (y as number) ** 2))
  );

  return (
    <motion.div
      key={`sub-${subtype.id}`}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex overflow-hidden"
    >
      {/* Left: scrollable content */}
      <motion.div
        ref={scrollRef as React.Ref<HTMLDivElement>}
        className="flex flex-col h-full overflow-y-auto px-8 md:px-12 py-10 md:py-14 w-[56%] shrink-0"
        style={reduced ? {} : { x: contentX, y: contentY }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          category={category}
          subtype={subtype}
          onGoToAtlas={onReset}
          onGoToCategory={onBack}
        />

        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.28em] text-[var(--sand-400)]">
          <span className="font-mono text-[var(--gold)]">{category.code}</span>
          <span className="h-px w-3 bg-[var(--sand-300)]" />
          {category.title}
        </div>
        <h2 className="mt-4 font-display text-[clamp(1.7rem,2.8vw,3.2rem)] leading-[0.95] tracking-tight">
          {subtype.name}
        </h2>
        <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-[var(--sand-400)] italic">
          {subtype.tagline}
        </p>
        <p className="mt-6 text-[var(--sand-700)] leading-relaxed text-sm">
          {subtype.description}
        </p>

        <div className="my-6 h-px bg-[var(--sand-300)]/50" />

        <div data-section="capabilities">
          <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-3">Capabilities</div>
          <ul className="space-y-2.5 mb-7">
            {subtype.capabilities.map((cap, i) => (
              <motion.li
                key={cap}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: EASE }}
                className="flex items-start gap-3 text-sm text-[var(--sand-700)]"
              >
                <span className="h-px w-4 bg-[var(--sand-400)] mt-[10px] flex-shrink-0" />
                {cap}
              </motion.li>
            ))}
          </ul>
        </div>

        <div data-section="materials">
          <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-3">Materials &amp; Finishes</div>
          <div className="flex flex-wrap gap-1.5 mb-7">
            {[...subtype.materials, ...subtype.finishes].map((m) => (
              <span key={m} className="border border-[var(--sand-300)] px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em] text-[var(--sand-700)]">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div data-section="use-cases">
          <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-3">Use Cases</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-7">
            {subtype.useCases.map((u, i) => (
              <span key={u} className="text-[10px] uppercase tracking-[0.16em] text-[var(--sand-700)]">
                {u}{i < subtype.useCases.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="my-4 h-px bg-[var(--sand-300)]/50" />

        <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-4">Built Together</div>
        <BuiltTogether pairings={subtype.pairings} />

        <div className="mt-8" data-section="enquire">
          <a href={mailtoHref} className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-7 py-3.5 text-[10px] uppercase tracking-[0.28em]">
            <span>Enquire about {subtype.name} →</span>
          </a>
        </div>

        {/* Prev / Next */}
        <NextPrevBar
          category={category}
          subtypeIndex={subtypeIndex}
          onNavigate={onNavigate}
        />
      </motion.div>

      {/* Right: product image */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={subtype.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={reduced ? {} : { x: imgX, y: imgY, scale: imgScale }}
            >
              <img
                src={subtype.image}
                alt={subtype.imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transition: "filter 1.2s cubic-bezier(0.16,1,0.3,1)",
                  filter: (mouse?.sectionHovered && !reduced) ? "brightness(1.02)" : "brightness(1)",
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--background) 0%, transparent 25%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 right-6 font-display leading-none text-white/20 select-none mix-blend-overlay"
          style={{ fontSize: "clamp(3rem,6vw,7rem)" }}
        >
          {category.code}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INDEX PANEL — cinematic left-rail hover system
   Easing spec: cubic-bezier(0.22, 1, 0.36, 1) — hover-in 320ms, hover-out 450ms
───────────────────────────────────────────────────────────────────────────── */

const PNL_IN  = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] };
const PNL_OUT = { duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] };
const PNL_SPRING = { type: "spring" as const, stiffness: 45, damping: 22, mass: 1.3 };

/* ── Subtype row ─────────────────────────────────────────────────────────── */
function SubtypeRow({
  sub,
  j,
  isActive,
  hovered,
  dimmed,
  onHover,
  onHoverEnd,
  onClick,
}: {
  sub: Subtype;
  j: number;
  isActive: boolean;
  hovered: boolean;
  dimmed: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const t = hovered ? PNL_IN : PNL_OUT;

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, ease: EASE, delay: j * 0.03 }}
    >
      <button
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
        onFocus={onHover}
        onBlur={onHoverEnd}
        onClick={onClick}
        aria-pressed={isActive}
        className="relative flex items-center w-full text-left py-[7px] pl-8 md:pl-10 pr-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--gold)]/50"
      >
        {/* Warm tint + paper elevation — opacity-only = GPU compositor */}
        <motion.span
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={t}
          style={{
            position: "absolute", inset: 0,
            background: "oklch(0.965 0.012 75 / 0.38)",
            boxShadow: "inset 0 1px 0 oklch(0.97 0.005 80 / 0.4), inset 0 -1px 0 oklch(0.87 0.012 65 / 0.18)",
            pointerEvents: "none",
          }}
        />

        {/* Horizontal light beam */}
        <motion.span
          aria-hidden
          animate={{ opacity: hovered ? 0.14 : 0, scaleX: hovered ? 1 : 0.06 }}
          transition={t}
          style={{
            position: "absolute", left: 28, right: 8, top: "50%",
            height: 1,
            background: "linear-gradient(to right, oklch(0.72 0.11 75 / 0.55), transparent)",
            transformOrigin: "left", transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Indicator: stretching dash → glowing dot */}
        <span
          aria-hidden
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          {isActive ? (
            <motion.span
              layoutId="sub-active-pip"
              animate={{
                boxShadow: hovered
                  ? "0 0 6px 2px oklch(0.72 0.11 75 / 0.45)"
                  : "0 0 0px 0px oklch(0.72 0.11 75 / 0)",
                scale: hovered ? 1.28 : 1,
              }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              style={{ display: "block", width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" }}
            />
          ) : (
            <motion.span
              animate={{ scaleX: hovered ? 3.4 : 1, opacity: hovered ? 0.72 : 0.3 }}
              transition={t}
              style={{
                display: "block", width: 5, height: 1,
                background: "oklch(0.68 0.02 70)",
                transformOrigin: "left",
              }}
            />
          )}
        </span>

        {/* Label: x-translate + letter-spacing expand + dim others */}
        <motion.span
          animate={{
            x: hovered ? 9 : 0,
            opacity: dimmed ? 0.42 : 1,
            letterSpacing: hovered ? "0.18em" : "0.14em",
          }}
          transition={t}
          style={{ fontSize: "8.5px", textTransform: "uppercase", lineHeight: 1.3, display: "block" }}
          className={isActive ? "text-foreground" : "text-[var(--sand-500)]"}
        >
          {sub.name}
        </motion.span>
      </button>
    </motion.div>
  );
}

/* ── Category row ────────────────────────────────────────────────────────── */
function CategoryRow({
  cat,
  isActive,
  activeSub,
  dimmed,
  isProductMode,
  onSelect,
  onSelectSubtype,
  onHover,
  onHoverEnd,
}: {
  cat: Category;
  i: number;
  isActive: boolean;
  activeSub: number | null;
  dimmed: boolean;
  isProductMode: boolean;
  onSelect: () => void;
  onSelectSubtype: (j: number) => void;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);
  const t = hovered ? PNL_IN : PNL_OUT;
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(true);
    setShimmerKey((k) => k + 1);
    onHover();
  };
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
      onHoverEnd();
    }, 250);
  };

  // Opacity rules:
  // Normal mode: dim when others hovered
  // Product mode: active cat = 90%, hovered non-active = 100%, others = 40%
  const textOpacity = isProductMode
    ? (isActive ? 0.9 : hovered ? 1 : 0.4)
    : (dimmed ? 0.44 : 1);

  // In product mode: dim non-active, non-hovered subtypes to 30%
  const subDimmed = (j: number) =>
    isProductMode
      ? (activeSub !== null && activeSub !== j && hoveredSub !== j)
      : (hoveredSub !== null && hoveredSub !== j);

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      animate={{ marginTop: hovered ? 5 : 0, marginBottom: hovered ? 5 : 0 }}
      transition={PNL_SPRING}
      className="border-b border-[var(--sand-300)]/30 last:border-0"
    >
      {/* ── Category button ── */}
      <button
        onFocus={() => { setHovered(true); onHover(); }}
        onBlur={() => { setHovered(false); onHoverEnd(); }}
        onClick={onSelect}
        className="relative flex items-start justify-between gap-1 w-full py-4 px-5 md:px-6 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--gold)]/50"
      >
        {/* Active gold bar */}
        {isActive && (
          <motion.span
            layoutId="cat-active-bar"
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--gold)]"
            transition={{ type: "spring", stiffness: 440, damping: 34 }}
            aria-hidden
          />
        )}

        {/* Hover-preview bar (non-active only) */}
        {!isActive && (
          <motion.span
            aria-hidden
            animate={{ opacity: hovered ? 0.3 : 0, scaleY: hovered ? 1 : 0.2 }}
            transition={t}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--gold)] origin-center"
          />
        )}

        {/* Warm tint + paper elevation */}
        <motion.span
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={t}
          style={{
            position: "absolute", inset: 0,
            background: "oklch(0.965 0.012 75 / 0.42)",
            boxShadow: "inset 0 1px 0 oklch(0.97 0.005 80 / 0.45), inset 0 -1px 0 oklch(0.87 0.012 65 / 0.2)",
            pointerEvents: "none",
          }}
        />

        {/* Shimmer pass */}
        {shimmerKey > 0 && (
          <motion.span
            key={shimmerKey}
            aria-hidden
            initial={{ x: "-110%" }}
            animate={{ x: "210%" }}
            transition={{ duration: 1.15, ease: "linear" }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.062) 50%, transparent)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Horizontal light beam */}
        <motion.span
          aria-hidden
          animate={{ opacity: hovered ? 0.17 : 0, scaleX: hovered ? 1 : 0.04 }}
          transition={t}
          style={{
            position: "absolute", left: 20, right: 16, top: "50%",
            height: 1,
            background: "linear-gradient(to right, oklch(0.72 0.11 75 / 0.5), transparent)",
            transformOrigin: "left", transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Text group */}
        <motion.div
          animate={{ x: hovered ? 12 : 0, opacity: textOpacity }}
          transition={t}
          className="flex flex-col gap-0.5 min-w-0"
        >
          <span className={`font-mono text-[9px] tracking-[0.22em] transition-colors duration-200 ${
            isActive || hovered ? "text-[var(--gold)]" : "text-[var(--sand-400)]"
          }`}>
            {cat.code}
          </span>
          <motion.span
            animate={{ letterSpacing: hovered ? "0.21em" : "0.17em" }}
            transition={t}
            style={{ fontSize: "9.5px", textTransform: "uppercase", lineHeight: 1.2, display: "block" }}
            className={isActive || hovered ? "text-foreground" : "text-[var(--sand-700)]"}
          >
            {cat.title}
          </motion.span>
        </motion.div>

        {/* Chevron */}
        <motion.span
          aria-hidden
          animate={{ rotate: isActive ? 90 : (isProductMode && !isActive && hovered ? 45 : 0), x: hovered ? -3 : 0 }}
          transition={t}
          className={`flex-shrink-0 mt-[3px] ${
            isActive ? "text-[var(--gold)]" : hovered ? "text-[var(--sand-500)]" : "text-[var(--sand-300)]"
          }`}
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1.5 1.5L5 5L1.5 8.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      {/* ── Hover preview (product mode, non-active categories) ── */}
      <AnimatePresence>
        {isProductMode && !isActive && hovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            onClick={onSelect}
            className="cursor-pointer"
          >
            <div className="px-5 md:px-6 pb-4 pt-1 border-t border-[var(--sand-300)]/25">
              <motion.p
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.22 }}
                className="text-[7.5px] text-[var(--sand-600)] leading-relaxed line-clamp-2 mb-2.5"
              >
                {cat.intro}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.2 }}
                className="flex items-center justify-between mb-3"
              >
                <span className="text-[7px] uppercase tracking-[0.24em] text-[var(--sand-400)]">
                  {cat.subtypes.length} formats
                </span>
                <span className="text-[7px] uppercase tracking-[0.24em] text-[var(--gold)]">
                  Explore →
                </span>
              </motion.div>
              <div className="border-t border-[var(--sand-300)]/25 pt-2">
                {cat.subtypes.map((s, j) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + j * 0.04, duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="py-[4px] text-[7.5px] uppercase tracking-[0.14em] text-[var(--sand-500)] pl-3 flex items-center gap-2"
                  >
                    <span className="h-px w-2 bg-[var(--sand-300)]/60 flex-shrink-0" />
                    {s.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Accordion subtype list ── */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-1 pb-2.5 border-t border-[var(--sand-300)]/40">
              {cat.subtypes.map((sub, j) => (
                <SubtypeRow
                  key={sub.id}
                  sub={sub}
                  j={j}
                  isActive={activeSub === j}
                  hovered={hoveredSub === j}
                  dimmed={subDimmed(j)}
                  onHover={() => setHoveredSub(j)}
                  onHoverEnd={() => setHoveredSub(null)}
                  onClick={() => onSelectSubtype(j)}
                />
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Discovery nav: left 35% — elevated category nav ────────────────────── */
function DiscoveryNav({
  activeCat,
  activeSub,
  onSelect,
  onSelectSubtype,
}: {
  activeCat: number | null;
  activeSub: number | null;
  onSelect: (i: number) => void;
  onSelectSubtype: (j: number) => void;
}) {
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const isProductMode = activeSub !== null || activeCat !== null;

  const mouse = useContext(MouseCtx);
  const _fb = useMotionValue(0);
  const _sx = mouse?.sx ?? _fb;
  const _sy = mouse?.sy ?? _fb;
  const reduced = useReducedMotion() ?? false;
  const navX = useTransform(_sx, [-1, 1], [-2.5, 2.5]);
  const navY = useTransform(_sy, [-1, 1], [-2, 2]);

  return (
    <motion.div
      className="border-r border-[var(--sand-300)]/50 flex flex-col overflow-y-auto shrink-0 bg-[var(--sand-50)]/50"
      style={{
        width: "clamp(200px, 18%, 260px)",
        transition: "width 0.35s cubic-bezier(0.16,1,0.3,1)",
        x: reduced ? 0 : navX,
        y: reduced ? 0 : navY,
      }}
    >
      {/* Header */}
      <div className="px-8 md:px-10 pt-8 md:pt-10 pb-6 border-b border-[var(--sand-300)]/30">
        <span className="text-[8px] uppercase tracking-[0.36em] text-[var(--sand-400)]">Product Index</span>
        <h3 className="mt-2 font-display text-[clamp(1.2rem,1.8vw,1.8rem)] leading-[0.95] tracking-tight">
          Our <span className="italic font-light">Catalogue</span>
        </h3>
      </div>

      {/* Category rows */}
      <div className="flex flex-col flex-1">
        {ATLAS.map((cat, i) => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            i={i}
            isActive={activeCat === i}
            activeSub={activeCat === i ? activeSub : null}
            dimmed={hoveredCat !== null && hoveredCat !== i}
            isProductMode={isProductMode}
            onSelect={() => onSelect(i)}
            onSelectSubtype={onSelectSubtype}
            onHover={() => setHoveredCat(i)}
            onHoverEnd={() => setHoveredCat(null)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 md:px-10 py-6 border-t border-[var(--sand-300)]/30 mt-auto">
        <p className="text-[7.5px] uppercase tracking-[0.28em] text-[var(--sand-400)] leading-loose">
          7 Categories · 40 Formats
        </p>
      </div>
    </motion.div>
  );
}

/* ── ExplorerPanel: right 65% — AnimatePresence state machine ───────────── */
function ExplorerPanel({
  activeCat,
  activeSub,
  onSelectSubtype,
  onBack,
  onReset,
}: {
  activeCat: number | null;
  activeSub: number | null;
  onSelectSubtype: (j: number) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const [panelHov, setPanelHov] = useState(false);
  const lightRawX = useMotionValue(-9999);
  const lightRawY = useMotionValue(-9999);
  const lightX = useSpring(lightRawX, { stiffness: 100, damping: 26 });
  const lightY = useSpring(lightRawY, { stiffness: 100, damping: 26 });

  const category = activeCat !== null ? ATLAS[activeCat] : null;
  const subtype = category && activeSub !== null ? category.subtypes[activeSub] : null;
  const panelState = subtype ? "product" : category ? "category" : "idle";

  return (
    <div
      className="flex-1 relative overflow-hidden"
      onMouseMove={(e) => {
        if (prefersReduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        lightRawX.set(e.clientX - rect.left);
        lightRawY.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => { if (!prefersReduced) setPanelHov(true); }}
      onMouseLeave={() => {
        setPanelHov(false);
        lightRawX.set(-9999);
        lightRawY.set(-9999);
      }}
    >
      {/* Directional ambient light — very subtle, follows cursor */}
      {!prefersReduced && (
        <motion.div
          aria-hidden
          animate={{ opacity: panelHov ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: lightX,
            top: lightY,
            width: 520,
            height: 520,
            borderRadius: "50%",
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, oklch(0.88 0.05 78 / 0.04) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Dashed dieline vertical rule */}
      <div
        aria-hidden
        className="absolute left-[28%] top-0 bottom-0 w-px pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, oklch(0.72 0.02 70 / 0.12) 0px, oklch(0.72 0.02 70 / 0.12) 4px, transparent 4px, transparent 10px)",
        }}
      />

      {/* State machine */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {panelState === "idle" && <IdleView key="idle" />}
          {panelState === "category" && category && (
            <CategoryExplorerView key={`cat-${category.id}`} category={category} onSelectSubtype={onSelectSubtype} />
          )}
          {panelState === "product" && subtype && category && activeSub !== null && (
            <ProductDetailView
              key={`sub-${subtype.id}`}
              subtype={subtype}
              category={category}
              subtypeIndex={activeSub}
              onBack={onBack}
              onReset={onReset}
              onNavigate={onSelectSubtype}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE ATLAS — stacked layout for screens < md
───────────────────────────────────────────────────────────────────────────── */

function MobileAtlas({
  externalCat,
  externalSub,
}: {
  externalCat: number | null;
  externalSub: number | null;
}) {
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const mailtoHref = useMailtoHref();

  useEffect(() => {
    if (externalCat !== null) {
      setActiveCat(externalCat);
      setActiveSub(externalSub);
    }
  }, [externalCat, externalSub]);

  const cat = activeCat !== null ? ATLAS[activeCat] : null;
  const sub = cat && activeSub !== null ? cat.subtypes[activeSub] : null;

  return (
    <div className="md:hidden flex flex-col">
      {/* Category strip */}
      <div className="flex overflow-x-auto gap-0 border-b border-[var(--sand-300)] pb-0 no-scrollbar">
        {ATLAS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { setActiveCat(i); setActiveSub(null); }}
            className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 text-center transition-colors duration-200 border-r border-[var(--sand-300)]/40 last:border-0 ${
              activeCat === i ? "text-foreground bg-[var(--sand-100)]/60" : "text-[var(--sand-700)]"
            }`}
          >
            {activeCat === i && (
              <motion.span
                layoutId="mob-cat-bar"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--gold)]"
                transition={{ type: "spring", stiffness: 440, damping: 34 }}
              />
            )}
            <span className="font-mono text-[8px] tracking-widest text-[var(--gold)]">{c.code}</span>
            <span className="text-[8px] uppercase tracking-[0.14em] leading-tight max-w-[76px]">{c.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!cat && (
          <motion.div
            key="mob-intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="px-5 py-10"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-4">Packaging Atlas</p>
            <h2 className="font-display text-3xl leading-tight text-balance">
              Select a product family to explore.
            </h2>
          </motion.div>
        )}

        {cat && !sub && (
          <motion.div
            key={`mob-cat-${cat.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="px-5 py-8"
          >
            <p className="text-[8px] font-mono text-[var(--gold)] tracking-widest mb-1">{cat.code}</p>
            <h2 className="font-display text-3xl leading-tight mb-3">{cat.title}</h2>
            <p className="text-sm text-[var(--sand-700)] leading-relaxed mb-6">{cat.intro}</p>
            <div className="flex flex-col">
              {cat.subtypes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSub(i)}
                  className="group flex items-center justify-between py-3 border-b border-[var(--sand-300)]/40 last:border-0 text-left text-[var(--sand-700)] hover:text-foreground transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-[var(--sand-400)] tracking-wider">{String(i+1).padStart(2,"0")}</span>
                    <span className="text-[10px] uppercase tracking-[0.14em]">{s.name}</span>
                  </div>
                  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" className="text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M1 3.5H10M7.5 1L10 3.5L7.5 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {sub && cat && (
          <motion.div
            key={`mob-sub-${sub.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="px-5 py-8"
          >
            <button
              onClick={() => setActiveSub(null)}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-[var(--sand-700)] mb-6"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M9 3H1M4 1L1 3L4 5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {cat.title}
            </button>
            <h2 className="font-display text-2xl leading-tight mb-1">{sub.name}</h2>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--sand-400)] italic mb-4">{sub.tagline}</p>
            <p className="text-sm text-[var(--sand-700)] leading-relaxed mb-6">{sub.description}</p>
            <div className="hairline mb-5" />
            <p className="text-[8px] uppercase tracking-[0.28em] text-[var(--sand-400)] mb-3">Capabilities</p>
            <ul className="space-y-2 mb-6">
              {sub.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-[var(--sand-700)]">
                  <span className="h-px w-3 bg-[var(--sand-400)] mt-[10px] flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
            <p className="text-[8px] uppercase tracking-[0.28em] text-[var(--sand-400)] mb-3">Built Together</p>
            <BuiltTogether pairings={sub.pairings} />
            <a
              href={mailtoHref}
              className="magnetic-btn mt-7 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[10px] uppercase tracking-[0.26em]"
            >
              <span>Enquire →</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */

export function PackagingAtlas() {
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const location = useLocation();

  const desktopRef = useRef<HTMLElement>(null);
  const [sectionHov, setSectionHov] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const sx = useSpring(rawMouseX, PARALLAX_SPRING);
  const sy = useSpring(rawMouseY, PARALLAX_SPRING);

  const onSectionMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    rawMouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }, [reducedMotion, rawMouseX, rawMouseY]);

  const onSectionMouseEnter = useCallback(() => {
    if (!reducedMotion) setSectionHov(true);
  }, [reducedMotion]);

  const onSectionMouseLeave = useCallback(() => {
    setSectionHov(false);
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  const selectCategory = useCallback((i: number) => {
    setActiveCat(i);
    setActiveSub(null);
  }, []);

  const selectSubtype = useCallback((j: number) => {
    setActiveSub(j);
  }, []);

  const backToCategory = useCallback(() => {
    setActiveSub(null);
  }, []);

  const resetAll = useCallback(() => {
    setActiveCat(null);
    setActiveSub(null);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return;
    const catIdx = ATLAS.findIndex((cat) => cat.id === hash);
    if (catIdx !== -1) {
      setActiveCat(catIdx);
      setActiveSub(null);
      return;
    }
    for (let ci = 0; ci < ATLAS.length; ci++) {
      const subIdx = ATLAS[ci].subtypes.findIndex((sub) => sub.id === hash);
      if (subIdx !== -1) {
        setActiveCat(ci);
        setActiveSub(subIdx);
        return;
      }
    }
  }, [location.hash]);

  return (
    <>
      {/* Desktop: 2-panel Product Discovery */}
      <MouseCtx.Provider value={{ sx, sy, sectionHovered: sectionHov }}>
        <section
          ref={desktopRef}
          className="hidden md:flex relative overflow-hidden"
          style={{ marginTop: "var(--nav-h, 80px)", height: "calc(100vh - var(--nav-h, 80px))" }}
          aria-label="Packaging product discovery"
          onMouseMove={onSectionMouseMove}
          onMouseEnter={onSectionMouseEnter}
          onMouseLeave={onSectionMouseLeave}
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-fine grid-fade opacity-25" aria-hidden />

          <DiscoveryNav
            activeCat={activeCat}
            activeSub={activeSub}
            onSelect={selectCategory}
            onSelectSubtype={selectSubtype}
          />

          <ExplorerPanel
            activeCat={activeCat}
            activeSub={activeSub}
            onSelectSubtype={selectSubtype}
            onBack={backToCategory}
            onReset={resetAll}
          />
        </section>
      </MouseCtx.Provider>

      {/* Mobile: stacked layout */}
      <section
        className="relative bg-background"
        style={{ paddingTop: "var(--nav-h, 80px)" }}
        aria-label="Packaging Atlas product explorer"
      >
        <MobileAtlas externalCat={activeCat} externalSub={activeSub} />
      </section>
    </>
  );
}

export { ATLAS };
export type { Category, Subtype };

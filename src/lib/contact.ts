import { useEffect, useState } from "react";

// Split so the address never appears as a literal string in server-rendered
// HTML (a plain-text mailto address in the page source is an easy target for
// scraper bots). The real href is assembled client-side after mount.
const RECIPIENTS: readonly [string, string][] = [
  ["abhinav", "dgvcompany.com"],
  ["dgvcompany1", "gmail.com"],
];

function buildMailtoHref(params?: { subject?: string; body?: string }) {
  const emails = RECIPIENTS.map(([user, domain]) => `${user}@${domain}`).join(",");
  const query: string[] = [];
  if (params?.subject) query.push(`subject=${encodeURIComponent(params.subject)}`);
  if (params?.body) query.push(`body=${encodeURIComponent(params.body)}`);
  return `mailto:${emails}${query.length ? `?${query.join("&")}` : ""}`;
}

/** Returns "#" on first (server-rendered) paint, then the real mailto: href once mounted. */
export function useMailtoHref(params?: { subject?: string; body?: string }) {
  const [href, setHref] = useState("#");
  useEffect(() => {
    setHref(buildMailtoHref(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.subject, params?.body]);
  return href;
}

/** For display text (e.g. a footer "email us at" link) — same deferred-reveal approach. */
export function useContactEmail() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    setEmail(RECIPIENTS.map(([user, domain]) => `${user}@${domain}`)[0]);
  }, []);
  return email;
}

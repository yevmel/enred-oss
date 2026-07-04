// Escaping helpers for user-entered strings embedded in the exported SVG.

export function escapeXmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// XML forbids "--" inside a comment body, and a comment may not end in "-".
export function escapeXmlComment(s: string): string {
  return s.replace(/--/g, "––").replace(/-$/, "–");
}

// "]]>" would terminate a CDATA section early; split it across two sections.
export function escapeCdata(s: string): string {
  return s.split("]]>").join("]]]]><![CDATA[>");
}

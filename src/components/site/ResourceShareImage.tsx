export function ResourceShareImage({ library = false, daily = false, title, subtitle, category }: { library?: boolean; daily?: boolean; title?: string; subtitle?: string; category?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fbfaf7", color: "#171717", padding: "64px 76px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5c5c5c" }}><span>Cristian Sanchez-Aguilera</span><span>FREE RESOURCES</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: (daily || title) ? 72 : library ? 86 : 82, lineHeight: 1.05, letterSpacing: -4, maxWidth: 960 }}>{title || (library ? "A practical next step." : daily ? "SDR / BDR Daily Operating Checklist" : "Interview Prep Scorecard")}</div>
        <div style={{ fontSize: 30, color: "#5c5c5c", maxWidth: 950 }}>{subtitle || (library ? "Free tools for interviews and the working day." : daily ? "Prioritize. Prepare your outreach. Close the loop." : "Research the role. Practice your answers. Know what to improve.")}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #d8d8d3", paddingTop: 24, fontSize: 24 }}><span>{category || (daily ? "SDR / BDR WORKDAY" : library ? "TECH SALES TOOLS" : "SDR / BDR INTERVIEWS")}</span><span style={{ color: "#2563eb" }}>No email required →</span></div>
    </div>
  );
}

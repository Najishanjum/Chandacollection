export function Marquee() {
  const items = [
    "MONTHLY CHANDA",
    "PAYMENT RECORDED",
    "RECEIPT GENERATED",
    "PENDING TRACKED",
    "CLEAR RECORDS",
    "TRANSPARENT MASJID MANAGEMENT",
  ];

  const content = items.map((item) => `${item} →`).join("  ");

  return (
    <div
      className="border-y-2 border-[#0B0906] bg-[#0B0906] text-[#C8FF19] overflow-hidden py-3"
      aria-hidden="true"
    >
      <div className="marquee-track whitespace-nowrap">
        <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm uppercase tracking-widest px-4">
          {content}&nbsp;&nbsp;{content}&nbsp;&nbsp;{content}&nbsp;&nbsp;{content}
        </span>
        <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm uppercase tracking-widest px-4">
          {content}&nbsp;&nbsp;{content}&nbsp;&nbsp;{content}&nbsp;&nbsp;{content}
        </span>
      </div>
    </div>
  );
}

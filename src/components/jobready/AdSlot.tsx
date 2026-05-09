/**
 * Google AdSense Ad Slot
 * Publisher: ca-pub-8031704055036556
 */
"use client";

export default function AdSlot({
  format = "auto",
  style,
  className = "",
  slot,
  responsive = true,
}: {
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  style?: React.CSSProperties;
  className?: string;
  slot?: string;
  responsive?: boolean;
}) {
  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client="ca-pub-8031704055036556"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : undefined}
      />
    </div>
  );
}

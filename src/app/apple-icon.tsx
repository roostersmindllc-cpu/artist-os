import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 55%, #1f2937 100%)",
        color: "#f8fafc",
        fontSize: 72,
        fontWeight: 700,
        letterSpacing: "-0.08em"
      }}
    >
      AO
    </div>,
    size
  );
}

import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 55%, #1f2937 100%)",
        color: "#f8fafc",
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: "-0.08em"
      }}
    >
      AO
    </div>,
    size
  );
}

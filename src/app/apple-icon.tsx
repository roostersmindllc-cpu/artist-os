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
          "radial-gradient(circle at top left, rgba(233,76,255,0.18), transparent 34%), radial-gradient(circle at top right, rgba(45,212,191,0.16), transparent 28%), linear-gradient(135deg, #09111f 0%, #0f172a 55%, #10263d 100%)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        }}
      >
        <svg width="108" height="108" viewBox="0 0 160 160" fill="none">
          <defs>
            <linearGradient id="apple-note" x1="34" y1="20" x2="112" y2="126" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F8D0FF" />
              <stop offset="0.32" stopColor="#E964F5" />
              <stop offset="0.62" stopColor="#A844E0" />
              <stop offset="1" stopColor="#5D2AE8" />
            </linearGradient>
            <linearGradient id="apple-circuit" x1="84" y1="26" x2="146" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#67B5FF" />
              <stop offset="0.45" stopColor="#27C5FF" />
              <stop offset="1" stopColor="#2DE2F8" />
            </linearGradient>
          </defs>
          <circle cx="77" cy="82" r="44" fill="rgba(29,53,120,0.58)" />
          <path
            d="M34 70c8-16 22-27 40-32m-25 51c-4-16-1-33 9-47m17 57c-8-11-13-25-12-40m26 35c0-16 6-31 17-42m-7 51c8-8 15-19 18-31"
            stroke="url(#apple-circuit)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M30 88c6-20 20-36 38-46 18-10 40-12 60-6"
            stroke="#5D5EFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M96 28v62.5c0 13.7-12.1 24.5-29.2 24.5-12.8 0-22.8-6.2-22.8-16.8S54 81 66.8 81c6.3 0 11.8 1.6 15.6 4.4V50.2l44.6-19.2v52.3c0 13.7-12.1 24.5-29.2 24.5-12.8 0-22.8-6.2-22.8-16.8S85 74 97.8 74c6.2 0 11.6 1.5 15.4 4.2V50.8L96 58.2V28Z"
            fill="url(#apple-note)"
            stroke="#FFD8FF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M109 65h14m-4 16h18m-12 16h15"
            stroke="url(#apple-circuit)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="135" cy="65" r="6.5" fill="#2DE2F8" />
          <circle cx="143" cy="81" r="6.5" fill="#2DE2F8" />
          <circle cx="138" cy="97" r="6.5" fill="#67B5FF" />
          <circle cx="27" cy="77" r="6.5" fill="#67B5FF" />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 26,
            fontWeight: 700,
            color: "#F8FAFC",
            letterSpacing: "-0.06em"
          }}
        >
          Artist
          <span style={{ color: "#67B5FF" }}>.OS</span>
        </div>
      </div>
    </div>,
    size
  );
}

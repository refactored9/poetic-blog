import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Solo Akash";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #f5f0e8 0%, #e7dcc8 45%, #d5c4a1 100%)",
          color: "#2d2419",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 5,
            textTransform: "uppercase",
            opacity: 0.75,
          }}
        >
          The Solo Akash
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 600,
            }}
          >
            Stories from the Road
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.25,
              opacity: 0.88,
            }}
          >
            Poetry, travel notes, and visual journeys.
          </div>
        </div>
      </div>
    ),
    size
  );
}

"use client";

import { useEffect, useState } from "react";
import { JourneyRoute, RouteStop } from "@/types/blog";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface JourneyMapProps {
  route: JourneyRoute;
  journeyTitle: string;
  compact?: boolean;
}

const stopIcons: Record<RouteStop["type"], string> = {
  start: "🚩",
  end: "🏁",
  stop: "📍",
  viewpoint: "👁️",
  campsite: "⛺",
  water: "💧",
  food: "🍴",
  danger: "⚠️",
  poi: "⭐",
};

const difficultyColors: Record<string, string> = {
  easy: "#22c55e",
  moderate: "#f59e0b",
  difficult: "#ef4444",
  expert: "#7c3aed",
};

// Component to fit bounds after map loads
function FitBounds({ route, L }: { route: JourneyRoute; L: typeof import("leaflet") }) {
  const [MapHook, setMapHook] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapHook(() => mod.useMap);
    });
  }, []);

  if (!MapHook) return null;

  return <FitBoundsInner route={route} L={L} useMap={MapHook} />;
}

function FitBoundsInner({
  route,
  L,
  useMap
}: {
  route: JourneyRoute;
  L: typeof import("leaflet");
  useMap: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const allCoords: [number, number][] = [];

    if (route.path && route.path.length > 0) {
      route.path.forEach((p) => allCoords.push([p.lat, p.lng]));
    }

    if (route.stops && route.stops.length > 0) {
      route.stops.forEach((s) => allCoords.push([s.coordinates.lat, s.coordinates.lng]));
    }

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [map, route, L]);

  return null;
}

function MapContent({ route }: { route: JourneyRoute }) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [icons, setIcons] = useState<Record<string, import("leaflet").DivIcon> | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);

      const customIcons: Record<string, import("leaflet").DivIcon> = {};

      const stopColors: Record<string, string> = {
        start: "#22c55e",
        end: "#ef4444",
        stop: "#3b82f6",
        viewpoint: "#8b5cf6",
        campsite: "#f59e0b",
        water: "#06b6d4",
        food: "#ec4899",
        danger: "#dc2626",
        poi: "#6366f1",
      };

      Object.entries(stopIcons).forEach(([type, icon]) => {
        customIcons[type] = leaflet.default.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background: ${stopColors[type]};
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
              border: 3px solid white;
              font-size: 16px;
            ">${icon}</div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      });
      setIcons(customIcons);
    });
  }, []);

  if (!L || !icons) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-[var(--muted)]">Loading map...</p>
        </div>
      </div>
    );
  }

  const pathCoords = route.path?.map((p) => [p.lat, p.lng] as [number, number]) || [];

  let center: [number, number] = [20.5937, 78.9629];

  if (route.mapCenter) {
    center = [route.mapCenter.lat, route.mapCenter.lng];
  } else if (pathCoords.length > 0) {
    const avgLat = pathCoords.reduce((sum, c) => sum + c[0], 0) / pathCoords.length;
    const avgLng = pathCoords.reduce((sum, c) => sum + c[1], 0) / pathCoords.length;
    center = [avgLat, avgLng];
  } else if (route.stops && route.stops.length > 0) {
    const avgLat = route.stops.reduce((sum, s) => sum + s.coordinates.lat, 0) / route.stops.length;
    const avgLng = route.stops.reduce((sum, s) => sum + s.coordinates.lng, 0) / route.stops.length;
    center = [avgLat, avgLng];
  }

  const routeColor = difficultyColors[route.difficulty || "moderate"];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      {/* Using Stadia Maps Outdoors - great for hiking */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <FitBounds route={route} L={L} />

      {/* Draw the route path */}
      {pathCoords.length > 1 && (
        <Polyline
          positions={pathCoords}
          pathOptions={{
            color: routeColor,
            weight: 5,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round"
          }}
        />
      )}

      {/* Draw markers for stops */}
      {route.stops?.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.coordinates.lat, stop.coordinates.lng]}
          icon={icons[stop.type] || icons.stop}
        />
      ))}
    </MapContainer>
  );
}

export default function JourneyMap({ route, journeyTitle, compact = false }: JourneyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 ${compact ? '' : 'rounded-xl overflow-hidden'}`}>
        <div className="aspect-[2/1] flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Compact mode - just the map, no info card
  if (compact) {
    return (
      <div className="h-full w-full">
        <MapContent route={route} />
      </div>
    );
  }

  // Full mode with info card
  const difficulty = route.difficulty || "moderate";

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--background-card)]">
      <div className="aspect-[2/1] md:aspect-[5/2]">
        <MapContent route={route} />
      </div>

      <div className="p-5 md:p-6 border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg md:text-xl">{route.name || journeyTitle}</h3>
            {route.description && (
              <p className="text-sm text-[var(--muted)] mt-1">{route.description}</p>
            )}
          </div>

          <span
            className="self-start px-3 py-1 rounded-full text-white text-xs font-medium capitalize"
            style={{ backgroundColor: difficultyColors[difficulty] }}
          >
            {difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--muted)]">
          {route.distance && <span>{route.distance} km</span>}
          {route.duration && <span>{route.duration}</span>}
          {route.elevationGain && <span>↑ {route.elevationGain}m</span>}
          {route.stops?.length > 0 && <span>{route.stops.length} stops</span>}
          {route.trailType && <span className="capitalize">{route.trailType.replace("-", " ")}</span>}
        </div>

        {route.stops?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {route.stops.sort((a, b) => a.order - b.order).map((stop) => (
              <span
                key={stop.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--background-alt)] rounded-full text-xs"
              >
                {stopIcons[stop.type]} {stop.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

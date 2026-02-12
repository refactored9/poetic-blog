"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JourneyRoute, RouteStop, RouteCoordinate } from "@/types/blog";
import dynamic from "next/dynamic";

// Dynamic imports for Leaflet components
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

interface RouteEditorProps {
  route: JourneyRoute | undefined;
  onChange: (route: JourneyRoute) => void;
}

const stopTypes: { value: RouteStop["type"]; label: string; icon: string }[] = [
  { value: "start", label: "Start Point", icon: "🚩" },
  { value: "stop", label: "Stop", icon: "📍" },
  { value: "viewpoint", label: "Viewpoint", icon: "👁️" },
  { value: "campsite", label: "Campsite", icon: "⛺" },
  { value: "water", label: "Water Source", icon: "💧" },
  { value: "food", label: "Food/Restaurant", icon: "🍴" },
  { value: "danger", label: "Danger Zone", icon: "⚠️" },
  { value: "poi", label: "Point of Interest", icon: "⭐" },
  { value: "end", label: "End Point", icon: "🏁" },
];

const difficultyOptions = [
  { value: "easy", label: "Easy", color: "#22c55e" },
  { value: "moderate", label: "Moderate", color: "#f59e0b" },
  { value: "difficult", label: "Difficult", color: "#ef4444" },
  { value: "expert", label: "Expert", color: "#7c3aed" },
];

const trailTypes = [
  { value: "loop", label: "Loop" },
  { value: "out-and-back", label: "Out and Back" },
  { value: "point-to-point", label: "Point to Point" },
  { value: "network", label: "Network" },
];

const defaultRoute: JourneyRoute = {
  enabled: false,
  name: "",
  description: "",
  path: [],
  stops: [],
  distance: undefined,
  duration: "",
  difficulty: "moderate",
  elevationGain: undefined,
  elevationLoss: undefined,
  mapCenter: { lat: 20.5937, lng: 78.9629 },
  mapZoom: 5,
  trailType: "out-and-back",
  bestSeason: [],
  warnings: [],
};

// Map click handler component
function MapClickHandler({
  mode,
  onPathClick,
  onStopClick,
}: {
  mode: "path" | "stop" | "none";
  onPathClick: (lat: number, lng: number) => void;
  onStopClick: (lat: number, lng: number) => void;
}) {
  const [MapEvents, setMapEvents] = useState<typeof import("react-leaflet").useMapEvents | null>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapEvents(() => mod.useMapEvents);
    });
  }, []);

  if (!MapEvents) return null;

  return <MapEventsComponent mode={mode} onPathClick={onPathClick} onStopClick={onStopClick} MapEvents={MapEvents} />;
}

function MapEventsComponent({
  mode,
  onPathClick,
  onStopClick,
  MapEvents,
}: {
  mode: "path" | "stop" | "none";
  onPathClick: (lat: number, lng: number) => void;
  onStopClick: (lat: number, lng: number) => void;
  MapEvents: typeof import("react-leaflet").useMapEvents;
}) {
  MapEvents({
    click: (e) => {
      if (mode === "path") {
        onPathClick(e.latlng.lat, e.latlng.lng);
      } else if (mode === "stop") {
        onStopClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapContent({
  route,
  mode,
  onPathClick,
  onStopClick,
  selectedStopId,
  onStopSelect,
}: {
  route: JourneyRoute;
  mode: "path" | "stop" | "none";
  onPathClick: (lat: number, lng: number) => void;
  onStopClick: (lat: number, lng: number) => void;
  selectedStopId: string | null;
  onStopSelect: (id: string) => void;
}) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [icons, setIcons] = useState<Record<string, import("leaflet").DivIcon> | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);

      const customIcons: Record<string, import("leaflet").DivIcon> = {};
      stopTypes.forEach(({ value, icon }) => {
        const colors: Record<string, string> = {
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
        customIcons[value] = leaflet.default.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background: ${colors[value]};
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              border: 2px solid white;
              cursor: pointer;
            ">
              <span style="font-size: 12px;">${icon}</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
      });
      setIcons(customIcons);
    });
  }, []);

  if (!L || !icons) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--background-alt)]">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const center = route.mapCenter || { lat: 20.5937, lng: 78.9629 };
  const pathCoordinates = route.path.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={route.mapZoom || 5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler mode={mode} onPathClick={onPathClick} onStopClick={onStopClick} />

      {/* Route path */}
      {pathCoordinates.length > 1 && (
        <Polyline
          positions={pathCoordinates}
          pathOptions={{
            color: difficultyOptions.find((d) => d.value === route.difficulty)?.color || "#f59e0b",
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}

      {/* Path points (small dots) */}
      {route.path.map((point, index) => (
        <Marker
          key={`path-${index}`}
          position={[point.lat, point.lng]}
          icon={L.divIcon({
            className: "path-point",
            html: `<div style="width: 8px; height: 8px; background: ${
              difficultyOptions.find((d) => d.value === route.difficulty)?.color || "#f59e0b"
            }; border-radius: 50%; border: 1px solid white;"></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4],
          })}
        />
      ))}

      {/* Stop markers */}
      {route.stops.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.coordinates.lat, stop.coordinates.lng]}
          icon={icons[stop.type]}
          eventHandlers={{
            click: () => onStopSelect(stop.id),
          }}
        />
      ))}
    </MapContainer>
  );
}

export default function RouteEditor({ route, onChange }: RouteEditorProps) {
  const [currentRoute, setCurrentRoute] = useState<JourneyRoute>(route || defaultRoute);
  const [mode, setMode] = useState<"path" | "stop" | "none">("none");
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [newStopType, setNewStopType] = useState<RouteStop["type"]>("stop");
  const [mounted, setMounted] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [pendingStopCoords, setPendingStopCoords] = useState<RouteCoordinate | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (route) {
      setCurrentRoute(route);
    }
  }, [route]);

  const updateRoute = useCallback(
    (updates: Partial<JourneyRoute>) => {
      const newRoute = { ...currentRoute, ...updates };
      setCurrentRoute(newRoute);
      onChange(newRoute);
    },
    [currentRoute, onChange]
  );

  const handlePathClick = useCallback(
    (lat: number, lng: number) => {
      const newPath = [...currentRoute.path, { lat, lng }];
      updateRoute({ path: newPath });
    },
    [currentRoute.path, updateRoute]
  );

  const handleStopClick = useCallback((lat: number, lng: number) => {
    setPendingStopCoords({ lat, lng });
    setShowStopModal(true);
  }, []);

  const addStop = useCallback(
    (name: string, description: string) => {
      if (!pendingStopCoords) return;

      const newStop: RouteStop = {
        id: `stop-${Date.now()}`,
        name: name || `Stop ${currentRoute.stops.length + 1}`,
        description,
        coordinates: pendingStopCoords,
        type: newStopType,
        order: currentRoute.stops.length,
      };

      updateRoute({ stops: [...currentRoute.stops, newStop] });
      setShowStopModal(false);
      setPendingStopCoords(null);
      setMode("none");
    },
    [currentRoute.stops, newStopType, pendingStopCoords, updateRoute]
  );

  const updateStop = useCallback(
    (stopId: string, updates: Partial<RouteStop>) => {
      const newStops = currentRoute.stops.map((stop) =>
        stop.id === stopId ? { ...stop, ...updates } : stop
      );
      updateRoute({ stops: newStops });
    },
    [currentRoute.stops, updateRoute]
  );

  const removeStop = useCallback(
    (stopId: string) => {
      const newStops = currentRoute.stops.filter((stop) => stop.id !== stopId);
      updateRoute({ stops: newStops });
      if (selectedStopId === stopId) {
        setSelectedStopId(null);
      }
    },
    [currentRoute.stops, selectedStopId, updateRoute]
  );

  const clearPath = useCallback(() => {
    updateRoute({ path: [] });
  }, [updateRoute]);

  const undoLastPathPoint = useCallback(() => {
    if (currentRoute.path.length > 0) {
      updateRoute({ path: currentRoute.path.slice(0, -1) });
    }
  }, [currentRoute.path, updateRoute]);

  const addWarning = useCallback(() => {
    const warning = prompt("Enter warning message:");
    if (warning) {
      updateRoute({ warnings: [...(currentRoute.warnings || []), warning] });
    }
  }, [currentRoute.warnings, updateRoute]);

  const removeWarning = useCallback(
    (index: number) => {
      const newWarnings = currentRoute.warnings?.filter((_, i) => i !== index) || [];
      updateRoute({ warnings: newWarnings });
    },
    [currentRoute.warnings, updateRoute]
  );

  const selectedStop = currentRoute.stops.find((s) => s.id === selectedStopId);

  if (!mounted) {
    return (
      <div className="card p-4 md:p-6">
        <div className="h-[400px] flex items-center justify-center bg-[var(--background-alt)] rounded-lg">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
          Hiking Route / Trail Map
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentRoute.enabled}
            onChange={(e) => updateRoute({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm">Enable Route Map</span>
        </label>
      </div>

      {currentRoute.enabled && (
        <>
          {/* Route Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1.5">Route Name</label>
              <input
                type="text"
                value={currentRoute.name || ""}
                onChange={(e) => updateRoute({ name: e.target.value })}
                placeholder="e.g., Valley of Flowers Trek"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5">Trail Type</label>
              <select
                value={currentRoute.trailType || "out-and-back"}
                onChange={(e) => updateRoute({ trailType: e.target.value as JourneyRoute["trailType"] })}
                className="input-field"
              >
                {trailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1.5">Route Description</label>
            <textarea
              value={currentRoute.description || ""}
              onChange={(e) => updateRoute({ description: e.target.value })}
              placeholder="Brief description of the trail..."
              rows={2}
              className="textarea-field"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Distance (km)</label>
              <input
                type="number"
                value={currentRoute.distance || ""}
                onChange={(e) => updateRoute({ distance: parseFloat(e.target.value) || undefined })}
                placeholder="12.5"
                step="0.1"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Duration</label>
              <input
                type="text"
                value={currentRoute.duration || ""}
                onChange={(e) => updateRoute({ duration: e.target.value })}
                placeholder="4-5 hours"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Elevation Gain (m)</label>
              <input
                type="number"
                value={currentRoute.elevationGain || ""}
                onChange={(e) => updateRoute({ elevationGain: parseInt(e.target.value) || undefined })}
                placeholder="800"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Difficulty</label>
              <select
                value={currentRoute.difficulty || "moderate"}
                onChange={(e) => updateRoute({ difficulty: e.target.value as JourneyRoute["difficulty"] })}
                className="input-field text-sm"
              >
                {difficultyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--background-alt)] rounded-lg">
            <span className="text-sm text-[var(--muted)] mr-2">Drawing Mode:</span>
            <button
              onClick={() => setMode(mode === "path" ? "none" : "path")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === "path"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              ✏️ Draw Path
            </button>
            <button
              onClick={() => setMode(mode === "stop" ? "none" : "stop")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mode === "stop"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              📍 Add Stop
            </button>

            {mode === "stop" && (
              <select
                value={newStopType}
                onChange={(e) => setNewStopType(e.target.value as RouteStop["type"])}
                className="px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--background-card)]"
              >
                {stopTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            )}

            <div className="flex-1" />

            <button
              onClick={undoLastPathPoint}
              disabled={currentRoute.path.length === 0}
              className="px-3 py-1.5 text-sm bg-[var(--background-card)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] disabled:opacity-50"
            >
              ↩️ Undo
            </button>
            <button
              onClick={clearPath}
              disabled={currentRoute.path.length === 0}
              className="px-3 py-1.5 text-sm bg-[var(--background-card)] border border-[var(--border)] rounded-lg hover:border-[var(--error)] text-[var(--error)] disabled:opacity-50"
            >
              🗑️ Clear Path
            </button>
          </div>

          {/* Mode Instructions */}
          {mode !== "none" && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {mode === "path"
                  ? "Click on the map to add points to your trail path. Points will be connected in order."
                  : "Click on the map to add a stop/waypoint. A form will open to enter details."}
              </p>
            </div>
          )}

          {/* Map */}
          <div className="h-[400px] rounded-lg overflow-hidden border border-[var(--border)]">
            <MapContent
              route={currentRoute}
              mode={mode}
              onPathClick={handlePathClick}
              onStopClick={handleStopClick}
              selectedStopId={selectedStopId}
              onStopSelect={setSelectedStopId}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
            <span>Path points: {currentRoute.path.length}</span>
            <span>Stops: {currentRoute.stops.length}</span>
          </div>

          {/* Stops List */}
          {currentRoute.stops.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Trail Stops</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentRoute.stops
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => (
                    <div
                      key={stop.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedStopId === stop.id
                          ? "border-[var(--accent)] bg-[var(--background-alt)]"
                          : "border-[var(--border)] bg-[var(--background-card)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">
                          {stopTypes.find((t) => t.value === stop.type)?.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={stop.name}
                            onChange={(e) => updateStop(stop.id, { name: e.target.value })}
                            className="font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
                            placeholder="Stop name"
                          />
                          <input
                            type="text"
                            value={stop.description || ""}
                            onChange={(e) => updateStop(stop.id, { description: e.target.value })}
                            className="text-sm text-[var(--muted)] bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full mt-1"
                            placeholder="Description (optional)"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              value={stop.type}
                              onChange={(e) => updateStop(stop.id, { type: e.target.value as RouteStop["type"] })}
                              className="text-xs px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)]"
                            >
                              {stopTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.icon} {type.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={stop.elevation || ""}
                              onChange={(e) => updateStop(stop.id, { elevation: parseInt(e.target.value) || undefined })}
                              placeholder="Elevation (m)"
                              className="text-xs px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)] w-24"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeStop(stop.id)}
                          className="p-1 text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Trail Warnings</h3>
              <button onClick={addWarning} className="text-sm text-[var(--accent)] hover:underline">
                + Add Warning
              </button>
            </div>
            {currentRoute.warnings && currentRoute.warnings.length > 0 && (
              <div className="space-y-1">
                {currentRoute.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded"
                  >
                    <span className="text-red-600 dark:text-red-400">⚠️</span>
                    <span className="flex-1 text-sm text-red-700 dark:text-red-300">{warning}</span>
                    <button
                      onClick={() => removeWarning(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Best Season */}
          <div>
            <label className="block text-sm mb-1.5">Best Time to Visit</label>
            <input
              type="text"
              value={currentRoute.bestSeason?.join(", ") || ""}
              onChange={(e) =>
                updateRoute({
                  bestSeason: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., March-June, September-November"
              className="input-field"
            />
          </div>
        </>
      )}

      {/* Add Stop Modal */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background-card)] rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-serif mb-4">Add Stop</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const description = (form.elements.namedItem("description") as HTMLInputElement).value;
                addStop(name, description);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1.5">Stop Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Base Camp"
                  className="input-field"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Brief description..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Stop Type</label>
                <select
                  value={newStopType}
                  onChange={(e) => setNewStopType(e.target.value as RouteStop["type"])}
                  className="input-field"
                >
                  {stopTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStopModal(false);
                    setPendingStopCoords(null);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent flex-1">
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { aqiOf, CATEGORIES } from "./aqi";
import { current, type Sensor } from "./sensors";

// Leaflet map of the network. Markers are colored by AQI; clicking one selects that sensor.
export default function SensorMap({
  sensors,
  selected,
  onSelect,
  className,
}: {
  sensors: Sensor[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, CircleMarker>>({});
  const L = useRef<typeof import("leaflet") | null>(null);
  const select = useRef(onSelect);
  useEffect(() => {
    select.current = onSelect;
  });

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (cancelled || !el.current) return;
      L.current = mod;
      map.current = mod
        .map(el.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true })
        .setView([40.845, -73.875], 12);
      mod
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        })
        .addTo(map.current);
      // Trigger a marker sync now that the map exists
      el.current.dispatchEvent(new Event("map-ready"));
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      const lib = L.current;
      if (!lib || !map.current) return;
      for (const s of sensors) {
        const v = current(s);
        const { aqi, cat } = aqiOf(v);
        const isSel = s.id === selected;
        let m = markers.current[s.id];
        if (!m) {
          m = lib.circleMarker([s.lat, s.lng], { radius: 11, weight: 2 }).addTo(map.current);
          m.on("click", () => select.current(s.id));
          markers.current[s.id] = m;
        }
        m.setStyle({
          fillColor: CATEGORIES[cat].color,
          fillOpacity: 0.9,
          color: isSel ? "#1d2d3d" : "#416180",
          weight: isSel ? 4 : 1.5,
        });
        m.setRadius(isSel ? 15 : 11);
        m.bindTooltip(`<b>${s.id}</b> · ${s.name}<br>AQI ${aqi} · PM2.5 ${v.toFixed(1)}`, {
          direction: "top",
          offset: [0, -10],
        });
      }
    };
    sync();
    const node = el.current;
    node?.addEventListener("map-ready", sync);
    return () => node?.removeEventListener("map-ready", sync);
  }, [sensors, selected]);

  return <div ref={el} className={className} />;
}

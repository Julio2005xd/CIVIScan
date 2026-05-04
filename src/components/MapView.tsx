import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report } from '../types';
import { CATEGORY_ICONS, STATUS_LABELS } from '../data/mockReports';

interface MapViewProps {
  reports?: Report[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedPin?: [number, number] | null;
  interactive?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:     '#F59E0B',
  in_review:   '#3B82F6',
  in_progress: '#6366F1',
  resolved:    '#22C55E',
  rejected:    '#EF4444',
};

function createMarkerIcon(color: string, emoji: string): L.DivIcon {
  return L.divIcon({
    className: 'civicscan-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 42px;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
      ">
        <svg viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:36px;height:42px;position:absolute;top:0;left:0;">
          <path d="M18 2C10.268 2 4 8.268 4 16c0 10 14 24 14 24S32 26 32 16C32 8.268 25.732 2 18 2z" fill="${color}" stroke="white" stroke-width="2"/>
        </svg>
        <span style="
          position:absolute;
          top:4px;left:0;right:0;
          display:flex;align-items:center;justify-content:center;
          font-size:14px;line-height:1;
        ">${emoji}</span>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  });
}

function createPickerIcon(): L.DivIcon {
  return L.divIcon({
    className: 'civicscan-marker',
    html: `
      <div style="
        position:relative;width:40px;height:48px;
        filter:drop-shadow(0 4px 8px rgba(29,78,216,0.4));
        animation: bounce 0.6s ease-out;
      ">
        <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:48px;">
          <path d="M20 2C10.611 2 3 9.611 3 19c0 12.5 17 29 17 29S37 31.5 37 19C37 9.611 29.389 2 20 2z" fill="#1D4ED8" stroke="white" stroke-width="2.5"/>
          <circle cx="20" cy="19" r="5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -50],
  });
}

export const MapView: React.FC<MapViewProps> = ({
  reports = [],
  center = [4.7110, -74.0721],
  zoom = 12,
  onMapClick,
  selectedPin,
  //interactive = false,
  className = '',
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const reportMarkersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    // Tile layer — OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom zoom control (top-right)
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer group for report markers
    const layerGroup = L.layerGroup().addTo(map);
    reportMarkersRef.current = layerGroup;

    // Click handler for location picking
    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render report markers
  useEffect(() => {
    const layerGroup = reportMarkersRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    reports.forEach((report) => {
      const color = STATUS_COLORS[report.status] ?? '#64748B';
      const emoji = CATEGORY_ICONS[report.category] ?? '📍';
      const icon = createMarkerIcon(color, emoji);

      const marker = L.marker([report.coordinates.lat, report.coordinates.lng], { icon });

      const popupContent = `
        <div style="font-family:'Figtree',sans-serif;min-width:180px;padding:4px 0;">
          <div style="font-size:13px;font-weight:700;color:#1E3A8A;margin-bottom:4px;line-height:1.3;">${report.title}</div>
          <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${report.address}</div>
          <div style="display:flex;gap:6px;align-items:center;">
            <span style="
              background:${color}18;color:${color};border:1px solid ${color}44;
              border-radius:99px;padding:2px 8px;font-size:11px;font-weight:600;
            ">${STATUS_LABELS[report.status]}</span>
            <span style="font-size:11px;color:#94a3b8;">👍 ${report.votes}</span>
          </div>
          <div style="margin-top:8px;">
            <a href="/reports/${report.id}" style="font-size:11px;color:#1D4ED8;font-weight:600;text-decoration:none;">Ver detalle →</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 240 });
      marker.addTo(layerGroup);
    });
  }, [reports]);

  // Handle selected pin for location picking
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }

    if (selectedPin) {
      const marker = L.marker(selectedPin, { icon: createPickerIcon() });
      marker.addTo(map);
      pickerMarkerRef.current = marker;
      map.setView(selectedPin, 16, { animate: true });
    }
  }, [selectedPin]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RotatingGlobeProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function RotatingGlobe({
  width = 500,
  height = 500,
  className = "",
}: RotatingGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, 500);
    const containerHeight = Math.min(height, 500);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const pointInPolygon = (
      point: [number, number],
      polygon: number[][]
    ): boolean => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (
          yi > y !== yj > y &&
          x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        ) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (
      point: [number, number],
      feature: d3.GeoPermissibleObjects & { geometry: { type: string; coordinates: number[][][] | number[][][][] } }
    ): boolean => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates as number[][][];
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        const coordinates = geometry.coordinates as number[][][][];
        for (const polygon of coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }
      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
    }

    const allDots: DotData[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Globe background
      context.beginPath();
      context.arc(
        containerWidth / 2,
        containerHeight / 2,
        currentScale,
        0,
        2 * Math.PI
      );
      const isDark = document.documentElement.classList.contains("dark");
      context.fillStyle = isDark ? "rgba(5, 5, 16, 0.8)" : "rgba(241, 245, 249, 0.8)";
      context.fill();
      context.strokeStyle = "rgba(59, 130, 246, 0.3)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(59, 130, 246, 0.08)";
        context.lineWidth = 0.5 * scaleFactor;
        context.stroke();

        // Land outlines
        context.beginPath();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          path(feature);
        });
        context.strokeStyle = "rgba(59, 130, 246, 0.25)";
        context.lineWidth = 0.8 * scaleFactor;
        context.stroke();

        // Dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(
              projected[0],
              projected[1],
              1 * scaleFactor,
              0,
              2 * Math.PI
            );
            context.fillStyle = "rgba(59, 130, 246, 0.5)";
            context.fill();
          }
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat });
          });
        });

        render();
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    const rotation: [number, number] = [0, -15];
    let autoRotate = true;
    const rotationSpeed = 0.3;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      }
    };

    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setTimeout(() => {
          autoRotate = true;
        }, 10);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [width, height]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}

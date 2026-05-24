"use client";

import { Box } from "@mantine/core";
import type { CSSProperties } from "react";
import { useId } from "react";

export type AvatarShape =
  | "circle"
  | "rounded"
  | "diamond"
  | "hexagon"
  | "star"
  | "heart"
  | "teardrop"
  | "blob-one"
  | "blob-two"
  | "octagon";

type AvatarShapeDefinition = {
  value: AvatarShape;
  label: string;
  path: string;
};

export const avatarShapes: AvatarShapeDefinition[] = [
  {
    value: "circle",
    label: "Circle",
    path: "M50 0A50 50 0 1 1 49.999 0Z",
  },
  {
    value: "rounded",
    label: "Rounded",
    path: "M20 8H80C91 8 92 9 92 20V80C92 91 91 92 80 92H20C9 92 8 91 8 80V20C8 9 9 8 20 8Z",
  },
  {
    value: "diamond",
    label: "Diamond",
    path: "M50 6L94 50L50 94L6 50Z",
  },
  {
    value: "hexagon",
    label: "Hexagon",
    path: "M25 8H75L94 50L75 92H25L6 50Z",
  },
  {
    value: "star",
    label: "Star",
    path: "M50 6L61 34L91 36L68 55L75 85L50 69L25 85L32 55L9 36L39 34Z",
  },
  {
    value: "heart",
    label: "Heart",
    path: "M50 88C48 88 46 86 44 84C26 68 10 56 10 35C10 22 20 12 33 12C41 12 48 16 50 23C52 16 59 12 67 12C80 12 90 22 90 35C90 56 74 68 56 84C54 86 52 88 50 88Z",
  },
  {
    value: "teardrop",
    label: "Teardrop",
    path: "M50 6C71 24 86 42 86 59C86 80 69 94 50 94C31 94 14 80 14 59C14 42 29 24 50 6Z",
  },
  {
    value: "blob-one",
    label: "Blob 1",
    path: "M28 10C40 4 57 6 68 15C80 24 92 37 90 52C88 67 82 82 69 89C56 96 39 95 28 88C18 82 8 72 8 58C8 43 10 21 28 10Z",
  },
  {
    value: "blob-two",
    label: "Blob 2",
    path: "M22 14C34 3 56 3 68 10C82 18 94 33 91 49C88 66 82 84 66 91C50 98 31 96 20 86C9 76 6 58 9 42C11 28 13 21 22 14Z",
  },
  {
    value: "octagon",
    label: "Octagon",
    path: "M28 6H72L94 28V72L72 94H28L6 72V28Z",
  },
];

export const getAvatarShape = (value: unknown): AvatarShape => {
  return avatarShapes.some((shape) => shape.value === value)
    ? (value as AvatarShape)
    : "circle";
};

export const getAvatarShapeDefinition = (shape: AvatarShape) => {
  return avatarShapes.find((item) => item.value === shape) || avatarShapes[0];
};

interface AvatarShapePreviewProps {
  shape: AvatarShape;
  size?: number;
  fill?: string;
  opacity?: number;
}

export function AvatarShapePreview({
  shape,
  size = 56,
  fill = "#ced4da",
  opacity = 1,
}: AvatarShapePreviewProps) {
  const definition = getAvatarShapeDefinition(shape);
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block", overflow: "visible", opacity }}
      aria-hidden="true"
    >
      <path d={definition.path} fill={fill} />
    </Box>
  );
}

interface ProfileBackgroundShapeProps {
  shape: AvatarShape;
  size: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  style?: CSSProperties;
}

export function ProfileBackgroundShape({
  shape,
  size,
  fill = "transparent",
  stroke = "#667eea",
  strokeWidth = 2,
  opacity = 0.12,
  style,
}: ProfileBackgroundShapeProps) {
  const definition = getAvatarShapeDefinition(shape);
  const shapeId = useId().replace(/:/g, "");

  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block", overflow: "visible", opacity, ...style }}
    >
      <path d={definition.path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" id={shapeId} />
    </Box>
  );
}

interface ProfileBackgroundPatternProps {
  shape: AvatarShape;
  seed: string;
  count?: number;
  color?: string;
  opacity?: number;
  minSize?: number;
  maxSize?: number;
  style?: CSSProperties;
}

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export function ProfileBackgroundPattern({
  shape,
  seed,
  count = 8,
  color = "#667eea",
  opacity = 0.18,
  minSize = 140,
  maxSize = 360,
  style,
}: ProfileBackgroundPatternProps) {
  const random = seededRandom(seed);
  const items = Array.from({ length: count }, (_, index) => {
    const laneWidth = 84;
    const laneLeft = 8 + random() * laneWidth;
    const step = 84 / Math.max(count - 1, 1);
    const baseTop = 8 + index * step;
    const jitter = (random() - 0.5) * step * 0.7;
    const top = Math.min(92, Math.max(8, baseTop + jitter));
    const size = minSize + random() * (maxSize - minSize);
    const rotation = random() * 360;
    const itemOpacity = Math.max(0.12, opacity * (0.85 + random() * 0.7));

    return { index, left: laneLeft, top, size, rotation, itemOpacity };
  });

  items.sort((leftItem, rightItem) => leftItem.top - rightItem.top);

  return (
    <Box
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {items.map((item) => (
        <Box
          key={`${seed}-${item.index}`}
          style={{
            position: "absolute",
            left: `${item.left}%`,
            top: `${item.top}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: item.itemOpacity,
          }}
        >
          <ProfileBackgroundShape
            shape={shape}
            size={item.size}
            fill="none"
            stroke={color}
            strokeWidth={3}
            opacity={1}
          />
        </Box>
      ))}
    </Box>
  );
}
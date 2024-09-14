import React from "react";
import { Svg, Path, Circle as SvgCircle } from "react-native-svg";

interface CustomMarkerProps {
  color: string;
  isObfuscated: boolean;
  zoomLevel: number;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  color,
  isObfuscated,
  zoomLevel,
}) => {
  const baseSize = 12;
  const maxZoomLevel = 16;
  const minZoomLevel = 8;
  const clampedZoomLevel = Math.max(
    minZoomLevel,
    Math.min(zoomLevel, maxZoomLevel),
  );

  const sizeMultiplier =
    1 + ((clampedZoomLevel - minZoomLevel) / (maxZoomLevel - minZoomLevel)) * 4;
  const adjustedSize = isObfuscated ? baseSize * sizeMultiplier : baseSize;

  const outlineColor = darkenColor(color, 0.2);
  const strokeWidth = 2;

  const viewBoxSize = adjustedSize * 2 + strokeWidth * 2;
  const center = viewBoxSize / 2;

  return (
    <Svg
      height={isObfuscated ? viewBoxSize : 40}
      width={isObfuscated ? viewBoxSize : 40}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      {isObfuscated ? (
        <SvgCircle
          cx={center}
          cy={center}
          r={adjustedSize}
          fill={color}
          fillOpacity="0.5"
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      ) : (
        <Path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill={color}
        />
      )}
    </Svg>
  );
};

const darkenColor = (color: string, amount: number) => {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) - Math.round(255 * amount);
  let g = ((num >> 8) & 0x00ff) - Math.round(255 * amount);
  let b = (num & 0x0000ff) - Math.round(255 * amount);

  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;
  return (
    (usePound ? "#" : "") +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
  );
};

export default CustomMarker;

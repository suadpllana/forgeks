import { useState } from "react";
import { Gamepad2 } from "lucide-react";

// Extract Steam App ID from Steam CDN URL
function extractSteamAppId(url) {
  if (!url) return null;
  const match = url.match(/\/steam\/apps\/(\d+)\//);
  return match ? match[1] : null;
}

// Build fallback URLs in priority order
function buildFallbacks(src) {
  const appId = extractSteamAppId(src);
  const fallbacks = [];

  if (appId) {
    // Different Steam CDN formats to try
    fallbacks.push(`https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`);
    fallbacks.push(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`);
    // RAWG API capsule (no key needed for basic)
    fallbacks.push(`https://media.rawg.io/media/games/${appId}.jpg`);
  }

  // Generic gaming placeholder with game controller
  fallbacks.push(null); // null = show placeholder SVG
  return fallbacks;
}

/**
 * GameImage - renders a game image with automatic fallback to Steam CDN formats.
 * Usage: <GameImage src={game.image} alt={game.title} className="..." style={...} />
 */
export default function GameImage({ src, alt, className, style, width, height }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const fallbacks = buildFallbacks(src);

  function handleError() {
    const nextIndex = fallbackIndex;
    if (nextIndex < fallbacks.length) {
      const nextSrc = fallbacks[nextIndex];
      setFallbackIndex(nextIndex + 1);
      if (nextSrc === null) {
        setFailed(true);
      } else {
        setCurrentSrc(nextSrc);
      }
    } else {
      setFailed(true);
    }
  }

  if (failed) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "#4a4a6a",
          ...(style || {}),
          width: width || "100%",
          height: height || "100%",
        }}
      >
        <Gamepad2 size={40} strokeWidth={1} />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || "Game image"}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
    />
  );
}

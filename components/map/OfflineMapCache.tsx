"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Download,
  Wifi,
  WifiOff,
  HardDrive,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface OfflineMapCacheProps {
  bounds: [[number, number], [number, number]];
  onCacheComplete?: () => void;
}

interface CacheStatus {
  isSupported: boolean;
  isOnline: boolean;
  cacheSize: number;
  totalTiles: number;
  cachedTiles: number;
  isDownloading: boolean;
}

const OfflineMapCache = ({ bounds, onCacheComplete }: OfflineMapCacheProps) => {
  const [open, setOpen] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isSupported: false,
    isOnline: navigator.onLine,
    cacheSize: 0,
    totalTiles: 0,
    cachedTiles: 0,
    isDownloading: false,
  });

  // Check if service worker + cache API are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = "serviceWorker" in navigator && "caches" in window;

      if (isSupported) {
        try {
          const cache = await caches.open("map-tiles-v1");
          const cachedRequests = await cache.keys();
          const cacheSize = cachedRequests.length;

          setCacheStatus((prev) => ({
            ...prev,
            isSupported: true,
            cacheSize,
            cachedTiles: cacheSize,
          }));
        } catch (error) {
          console.error("Cache check failed:", error);
        }
      }
    };

    checkSupport();
  }, []);

  // Monitor online/offline
  useEffect(() => {
    const handleOnline = () =>
      setCacheStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setCacheStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Tile URL generator
  const generateTileUrls = (
    bounds: [[number, number], [number, number]],
    minZoom: number = 8,
    maxZoom: number = 14
  ) => {
    const urls: string[] = [];
    const [southWest, northEast] = bounds;

    for (let z = minZoom; z <= maxZoom; z++) {
      const minTileX = Math.floor(
        ((southWest[1] + 180) / 360) * Math.pow(2, z)
      );
      const maxTileX = Math.floor(
        ((northEast[1] + 180) / 360) * Math.pow(2, z)
      );
      const minTileY = Math.floor(
        ((1 -
          Math.log(
            Math.tan((northEast[0] * Math.PI) / 180) +
              1 / Math.cos((northEast[0] * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
          Math.pow(2, z)
      );
      const maxTileY = Math.floor(
        ((1 -
          Math.log(
            Math.tan((southWest[0] * Math.PI) / 180) +
              1 / Math.cos((southWest[0] * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
          Math.pow(2, z)
      );

      for (let x = minTileX; x <= maxTileX; x++) {
        for (let y = minTileY; y <= maxTileY; y++) {
          urls.push(`https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`);
          urls.push(`https://b.tile.openstreetmap.org/${z}/${x}/${y}.png`);
          urls.push(`https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`);
        }
      }
    }

    return [...new Set(urls)];
  };

  // Download and cache map tiles
  const downloadMapTiles = async () => {
    if (!cacheStatus.isSupported || !cacheStatus.isOnline) return;

    setCacheStatus((prev) => ({ ...prev, isDownloading: true }));

    try {
      const cache = await caches.open("map-tiles-v1");
      const tileUrls = generateTileUrls(bounds);

      setCacheStatus((prev) => ({ ...prev, totalTiles: tileUrls.length }));

      let cachedCount = 0;

      for (const url of tileUrls) {
        try {
          const cachedResponse = await cache.match(url);
          if (!cachedResponse) {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response.clone());
            }
          }

          cachedCount++;
          setCacheStatus((prev) => ({ ...prev, cachedTiles: cachedCount }));

          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          console.warn(`Failed to cache tile: ${url}`, error);
        }
      }

      const finalCache = await caches.open("map-tiles-v1");
      const finalCachedRequests = await finalCache.keys();

      setCacheStatus((prev) => ({
        ...prev,
        isDownloading: false,
        cacheSize: finalCachedRequests.length,
        cachedTiles: finalCachedRequests.length,
      }));

      onCacheComplete?.();
    } catch (error) {
      console.error("Download failed:", error);
      setCacheStatus((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  // Clear cached tiles
  const clearCache = async () => {
    try {
      await caches.delete("map-tiles-v1");
      setCacheStatus((prev) => ({
        ...prev,
        cacheSize: 0,
        cachedTiles: 0,
        totalTiles: 0,
      }));
    } catch (error) {
      console.error("Cache clear failed:", error);
    }
  };

  const formatCacheSize = (tileCount: number) => {
    const estimatedSizeMB = (tileCount * 15) / 1024;
    return estimatedSizeMB > 1
      ? `${estimatedSizeMB.toFixed(1)} MB`
      : `${(estimatedSizeMB * 1024).toFixed(0)} KB`;
  };

  if (!cacheStatus.isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 right-4 z-[1000]">
        <Collapsible open={open} onOpenChange={setOpen}>
          {/* Toggle Button */}
          <CollapsibleTrigger asChild>
            <Button
            //   variant="outline"
            //   size="sm"
              className="w-full cursor-pointer flex items-center justify-between bg-white text-gray-800 hover:text-gray-500"
            >
              <span className="flex items-center gap-2">
                {cacheStatus.isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Offline Maps</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          {/* Collapsible Content */}
          <CollapsibleContent>
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              {/* Cache Status */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Cached Tiles:</span>
                  <span>{cacheStatus.cacheSize}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Storage Used:</span>
                  <span>{formatCacheSize(cacheStatus.cacheSize)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      cacheStatus.isOnline ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-gray-600">
                    {cacheStatus.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Download Progress */}
              {cacheStatus.isDownloading && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Downloading...</span>
                    <span>
                      {cacheStatus.cachedTiles}/{cacheStatus.totalTiles}
                    </span>
                  </div>
                  <Progress
                    value={
                      (cacheStatus.cachedTiles / cacheStatus.totalTiles) * 100
                    }
                    className="h-2"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadMapTiles}
                      disabled={
                        !cacheStatus.isOnline || cacheStatus.isDownloading
                      }
                      className="flex-1 text-gray-800 hover:text-gray-500"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {cacheStatus.isDownloading ? "Downloading..." : "Cache"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download map tiles for offline viewing</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearCache}
                      disabled={
                        cacheStatus.cacheSize === 0 || cacheStatus.isDownloading
                      }
                      className="flex-1 text-gray-800 hover:text-gray-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear cached tiles</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Offline Notice */}
              {!cacheStatus.isOnline && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <div className="flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    <span>You&apos;re offline. Using cached maps.</span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
};

export default OfflineMapCache;

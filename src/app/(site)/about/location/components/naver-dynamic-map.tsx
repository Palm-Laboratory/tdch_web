"use client";

import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    naver?: {
      maps?: NaverMapsSDK;
    };
  }
}

interface NaverMapsSDK {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
  Marker: new (options: Record<string, unknown>) => unknown;
}

const NAVER_MAP_SCRIPT_ID = "naver-maps-sdk";

function loadNaverMapScript(clientId: string): Promise<NaverMapsSDK> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available."));
  }

  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps);
  }

  const existing = document.getElementById(NAVER_MAP_SCRIPT_ID) as HTMLScriptElement | null;

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        if (window.naver?.maps) {
          resolve(window.naver.maps);
          return;
        }

        reject(new Error("NAVER Maps SDK did not initialize."));
      }, { once: true });

      existing.addEventListener("error", () => {
        reject(new Error("Failed to load NAVER Maps SDK."));
      }, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.async = true;

    script.addEventListener("load", () => {
      if (window.naver?.maps) {
        resolve(window.naver.maps);
        return;
      }

      reject(new Error("NAVER Maps SDK did not initialize."));
    }, { once: true });

    script.addEventListener("error", () => {
      reject(new Error("Failed to load NAVER Maps SDK."));
    }, { once: true });

    document.head.appendChild(script);
  });
}

export default function NaverDynamicMap({
  clientId,
  latitude,
  longitude,
  title,
}: {
  clientId?: string;
  latitude: number;
  longitude: number;
  title: string;
}) {
  const mapElementId = useId().replace(/:/g, "-");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoadError("네이버 지도 클라이언트 ID가 설정되지 않았습니다.");
      return;
    }

    let isMounted = true;

    loadNaverMapScript(clientId)
      .then((maps) => {
        if (!isMounted || !mapRef.current) {
          return;
        }

        const center = new maps.LatLng(latitude, longitude);
        const map = new maps.Map(mapRef.current, {
          center,
          zoom: 17,
          zoomControl: true,
          mapDataControl: false,
          scaleControl: false,
          logoControl: false,
        });

        new maps.Marker({
          position: center,
          map,
          title,
        });
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "네이버 지도를 불러오지 못했습니다.");
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, latitude, longitude, title]);

  if (loadError) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#edf4ff_0%,#f8fbff_46%,#eef6ff_100%)]">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(42,79,143,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,79,143,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative z-10 flex max-w-[24rem] flex-col items-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-[0_18px_32px_rgba(16,33,63,0.12)]">
            !
          </div>
          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.26em] text-cedar/55">
            Dynamic Map Unavailable
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/65 md:text-base">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return <div id={mapElementId} ref={mapRef} className="h-full w-full" aria-label={`${title} 지도`} />;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function usePageView(title: string) {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pageview",
      page: {
        url: location.pathname,
        title: title,
      },
    });
  }, [location, title]);
}

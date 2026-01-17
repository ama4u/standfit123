import React, { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
}

export default function Seo({ title, description, url, image, keywords }: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (el) {
        el.setAttribute(attr, value);
      } else {
        el = document.createElement("meta");
        if (selector.startsWith('meta[')) {
          // fallback for meta tags
        }
        // try to extract name or property from selector
        if (selector.includes("name=")) {
          const nameMatch = selector.match(/name=["']?([^"'\]]+)/);
          if (nameMatch) el.setAttribute("name", nameMatch[1]);
        } else if (selector.includes("property=")) {
          const propMatch = selector.match(/property=["']?([^"'\]]+)/);
          if (propMatch) el.setAttribute("property", propMatch[1]);
        }
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
    };

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);

      // Open Graph description
      meta = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "keywords");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", keywords);
    }

    if (url) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);

      let metaOgUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
      if (!metaOgUrl) {
        metaOgUrl = document.createElement("meta");
        metaOgUrl.setAttribute("property", "og:url");
        document.head.appendChild(metaOgUrl);
      }
      metaOgUrl.setAttribute("content", url);
    }

    if (image) {
      let meta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", image);

      let twitter = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
      if (!twitter) {
        twitter = document.createElement("meta");
        twitter.setAttribute("name", "twitter:image");
        document.head.appendChild(twitter);
      }
      twitter.setAttribute("content", image);
    }

    // Basic OG and twitter card defaults
    const ensureMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        const m = document.createElement("meta");
        if (selector.includes("property=")) {
          const propMatch = selector.match(/property=["']?([^"'\]]+)/);
          if (propMatch) m.setAttribute("property", propMatch[1]);
        } else if (selector.includes("name=")) {
          const nameMatch = selector.match(/name=["']?([^"'\]]+)/);
          if (nameMatch) m.setAttribute("name", nameMatch[1]);
        }
        m.setAttribute(attr, value);
        document.head.appendChild(m);
      }
    };

    ensureMeta('meta[property="og:type"]', 'content', 'website');
    ensureMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

    return () => {
      // No cleanup to preserve tags across SPA navigation; pages will overwrite as needed.
    };
  }, [title, description, url, image, keywords]);

  return null;
}

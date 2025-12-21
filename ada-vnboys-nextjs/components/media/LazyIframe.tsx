"use client";

import React, { useEffect, useRef, useState } from "react";

import { observeOnce } from "@/lib/observeOnce";

type LazyIframeProps = Omit<React.ComponentPropsWithoutRef<"iframe">, "src"> & {
  src: string;
};

export default function LazyIframe({ src, ...props }: LazyIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const node = iframeRef.current;
    if (!node) return;

    return observeOnce(
      node,
      () => {
        setShouldLoad(true);
      },
      { threshold: 0.25 },
    );
  }, [shouldLoad]);

  return <iframe ref={iframeRef} src={shouldLoad ? src : undefined} loading="lazy" {...props} />;
}


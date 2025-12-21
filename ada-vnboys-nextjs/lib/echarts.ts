let echartsPromise: Promise<typeof import("echarts")> | null = null;

export function loadECharts() {
  if (!echartsPromise) {
    echartsPromise = import("echarts");
  }
  return echartsPromise;
}


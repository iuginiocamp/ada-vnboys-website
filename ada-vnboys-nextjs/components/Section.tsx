import type React from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ paddingBlock: 28 }}>{children}</div>;
}


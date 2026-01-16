"use client";

import { StudioAuthProvider, StudioLoginGate } from "./StudioAuth";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioAuthProvider>
      <StudioLoginGate>{children}</StudioLoginGate>
    </StudioAuthProvider>
  );
}

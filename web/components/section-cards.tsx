"use client";

import { Boxes, ClockPlus, Layers, Package } from "lucide-react";
import { SectionCard } from "./section-card";

export type SectionCardsProps = {
  kpis: {
    ordersCount: number;
    totalUnits: number;
    totalPallets: number;
    percentageOnTime: number;
  };
};

export function SectionCards({ kpis }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SectionCard
        title="Total Orders"
        value={kpis.ordersCount}
        icon={Package}
      />
      <SectionCard title="Total Units" value={kpis.totalUnits} icon={Boxes} />
      <SectionCard
        title="Total Pallets"
        value={kpis.totalPallets}
        icon={Layers}
      />
      <SectionCard
        title="% On-time"
        value={kpis.percentageOnTime + "%"}
        icon={ClockPlus}
      />
    </div>
  );
}

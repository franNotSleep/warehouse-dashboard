"use client";

import { ArrowDownToLine } from "lucide-react";
import { Order } from "../models/order";

interface ColumnPutawayProps {
  orders: Order[];
  warehouseCapacity: number;
  availableLocations: number;
  inProgressPallets: number;
  pendingPallets: number;
}

export function ColumnPutaway({
  orders,
  warehouseCapacity,
  availableLocations,
  inProgressPallets,
  pendingPallets,
}: ColumnPutawayProps) {
  const occupiedLocations = warehouseCapacity - availableLocations;
  const capacityPercentage = Math.ceil(
    (occupiedLocations / warehouseCapacity) * 100,
  );
  return (
    <div className="flex flex-col gap-3 min-w-[260px] flex-1">
      <div className="flex items-center gap-2 px-1 mb-1">
        <ArrowDownToLine className="h-4 w-4 text-chart-5" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Put Away
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary rounded-md px-2 py-0.5">
          {orders.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {/* Capacity Overview */}
        <div className="rounded-lg bg-card border border-border p-3 flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Warehouse Capacity
          </p>
          <div className="flex items-end justify-between">
            <span
              className={`text-2xl font-bold font-mono ${warehouseCapacity > 85 ? "text-destructive" : warehouseCapacity > 70 ? "text-chart-3" : "text-primary"}`}
            >
              {capacityPercentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              {occupiedLocations}/{warehouseCapacity} 
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${warehouseCapacity > 85 ? "bg-destructive" : warehouseCapacity > 70 ? "bg-chart-3" : "bg-primary"}`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-lg bg-card border border-border p-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-bold font-mono text-chart-2">
              {pendingPallets}
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">In Progress</p>
            <p className="text-lg font-bold font-mono text-primary">
              {inProgressPallets}
            </p>
          </div>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg bg-card border border-border p-3 flex flex-col gap-1.5 hover:border-chart-3/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                ORD-{order.id}
              </span>
              <span className="text-xs font-mono text-chart-1">
                {order.items.reduce((acc, cur) => (acc += cur.units), 0)} units
              </span>
            </div>
            <p className="text-sm text-foreground">
              {order.items.map((i) => i.item.name).join(" | ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

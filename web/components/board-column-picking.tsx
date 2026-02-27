"use client";

import { ScanBarcode, User, AlertTriangle, Truck } from "lucide-react";
import { OrderPriority, Order } from "@/models/order";
import { getOrderUnits } from "@/lib/get-order-units";

interface ColumnPickingProps {
  orders: Order[];
}

function getPriorityColor(priority: OrderPriority) {
  switch (priority) {
    case OrderPriority.LOW:
      return "text-muted-foreground";
    case OrderPriority.MEDIUM:
      return "text-chart-2";
    case OrderPriority.HIGH:
      return "text-destructive";
  }
}

function getPriorityLabel(priority: OrderPriority) {
  switch (priority) {
    case OrderPriority.LOW:
      return "Low";
    case OrderPriority.MEDIUM:
      return "Medium";
    case OrderPriority.HIGH:
      return "High";
  }
}

function getAgeMinutes(createdAt: string | Date) {
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 60000);
}

export function ColumnPicking({ orders }: ColumnPickingProps) {
  return (
    <div className="flex flex-col gap-3 min-w-[260px] flex-1">
      <div className="flex items-center gap-2 px-1 mb-1">
        <ScanBarcode className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Picking
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary rounded-md px-2 py-0.5">
          {orders.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {orders.map((order) => {
          const age = getAgeMinutes(order.createdAt);
          const isAging = age > 30;
          return (
            <div
              key={order.id}
              className={`rounded-lg bg-card border p-3 flex flex-col gap-2 transition-colors ${
                order.priority == OrderPriority.MEDIUM
                  ? "border-destructive/40 hover:border-destructive/60"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  ORD-{order.id}
                </span>
                <span
                  className={`text-xs font-semibold ${getPriorityColor(order.priority)}`}
                >
                  {order.priority == OrderPriority.MEDIUM && (
                    <AlertTriangle className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                  )}
                  {getPriorityLabel(order.priority)}
                </span>
              </div>
              <p className="text-sm text-foreground">
                {order.items.map((i) => i.item.name).join(", ")}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono">{getOrderUnits(order)} units</span>
                <span className="text-border">|</span>
                <span>{order.items.length} lines</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                {order.outShipment?.carrier ? (
                  <span className="flex items-center gap-1 text-foreground">
                    <Truck className="h-3 w-3" />
                    {order.outShipment.carrier}
                  </span>
                ) : (
                  <span className="text-destructive">Unassigned</span>
                )}
                {isAging && (
                  <span className="text-chart-1 font-mono">{age}m ago</span>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(10, 100 - age))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No active picks
          </div>
        )}
      </div>
    </div>
  );
}

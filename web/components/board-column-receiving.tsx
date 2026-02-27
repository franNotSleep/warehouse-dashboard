"use client";

import { Shipment, ShipmentStatus, ShipmentType } from "@/models/shipment";
import { Truck } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { formatDate } from "@/lib/format-date";

interface ColumnReceivingProps {
  shipments: Shipment[];
}

function getStatusVariant(status: ShipmentStatus) {
  switch (status) {
    case ShipmentStatus.ARRIVED:
      return "success" as const;
    case ShipmentStatus.UNLOADING:
      return "warning" as const;
    case ShipmentStatus.SCHEDULED:
      return "info" as const;
    default:
      return "default" as const;
  }
}

export function ColumnReceiving({ shipments }: ColumnReceivingProps) {
  return (
    <div className="flex flex-col gap-3 min-w-[260px] flex-1">
      <div className="flex items-center gap-2 px-1 mb-1">
        <Truck className="h-4 w-4 text-chart-2" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Receiving
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary rounded-md px-2 py-0.5">
          {shipments.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {shipments.map((shipment) => {
          const order =
            shipment.type === ShipmentType.INBOUND
              ? shipment.inOrder
              : shipment.outOrder;
          const units = order?.items.reduce(
            (acc, cur) => (acc += cur.units),
            0,
          );

          return (
            <div
              key={shipment.id}
              className="rounded-lg bg-card border border-border p-3 flex flex-col gap-2 hover:border-chart-2/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  IN-{shipment.id}
                </span>
                <StatusBadge
                  status={shipment.status}
                  variant={getStatusVariant(shipment.status)}
                />
              </div>
              <p className="text-sm font-medium text-foreground">
                {shipment.carrier}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{order?.pallets} pallets</span>
                <span className="text-border">|</span>
                <span>{units} units</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Dock {shipment.dock}
                </span>
                <span className="font-mono text-muted-foreground">
                  ETA {formatDate(shipment.eta)}
                </span>
              </div>
            </div>
          );
        })}
        {shipments.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No inbound shipments
          </div>
        )}
      </div>
    </div>
  );
}

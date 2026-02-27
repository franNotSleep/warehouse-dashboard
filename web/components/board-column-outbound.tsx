"use client";

import { Send, AlertTriangle } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Shipment, ShipmentStatus } from "../models/shipment";
import { getOrderUnits } from "../lib/get-order-units";
import { formatDate } from "../lib/format-date";

interface ColumnOutboundProps {
  outboundShipments: Shipment[];
}

function getOutboundVariant(status: ShipmentStatus) {
  switch (status) {
    case ShipmentStatus.READY:
      return "info" as const;
    case ShipmentStatus.LOADING:
      return "warning" as const;
    default:
      return "danger" as const;
  }
}

export function ColumnOutbound({ outboundShipments }: ColumnOutboundProps) {
  const atRiskCount = outboundShipments.filter(
    (o) => o.status === ShipmentStatus.DELAYED,
  ).length;

  return (
    <div className="flex flex-col gap-3 min-w-[260px] flex-1">
      <div className="flex items-center gap-2 px-1 mb-1">
        <Send className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Outbound
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary rounded-md px-2 py-0.5">
          {outboundShipments.length}
        </span>
        {atRiskCount > 0 && (
          <span className="text-xs font-semibold text-destructive bg-destructive/15 rounded-md px-2 py-0.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {atRiskCount} at risk
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {outboundShipments.map((outbound) => {
          const order = outbound.outOrder;
          const isDelayed = outbound.status === ShipmentStatus.DELAYED;

          return (
            <div
              key={outbound.id}
              className={`rounded-lg bg-card border p-3 flex flex-col gap-2 transition-colors ${
                isDelayed
                  ? "border-destructive/50 bg-destructive/5 animate-pulse"
                  : "border-border hover:border-destructive/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  OUT-{outbound.id}
                </span>
                <StatusBadge
                  status={outbound.status}
                  variant={getOutboundVariant(outbound.status)}
                />
              </div>
              <p className="text-sm font-medium text-foreground">
                {outbound.carrier}
              </p>
              {order && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-mono">{order.id}</span>
                  <span className="mx-1 text-border">-</span>
                  <span>{getOrderUnits(order)} units</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{outbound.dock}</span>
                <span className="font-mono text-muted-foreground">
                  {formatDate(outbound.eta)}
                </span>
              </div>
              {isDelayed && (
                <div className="flex items-center gap-1 text-xs text-destructive font-medium mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  Shipment delayed - requires attention
                </div>
              )}
            </div>
          );
        })}
        {outboundShipments.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No outbound shipments
          </div>
        )}
      </div>
    </div>
  );
}

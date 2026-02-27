"use client";

import { ClipboardCheck, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Order, OrderStatus } from "../models/order";
import { getOrderUnits } from "@/lib/get-order-units";

interface ColumnAuditProps {
  orders: Order[];
  passRate: number;
  waiting: number;
}

function getAuditVariant(result: OrderStatus) {
  switch (result) {
    case OrderStatus.PASSED:
      return "success" as const;
    case OrderStatus.FAILED:
      return "danger" as const;
    default:
      return "warning" as const;
  }
}

function getAuditIcon(result: OrderStatus) {
  switch (result) {
    case OrderStatus.PASSED:
      return CheckCircle;
    case OrderStatus.FAILED:
      return XCircle;
    default:
      return Clock;
  }
}

export function ColumnAudit({ orders, passRate, waiting }: ColumnAuditProps) {
  return (
    <div className="flex flex-col gap-3 min-w-[260px] flex-1">
      <div className="flex items-center gap-2 px-1 mb-1">
        <ClipboardCheck className="h-4 w-4 text-chart-5" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Pre-Ship Audit
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary rounded-md px-2 py-0.5">
          {orders.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {/* Summary stats */}
        <div className="rounded-lg bg-card border border-border p-3 flex items-center gap-3">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">Waiting</p>
            <p className="text-lg font-bold font-mono text-chart-2">
              {waiting}
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">Pass Rate</p>
            <p
              className={`text-lg font-bold font-mono ${passRate >= 80 ? "text-primary" : "text-destructive"}`}
            >
              {passRate}%
            </p>
          </div>
        </div>

        {orders.map((order) => {
          const Icon = getAuditIcon(order.status);
          const items = order.items.map((i) => i.item.name).join(" | ");
          return (
            <div
              key={order.id}
              className={`rounded-lg bg-card border p-3 flex flex-col gap-2 transition-colors ${
                order.status === OrderStatus.FAILED
                  ? "border-destructive/40"
                  : "border-border hover:border-chart-5/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  ORD-{order.id}
                </span>
                <StatusBadge
                  status={
                    order.status === OrderStatus.AUDITING
                      ? "Auditing"
                      : order.status === OrderStatus.PASSED
                        ? "Passed"
                        : "Failed"
                  }
                  variant={getAuditVariant(order.status)}
                />
              </div>
              <p className="text-sm text-foreground">{items}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{getOrderUnits(order)} units</span>
                <Icon
                  className={`h-4 w-4 ${
                    order.status === OrderStatus.PASSED
                      ? "text-primary"
                      : order.status === OrderStatus.FAILED
                        ? "text-destructive"
                        : "text-chart-3"
                  }`}
                />
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No orders in audit
          </div>
        )}
      </div>
    </div>
  );
}

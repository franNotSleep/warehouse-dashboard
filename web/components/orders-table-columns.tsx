import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import { Order, OrderStatus } from "@/models/order";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { ShipmentStatus } from "@/models/shipment";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export const columns = (
  onStatusChange: (orderId: number, newStatus: OrderStatus) => Promise<void>,
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: () => <div className="ml-4">Order</div>,
    cell: ({ row }) => (
      <div className="ml-4 flex flex-col">
        <p className="font-semibold tracking-tight">ORD-{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const config = priorityConfig[row.original.priority];
      return (
        <Badge
          variant="outline"
          className={cn("font-medium capitalize", config.className)}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "pallets",
    header: "Pallets",
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <p>{row.original.pallets} pallets</p>
      </div>
    ),
  },
  {
    id: "units",
    header: "Units",
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <p>
          {row.original.items.reduce((acc, cur) => (acc += cur.units), 0)} units
        </p>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Line Items",
    cell: ({ row }) => {
      const items = row.original.items;
      const itemsFormatted = items.map((i) => `${i.item.name} (${i.item.sku})`);

      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              {itemsFormatted.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </TooltipTrigger>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <OrderStatusCell order={row.original} onStatusChange={onStatusChange} />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const created = new Date(row.original.createdAt);
      const minutesOld = (Date.now() - created.getTime()) / 60000;

      const isAging = minutesOld > 60;

      return (
        <div className="flex items-center gap-2">
          <Calendar className={cn("h-4 w-4", isAging && "text-red-500")} />
          <span
            className={cn("text-sm", isAging && "text-red-600 font-medium")}
          >
            {formatDate(row.original.createdAt)}
          </span>
        </div>
      );
    },
  },
];

export type OrderStatusCellProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => Promise<void>;
};

function OrderStatusCell({ order, onStatusChange }: OrderStatusCellProps) {
  const handleChange = async (value: OrderStatus) => {
    await onStatusChange(order.id, value);
  };

  let statuses: OrderStatus[] = [];
  let next: OrderStatus;

  switch (order.status) {
    case OrderStatus.RECEIVING:
      if (order.inShipment?.status === ShipmentStatus.UNLOADING) {
        next = OrderStatus.PUTTING_AWAY;
        statuses = [next, OrderStatus.RECEIVING];
      } else {
        next = OrderStatus.RECEIVING;
        statuses = [next];
      }
      break;
    case OrderStatus.PUTTING_AWAY:
      next = OrderStatus.PICKING;
      statuses = [next, OrderStatus.RECEIVING, OrderStatus.PUTTING_AWAY];
      break;
    case OrderStatus.PICKING:
      next = OrderStatus.AUDITING;
      statuses = [next, OrderStatus.PUTTING_AWAY, OrderStatus.PICKING];
      break;
    case OrderStatus.AUDITING:
      next = OrderStatus.PASSED;
      statuses = [
        next,
        OrderStatus.FAILED,
        OrderStatus.PICKING,
        OrderStatus.AUDITING,
      ];
      break;
    case OrderStatus.PASSED:
      next = OrderStatus.SHIPPING;
      statuses = [next, OrderStatus.AUDITING, OrderStatus.PASSED];
      break;
    case OrderStatus.FAILED:
      next = OrderStatus.AUDITING;
      statuses = [next, OrderStatus.FAILED];
      break;
    case OrderStatus.SHIPPING:
      next = OrderStatus.AUDITING;
      statuses = [next, OrderStatus.SHIPPING];
  }

  return (
    <Select value={order.status} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] border-2 border-secondary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

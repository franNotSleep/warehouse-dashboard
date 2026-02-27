import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import { Shipment, ShipmentStatus, ShipmentType } from "@/models/shipment";
import { formatDate } from "@/lib/format-date";

export const columns = (
  onStatusChange: (
    shipmentId: number,
    newStatus: ShipmentStatus,
  ) => Promise<void>,
): ColumnDef<Shipment>[] => [
  {
    accessorKey: "id",
    header: () => <div className="ml-4">ID</div>,
    cell: ({ row }) => {
      const prefix = row.original.type === ShipmentType.INBOUND ? "IN" : "OUT";
      return (
        <div className="ml-4">
          <p className="font-medium text-left">
            {prefix}-{row.original.id}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <p className="font-medium">{row.original.type}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <p className="font-medium">{row.original.carrier}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => {
      const order = (
        row.original.type === ShipmentType.INBOUND
          ? row.original.inOrder
          : row.original.outOrder
      )!;
      return (
        <div className="text-left">
          <p className="font-medium">ORD-{order.id}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dock",
    header: "Dock",
    cell: ({ row }) => {
      return (
        <div className="text-left">
          <p className="font-medium">{row.original.dock.toUpperCase()}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const shipment = row.original;
      const handleChange = async (value: ShipmentStatus) => {
        if (value !== ShipmentStatus.READY)
          await onStatusChange(shipment.id, value);
      };

      let statuses: ShipmentStatus[] = [];

      if (shipment.type === ShipmentType.INBOUND) {
        statuses = [
          ShipmentStatus.SCHEDULED,
          ShipmentStatus.ARRIVED,
          ShipmentStatus.UNLOADING,
          ShipmentStatus.READY,
        ];
      } else {
        statuses = [
          ShipmentStatus.READY,
          ShipmentStatus.LOADING,
          ShipmentStatus.DELAYED,
        ];
      }

      return (
        <Select value={row.original.status} onValueChange={handleChange}>
          <SelectTrigger className="w-[140px]">
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
    },
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Calendar className={`h-4 w-4`} />
          <div>
            <p className={`font-medium`}>{formatDate(row.original.eta)}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Calendar className={`h-4 w-4`} />
          <p className={`font-medium`}>{formatDate(row.original.createdAt)}</p>
        </div>
      );
    },
  },
];

"use client";

import { ShipmentsTable } from "@/components/shipments-table";
import config from "@/config/config";
import { Shipment, ShipmentStatus } from "@/models/shipment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ShipmentView() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const onStatusChange = async (
    shipmentId: number,
    newStatus: ShipmentStatus,
  ) => {
    const loadingToast = toast.loading("Updating...");

    try {
      const result = await fetch(
        config.API_URL + `/api/shipments/${shipmentId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!result.ok) {
        toast.dismiss(loadingToast);
        toast.error("Unexpected Error. Please try again");
        return;
      }

      const responseJSON = await result.json();

      if (!responseJSON) {
        toast.dismiss(loadingToast);
        toast.error("Unexpected Error. Please try again");
        return;
      }

      setShipments((prev) =>
        prev.map((o) =>
          o.id === shipmentId ? { ...o, status: newStatus } : o,
        ),
      );

      toast.dismiss(loadingToast);
      toast.success("Status changed!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Shipment Status Update failed. Please try again.");
      console.log("Shipment Status Update failed. Please try again: ", error);
    }
  };

  useEffect(() => {
    const fetchShipments = async () => {
      const result = await fetch(config.API_URL + "/api/shipments", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        setShipments(await result.json());
      }
    };

    fetchShipments();
  }, []);

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="flex w-full justify-between items-center">
        <p className="text-xl font-semibold">Shipments</p>
      </div>
      <ShipmentsTable onStatusChange={onStatusChange} shipments={shipments} />
    </div>
  );
}

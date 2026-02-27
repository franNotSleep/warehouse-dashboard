"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Board } from "@/components/board";
import { InboundShipment } from "@/lib/types/inbound-shipment.type";
import { OutboundShipment } from "@/lib/types/outbound-shipment.type";
import { Order } from "@/models/order";
import { useEffect, useState } from "react";
import config from "@/config/config";
import { ShipmentStatusChangePayload } from "@/lib/types/shipments-sse-payload.type";
import { ShipmentType } from "@/models/shipment";

export type BoardData = {
  receiving: Array<InboundShipment>;
  outbound: Array<OutboundShipment>;
  auditing: {
    pending: number;
    passRate: number;
    orders: Order[];
  };
  putAway: {
    pending: number;
    inProgress: number;
    occupied: number;
    capacity: number;
    orders: Order[];
  };
  picking: Order[];
};

const defaultBoardData = {
  outbound: [],
  receiving: [],
  auditing: {
    pending: 0,
    passRate: 0,
    orders: [],
  },
  putAway: {
    pending: 0,
    inProgress: 0,
    occupied: 0,
    capacity: 500,
    orders: [],
  },
  picking: [],
};

export default function Page() {
  const [boardData, setBoardData] = useState<BoardData>(defaultBoardData);
  const [kpis, setKpis] = useState({
    ordersCount: 0,
    totalUnits: 0,
    totalPallets: 0,
    percentageOnTime: 0,
  });

  useEffect(() => {
    const fetchKpis = async () => {
      const result = await fetch(`${config.API_URL}/api/dashboard/kpis`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setKpis(await result.json());
    };

    fetchKpis();

    const fetchBoardData = async () => {
      const result = await fetch(`${config.API_URL}/api/dashboard/board`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.ok) {
        setBoardData(await result.json());
      }
    };

    fetchBoardData();
    const eventSource = new EventSource(
      `${config.API_URL}/api/dashboard/watch`,
      { withCredentials: true },
    );

    eventSource.onmessage = (payload) => {
      const data = JSON.parse(payload.data);
      console.log(data)

      fetchBoardData();
      if (data.event.includes("new")) {
        fetchKpis();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {}, []);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards kpis={kpis} />
              <Board boardData={boardData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { OrderForm, OrderFormValues } from "@/components/order-form";
import { OrdersTable } from "@/components/orders-table";
import { ShipmentForm, ShipmentFormValues } from "@/components/shipment-form";
import { Button } from "@/components/ui/button";
import config from "@/config/config";
import { Order, OrderStatus } from "@/models/order";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function OrdersView() {
  const [openOrderForm, setOpenOrderForm] = useState(false);
  const [openShipmentForm, setOpenShipmentForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const onStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setSelectedOrderId(orderId);

    if (newStatus === OrderStatus.PICKING) {
      setOpenShipmentForm(true);
      return;
    }

    const loadingToast = toast.loading("Updating...");

    try {
      const result = await fetch(
        config.API_URL + `/api/orders/${orderId}/status`,
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

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      toast.dismiss(loadingToast);
      toast.success("Status changed!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Order Status Update failed. Please try again.");
      console.log("Order Status Update failed. Please try again: ", error);
    } finally {
      setSelectedOrderId(null);
    }
  };

  const onSubmitShipment = async (
    values: ShipmentFormValues,
    reset: () => void,
  ) => {
    const loadingToast = toast.loading("Creating...");

    try {
      const result = await fetch(config.API_URL + "/api/shipments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseJSON = await result.json();

      if (!responseJSON) {
        toast.dismiss(loadingToast);
        toast.error("Unexpected Error. Please try again");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Shipment created!");
      reset();

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId ? { ...o, status: OrderStatus.PICKING } : o,
        ),
      );

      setOpenShipmentForm(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Shipment creation failed. Please try again.");
      console.error("Shipment creation failed:", error);
    } finally {
      setSelectedOrderId(null);
    }
  };

  const onSubmit = async (values: OrderFormValues) => {
    const loadingToast = toast.loading("Creating...");

    try {
      const result = await fetch(config.API_URL + "/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

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

      setOrders([responseJSON, ...orders]);
      toast.dismiss(loadingToast);
      toast.success("Order created!");
      setOpenOrderForm(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Order creation failed. Please try again.");
      console.error("Order creation failed:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await fetch(config.API_URL + "/api/orders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        setOrders(await result.json());
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="flex w-full justify-between items-center">
        <p className="text-xl font-semibold">Orders</p>
        <Button onClick={() => setOpenOrderForm(true)}>
          <Plus /> Order
        </Button>
      </div>
      <OrderForm
        onOpenChange={setOpenOrderForm}
        open={openOrderForm}
        onSubmit={onSubmit}
      />
      <OrdersTable onStatusChange={onStatusChange} orders={orders} />

      <ShipmentForm
        onOpenChange={setOpenShipmentForm}
        orderId={selectedOrderId!}
        open={openShipmentForm}
        onSubmit={onSubmitShipment}
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const shipmentTypeEnum = z.enum(["inbound", "outbound"]);

export const shipmentSchema = z.object({
  carrier: z.string().min(1, "Carrier is required"),
  orderId: z.int(),
  dock: z
    .string()
    .min(1, "Dock is required")
    .max(20, "Dock identifier too long"),
  eta: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "ETA must be a valid ISO date string",
  }),
});

export type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export type ShipmentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ShipmentFormValues, reset: () => void) => void;
  orderId: number;
};

export function ShipmentForm({
  open,
  onOpenChange,
  onSubmit,
  orderId,
}: ShipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      orderId: orderId,
    },
  });

  setValue('orderId', orderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit((value) => onSubmit(value, reset))}>
          <DialogHeader className="mb-6">
            <DialogTitle>Create Shipment</DialogTitle>
            <DialogDescription>Add a new outbound shipment.</DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            {/* Carrier */}
            <Field>
              <Label>Carrier</Label>
              <Input {...register("carrier")} />
              {errors.carrier && (
                <p className="text-sm text-red-500">{errors.carrier.message}</p>
              )}
            </Field>

            <Field>
              <Label>Order</Label>
              <Input
                disabled
                readOnly
                value={`ORD-${orderId}`}
              />
            </Field>

            {/* Dock */}
            <Field>
              <Label>Dock</Label>
              <Input {...register("dock")} placeholder="Dock 3" />
              {errors.dock && (
                <p className="text-sm text-red-500">{errors.dock.message}</p>
              )}
            </Field>

            {/* ETA */}
            <Field>
              <Label>ETA</Label>
              <Input type="datetime-local" {...register("eta")} />
              {errors.eta && (
                <p className="text-sm text-red-500">{errors.eta.message}</p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Shipment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

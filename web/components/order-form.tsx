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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import {
  SelectItem,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "./ui/select";
import { ItemCombobox } from "./item-combobox";
import { useCallback, useEffect, useState } from "react";
import { Item } from "@/models/item";
import config from "@/config/config";
import { X } from "lucide-react";

export const orderPriorityEnum = z.enum(["low", "medium", "high"]);

const lineItemSchema = z.object({
  itemId: z.number().int().min(1, "Item is required"),
  units: z.number().int().min(1, "Units must be at least 1"),
});

export const orderSchema = z.object({
  priority: orderPriorityEnum,
  pallets: z.number().int().min(1, "Pallets must be at least 1"),
  carrier: z.string().min(1, "Carrier must be at least 1"),
  dock: z
    .string()
    .min(1, "Dock is required")
    .max(20, "Dock identifier too long"),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  eta: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "ETA must be a valid ISO date string",
  }),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export type OrderFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OrderFormValues) => void;
};

export function OrderForm({ open, onOpenChange, onSubmit }: OrderFormProps) {
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: "low",
      lineItems: [{ itemId: 1, units: 1 }],
    },
  });

  const fetchItems = useCallback(async (q: string = "") => {
    try {
      setLoadingItems(true);

      const result = await fetch(
        `${config.API_URL}/api/items?q=${encodeURIComponent(q)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!result.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await result.json();
      const itemsValues = getValues("lineItems");
      setItems(
        data.filter(
          (item: Item) =>
            itemsValues.findIndex((i) => i.itemId === item.id) < 0,
        ),
      );
      return data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open, fetchItems]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-6">
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>Add a new order.</DialogDescription>
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

            {/* Priority */}
            <Field>
              <Label>Priority</Label>
              <Select
                defaultValue="low"
                onValueChange={(value) =>
                  setValue("priority", value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {orderPriorityEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </Field>

            {/* Pallets */}
            <Field>
              <Label>Pallets</Label>
              <Input
                type="number"
                {...register("pallets", { valueAsNumber: true })}
              />
              {errors.pallets && (
                <p className="text-sm text-red-500">{errors.pallets.message}</p>
              )}
            </Field>

            <Field>
              <Label>Line Items</Label>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-end border p-3 rounded-md"
                  >
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`lineItems.${index}.itemId`}
                        render={({ field }) => (
                          <ItemCombobox
                            items={items}
                            value={field.value}
                            onChange={field.onChange}
                            onSearch={fetchItems}
                            loading={loadingItems}
                          />
                        )}
                      />

                      {errors.lineItems?.[index]?.itemId && (
                        <p className="text-sm text-red-500">
                          {errors.lineItems[index]?.itemId?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Label>Units</Label>
                      <Input
                        type="number"
                        {...register(`lineItems.${index}.units`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.lineItems?.[index]?.units && (
                        <p className="text-sm text-red-500">
                          {errors.lineItems[index]?.units?.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>

              {typeof errors.lineItems?.message === "string" && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.lineItems.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => append({ itemId: items[0].id, units: 1 })}
              >
                + Add Line Item
              </Button>
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
              {isSubmitting ? "Saving..." : "Save Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

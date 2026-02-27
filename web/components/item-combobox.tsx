"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Item } from "@/models/item";

type ItemComboboxProps = {
  items: Item[];
  value?: number;
  onChange: (value: number) => void;
  onSearch?: (q: string) => void;
  loading?: boolean;
};

export function ItemCombobox({
  items,
  value,
  onChange,
  loading,
  onSearch,
}: ItemComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = items.find((i) => i.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selected ? `${selected.name} (${selected.sku})` : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={(value) => onSearch?.(value)}
            placeholder="Search by name or SKU..."
          />
          <CommandEmpty>No item found.</CommandEmpty>

          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.name} ${item.sku}`}
                onSelect={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.id ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.sku}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

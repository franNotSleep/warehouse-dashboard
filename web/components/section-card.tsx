import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type SectionCardProps = {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
};

export function SectionCard({ title, value, icon: Icon }: SectionCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <Icon />
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

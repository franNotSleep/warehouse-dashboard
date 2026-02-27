import { ColumnReceiving } from "./board-column-receiving";
import { ColumnPutaway } from "./board-column-putaway";
import { ColumnPicking } from "./board-column-picking";
import { ColumnAudit } from "./board-column-audit";
import { ColumnOutbound } from "./board-column-outbound";
import { BoardData } from "@/app/page";

export function Board({ boardData }: { boardData: BoardData }) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <div className="flex gap-4 p-6 min-w-max h-full">
        <ColumnReceiving shipments={boardData.receiving} />
        <div className="w-px bg-border shrink-0" />
        <ColumnPutaway
          orders={boardData.putAway.orders}
          warehouseCapacity={boardData.putAway.capacity}
          availableLocations={
            boardData.putAway.capacity - boardData.putAway.occupied
          }
          inProgressPallets={boardData.putAway.inProgress}
          pendingPallets={boardData.putAway.pending}
        />
        <div className="w-px bg-border shrink-0" />
        <ColumnPicking orders={boardData.picking} />
        <div className="w-px bg-border shrink-0" />
        <ColumnAudit
          orders={boardData.auditing.orders}
          passRate={boardData.auditing.passRate || 0}
          waiting={boardData.auditing.pending}
        />
        <div className="w-px bg-border shrink-0" />
        <ColumnOutbound outboundShipments={boardData.outbound} />
      </div>
    </div>
  );
}

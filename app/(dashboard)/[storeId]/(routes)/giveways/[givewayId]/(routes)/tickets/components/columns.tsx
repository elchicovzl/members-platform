"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type TicketColumn = {
  id: string;
  ticketNumber: string;
  transactionId?: string|null;
  status:string;
  user?:string|null;
}

export const columns: ColumnDef<TicketColumn>[] = [
  {
    accessorKey: "ticketNumber",
    header: "Numero de boleta",
  },
  {
    accessorKey: "transactionCode",
    header: "Transaccion n°",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "user",
    header: "Dueño",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
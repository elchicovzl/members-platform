"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type GivewayColumn = {
  id: string;
  name: string;
  giveawayDate: string;
  status:string;
}

export const columns: ColumnDef<GivewayColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "giveawayDate",
    header: "Fecha del sorteo",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { NumericFormat } from "react-number-format";

export type TransactionColumn = {
    id: string;
    code: string;
    imageSrc: string;
    isPaid: boolean;
    total: string;
    user: string|null;
}

export const columns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: "code",
    header: "Transacción n°",
  },
  {
    accessorKey: "total",
    header: "Total pagado",
    cell: ({row}) => <NumericFormat
        displayType="text"
        className="ml-auto"
        value={row.getValue("total")}
        prefix="$"
        thousandSeparator
        />
  },
  {
    accessorKey: "tickets",
    header: "Boletas",
  },
  {
    accessorKey: "isPaid",
    header: "Pagado",
  },
  {
    accessorKey: "user",
    header: "Usuario",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
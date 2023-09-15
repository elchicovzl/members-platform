"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Ticket, CreditCard } from "lucide-react";


import { columns, TransactionColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface TransactionClientProps {
  data: TransactionColumn[];
}

export const TransactionsClient: React.FC<TransactionClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex"> 
          <CreditCard className="mr-2 h-4 w-4 sm:h-8 sm:w-8" />
          <Heading title={`Transacciones (${data.length})`} description="Transacciones de compras de boletas realizadas en el sorteo." />
        </div>
      </div>
      <Separator />
      <DataTable searchKey="code" columns={columns} data={data} />
    </>
  );
};
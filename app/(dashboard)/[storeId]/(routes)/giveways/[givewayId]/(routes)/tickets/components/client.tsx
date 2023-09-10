"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Ticket } from "lucide-react";


import { columns, TicketColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface TicketClientProps {
  data: TicketColumn[];
}

export const TicketsClient: React.FC<TicketClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex"> 
          <Ticket className="mr-2 h-4 w-4 sm:h-8 sm:w-8" />
          <Heading title={`Tiquetes (${data.length})`} description="Tiquetes generados para el sorteo" />
        </div>
      </div>
      <Separator />
      <DataTable searchKey="ticketNumber" searchKey2="transactionId" columns={columns} data={data} />
    </>
  );
};
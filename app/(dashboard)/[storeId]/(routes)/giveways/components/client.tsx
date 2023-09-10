"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";


import { columns, GivewayColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface GivewayClientProps {
  data: GivewayColumn[];
}

export const GivewaysClient: React.FC<GivewayClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex"> 
          <Gift className="mr-2 h-4 w-4 sm:h-8 sm:w-8" />
          <Heading title={`Sorteos (${data.length})`} description="Administra los sorteos para tu sitio web" />
        </div>
        <Button onClick={() => router.push(`/${params.storeId}/giveways/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
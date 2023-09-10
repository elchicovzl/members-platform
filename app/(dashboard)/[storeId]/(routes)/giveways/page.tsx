import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { GivewaysClient } from "./components/client";
import { GivewayColumn } from "./components/columns";
import { es } from 'date-fns/locale';

const GivewaysPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const giveways = await prismadb.giveaway.findMany({
    where: {
      storeId: params.storeId,
      status:{
        notIn:["ELIMINADO"]
      }
    },
    orderBy: {
      giveawayDate: 'asc'
    }
  });

  const formattedGiveways: GivewayColumn[] = giveways.map((item) => ({
    id: item.id,
    name: item.name,
    giveawayDate: format(item.giveawayDate, 'MMMM dd, yyyy', {locale:es}),
    status:item.status
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GivewaysClient data={formattedGiveways} />
      </div>
    </div>
  );
}

export default GivewaysPage;
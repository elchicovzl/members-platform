import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { TicketsClient } from "./components/client";
import { TicketColumn } from "./components/columns";
import { es } from 'date-fns/locale';

const TicketsPage = async ({
  params
}: {
  params: { storeId: string, givewayId: string}
}) => {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const tickets = await prismadb.ticket.findMany({
    where: {
      storeId: params.storeId,
      giveawayId: params.givewayId
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const formattedTickets: TicketColumn[] = tickets.map((item) => ({
    id: item.id,
    ticketNumber:  item.ticketNumber,
    transactionCode: item.transactionCode,
    status: item.status,
    user: item.userId
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TicketsClient data={formattedTickets} />
      </div>
    </div>
  );
}

export default TicketsPage;
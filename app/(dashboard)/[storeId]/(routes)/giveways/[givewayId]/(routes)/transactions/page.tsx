import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { TransactionsClient } from "./components/client";
import { TransactionColumn } from "./components/columns";
import { NumericFormat } from "react-number-format"
import { es } from 'date-fns/locale';

const TransactionsPage = async ({
  params
}: {
  params: { storeId: string, givewayId: string}
}) => {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const transactions = await prismadb.transaction.findMany({
    where: {
      storeId: params.storeId,
      giveawayId: params.givewayId
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
        _count: {
            select: { tickets: true },
          },    
    },

  });

  const formattedTransactions: TransactionColumn[] = transactions.map((item) => ({
    id: item.id,
    code: item.code,
    imageSrc: item.imageSrc,
    isPaid: item.isPaid,
    total: item.total,
    user: item.userId,
    tickets: item._count.tickets
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TransactionsClient data={formattedTransactions} />
      </div>
    </div>
  );
}

export default TransactionsPage;
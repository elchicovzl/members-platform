import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }:{params:{ storeId:string, givewayId:string }}
  ) {
    try {
        const { userId } = auth();
        const body = await req.json();
  
        const {
            transactionId,
            qtyTickets,
            imageSrc,
            total,
            user
        } = body;
  
      /* if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      } */
  
        if (!transactionId) {
            return new NextResponse("Transaccion es requerida", { status: 400 });
        }

      /* if (!imageSrc) {
        return new NextResponse("Transaccion es requerida", { status: 400 });
      } */

        if (!params.givewayId) {
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("id del cliente es requerido", { status: 400 });
        }

        const ticketsCount = await prismadb.ticket.count({
            where:{
                storeId:params.storeId,
                giveawayId:params.givewayId,
                status:"DISPONIBLE",
            }
        });

        console.log("tickets count:", ticketsCount);

        const skip = Math.floor(Math.random() * ticketsCount);
        const randomTickets = await prismadb.ticket.findMany({
            where:{
                storeId:params.storeId,
                giveawayId:params.givewayId,
                status:"DISPONIBLE",
            },
            take:parseInt(qtyTickets),
            skip: skip,
        });

        console.log("tickets ramdoms")
        console.log(randomTickets)

        const transaction = await prismadb.transaction.create({
            data: {
                imageSrc:imageSrc,
                code:transactionId,
                total:total,
                isPaid:true,
                userId:user,
                storeId: params.storeId,
                giveawayId: params.givewayId
            }
        });

        console.log("transaccion...")
        console.log(transaction)

        for (const dataUpdate of randomTickets) {
            const updated = await prismadb.ticket.update({
                where: {
                    id: dataUpdate.id
                },
                data: {
                    status: "VENDIDO",
                    userId: user,
                    transactionId: transaction.id,

                }
            });
        }
    
        return NextResponse.json(transaction);
    } catch (error) {
      console.log(error);
      return new NextResponse("Internal error", { status: 500 });
    }
};
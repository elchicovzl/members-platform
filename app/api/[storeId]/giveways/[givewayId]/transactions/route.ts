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
            user,
            gatewayId,
            email,
            username,
            fullname
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

        if (gatewayId) {
            const transaction = await prismadb.transaction.findFirst({
                where: {
                    gatewayId: gatewayId
                },
                include: {
                    tickets: true
                }
            });

            if (transaction) {
                const updateTransaction = await prismadb.transaction.update({
                    where: {
                        storeId: params.storeId,
                        id: params.givewayId
                    },
                    data: {
                        isPaid: true,
                        gatewayId: gatewayId
                    }
                });

                for (const dataUpdateT of transaction.tickets) {
                    const updatedT = await prismadb.ticket.update({
                        where: {
                            id: dataUpdateT.id
                        },
                        data: {
                            status: "VENDIDO",
                        }
                    });
                }
            }

            return NextResponse.json(transaction);
        }

        const ticketsCount = await prismadb.ticket.count({
            where:{
                storeId:params.storeId,
                giveawayId:params.givewayId,
                status:"DISPONIBLE",
            }
        });

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

        const transaction = await prismadb.transaction.create({
            data: {
                imageSrc:imageSrc,
                code:transactionId,
                total:total,
                isPaid:false,
                userId:user,
                storeId: params.storeId,
                giveawayId: params.givewayId
            }
        });

        for (const dataUpdate of randomTickets) {
            const updated = await prismadb.ticket.update({
                where: {
                    id: dataUpdate.id
                },
                data: {
                    status: "REVISION",
                    userId: user,
                    transactionId: transaction.id,
                    transactionCode: transaction.code
                }
            });
        }
    
        return NextResponse.json(transaction);
    } catch (error) {
      console.log(error);
      return new NextResponse("Internal error", { status: 500 });
    }
};
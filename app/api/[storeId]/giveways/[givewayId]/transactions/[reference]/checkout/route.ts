import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }:{params:{ storeId:string, givewayId:string, reference:string }}
  ) {
    try {
        const body = await req.json();
  
        const {
            status,
            gatewayId,
            fullname,
            email
        } = body;
  
        if (!params.givewayId) {
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("id del cliente es requerido", { status: 400 });
        }

        if (!params.reference) {
            return new NextResponse("Referencia es requerida", { status: 400 });
        }

        const transaction = await prismadb.transaction.findFirst({
            where: {
                storeId: params.storeId,
                giveawayId: params.givewayId,
                code: params.reference
            },
            include: {
                tickets: true
            }
        });

        if (!transaction) {
            return new NextResponse("No se encontro transaccion", { status: 400 });
        }

        if (status == "APPROVED") {
            const updateTransaction = await prismadb.transaction.update({
                where: {
                    id: transaction.id
                },
                data: {
                    isPaid: true,
                    gatewayId,
                    fullname,
                    email
                }
            });

            for (const dataUpdateT of transaction.tickets) {
                const updatedT = await prismadb.ticket.update({
                    where: {
                        id: dataUpdateT.id
                    },
                    data: {
                        status: "VENDIDO"
                    }
                });
            }
        } else {
            for (const dataUpdateT of transaction.tickets) {
                const updatedT = await prismadb.ticket.update({
                    where: {
                        id: dataUpdateT.id
                    },
                    data: {
                        status: "DISPONIBLE",
                        userId: null,
                        transactionId: null,
                        transactionCode: null
                    }
                });
            }
        }
    
        return NextResponse.json({'success':true});
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
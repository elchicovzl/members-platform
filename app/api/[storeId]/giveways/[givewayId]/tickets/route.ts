import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(
    req: Request,
    {params}:{params:{ storeId:string, givewayId:string }}
  ) {
    try {
        if (!params.storeId) {
            return new NextResponse("id del cliente es requerido", { status: 400 });
        }

        if (!params.givewayId) {
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        const tickets = await prismadb.ticket.findMany({
            where: {
                storeId: params.storeId,
                giveawayId: params.givewayId,
                status: 'DISPONIBLE'
                            }
        });

        return NextResponse.json(tickets);
    } catch (error) {
      return new NextResponse("Internal error", { status: 500 });
    }
  };
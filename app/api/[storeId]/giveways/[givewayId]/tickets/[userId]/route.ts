import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { getRole, padWithLeadingZeros } from '@/lib/utils';

export async function GET(
    req: Request,
    {params}:{params:{ storeId:string, givewayId:string, userId:string }}
  ) {
    try {
        if (!params.storeId) {
            return new NextResponse("id del cliente es requerido", { status: 400 });
        }

        if (!params.givewayId) {
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        if (!params.userId) {
            return new NextResponse("id del usuario es requerido", { status: 400 });
        }

        const tickets = await prismadb.ticket.findMany({
            where: {
                storeId: params.storeId,
                giveawayId: params.givewayId,
                userId: params.userId,
                status: 'VENDIDO',
                transactionId: {
                    not: ""
                }
            }
        });
    
        return NextResponse.json(tickets);
    } catch (error) {
      return new NextResponse("Internal error", { status: 500 });
    }
  };
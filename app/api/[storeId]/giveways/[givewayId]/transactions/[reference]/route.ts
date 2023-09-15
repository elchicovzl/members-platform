import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(
    req: Request,
    {params}:{params:{ storeId:string, givewayId:string, reference:string }}
  ) {
    try {
        if (!params.storeId) {
            return new NextResponse("id del cliente es requerido", { status: 400 });
        }

        if (!params.givewayId) {
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        if (!params.reference) {
            return new NextResponse("referencia de la transaccion es requerido", { status: 400 });
        }

        const transacction = await prismadb.transaction.findFirst({
            where: {
                storeId: params.storeId,
                giveawayId: params.givewayId,
                code: params.reference
            },
            include: {
                tickets: true
            }
        });
    
        return NextResponse.json(transacction);
    } catch (error) {
      return new NextResponse("Internal error", { status: 500 });
    }
  };
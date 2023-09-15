import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(
    req: Request,
    {params}:{params:{ storeId:string }}
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("id del cliente es requerido", { status: 400 });
      }

      const givewayFeatured = await prismadb.giveaway.findFirst({
        where: {
          storeId:params.storeId,
          featured:true,
        },
        orderBy: {
            createdAt: 'desc'
        }
      });
    
      return NextResponse.json(givewayFeatured);
    } catch (error) {

      return new NextResponse("Internal error", { status: 500 });
    }
  };
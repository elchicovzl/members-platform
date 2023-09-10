import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { getRole, padWithLeadingZeros } from '@/lib/utils';

export async function POST(
    req: Request,
    {params}:{params:{ storeId:string }}
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
  
      const { 
        name,
        description,
        qtyTickets,
        imageSrc,
        giveawayDate,
        price
      } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!name) {
        return new NextResponse("Nombre es requerido", { status: 400 });
      }

      if (!qtyTickets) {
        return new NextResponse("Cantidad de tiquetes es requerido", { status: 400 });
      }

      if (!giveawayDate) {
        return new NextResponse("Fecha es requerido", { status: 400 });
      }

      if (!params.storeId) {
        return new NextResponse("id del cliente es requerido", { status: 400 });
      }
      var storeByUserId = {};
      const role = await getRole();

      if (role == "ADMIN" || role == "MODERATOR") {
        storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                profiles: {
                  some: {
                    userId: userId
                  }
                }
              }
          });
      }

      if (role == "SUPERADMIN") {
        storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
              }
          });
      }

      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }

      const giveway = await prismadb.giveaway.create({
        data: {
          name,
          description,
          qtyTickets,
          imageSrc,
          giveawayDate,
          status:"BORRADOR",
          storeId:params.storeId,
          price
        }
      });

      let leadingZeros = 1;
      switch (true) {
        case (parseInt(qtyTickets) < 10 ):
          leadingZeros = 1;
          break;
        case (parseInt(qtyTickets) >= 10 && parseInt(qtyTickets) <= 100):
          leadingZeros = 2;
          break;
        case (parseInt(qtyTickets) > 100 && parseInt(qtyTickets) <= 1000):
          leadingZeros = 3;
          break;
        case (parseInt(qtyTickets) > 1000 && parseInt(qtyTickets) <= 10000):
          leadingZeros = 4;
          break;
      }

      const datas = Array.from({length:parseInt(qtyTickets)}).map((x,i) => (
        {
          ticketNumber: padWithLeadingZeros(i, leadingZeros),
          giveawayId: giveway.id,
          storeId:params.storeId
        }
      ));

      await prismadb.ticket.createMany({
        data : datas
      });
    
      return NextResponse.json(giveway);
    } catch (error) {
        console.log('[CREATE_GIVEWAY]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  export async function GET(
    req: Request,
    {params}:{params:{ storeId:string }}
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("id del cliente es requerido", { status: 400 });
      }

      const giveways = await prismadb.giveaway.findMany({
        where: {
          storeId:params.storeId,
        }
      });
    
      return NextResponse.json(giveways);
    } catch (error) {

      return new NextResponse("Internal error", { status: 500 });
    }
  };
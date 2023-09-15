import prismadb from "@/lib/prismadb";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }:{params:{ storeId:string, givewayId:string }}
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
        status,
        price,
        featured,
      } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!name) {
        return new NextResponse("Nombre es requerido", { status: 400 });
      }

      if (!giveawayDate) {
        return new NextResponse("Fecha es requerido", { status: 400 });
      }

      if (!params.givewayId) { 
        return new NextResponse("id del sorteo es requerido", { status: 400 });
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

      const giveway = await prismadb.giveaway.updateMany({
        where:{
            id: params.givewayId    
        },
        data: {
          name,
          description,
          imageSrc,
          giveawayDate,
          status,
          price,
          featured
        }
      });
    
      return NextResponse.json(giveway);
    } catch (error) {
      console.log(error);
      return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }:{params:{ storeId:string, givewayId:string }}
  ) {
    try {
    
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.givewayId) { 
            return new NextResponse("id del sorteo es requerido", { status: 400 });
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

        const giveway = await prismadb.giveaway.updateMany({
            where: {
                storeId: params.storeId,
                id: params.givewayId
            },
            data: {
              status:"ELIMINADO"
            }
        });

        return NextResponse.json(giveway);
    } catch (error) {
      console.log(error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }:{params:{ storeId:string, givewayId:string }}
  ) {
    try {
        if (!params.givewayId) { 
            return new NextResponse("id del sorteo es requerido", { status: 400 });
        }

        const giveway = await prismadb.giveaway.findUnique({
            where: {
                id: params.givewayId
            }
        });

        return NextResponse.json(giveway);
    }
    catch(error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}
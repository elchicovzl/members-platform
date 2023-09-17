import { NextResponse } from 'next/server';
import { auth, useSignUp, useAuth } from '@clerk/nextjs';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import axios from "axios"

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
  
      const { fullname, email, role } = body;


  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      if (!fullname) {
        return new NextResponse("Nombre es requerido", { status: 400 });
      }
      const password = "Qwerty.19131834";
      const user = await clerkClient.users.createUser(
        {
          emailAddress: [email],
          password: password,
          firstName: fullname,
          lastName: "comp",
          unsafeMetadata: {
            role: role,
          }
        }
      )

      /* const store = await prismadb.profile.create({
        data: {
          name:fullname,
          email,
          role,
          userId,
          storeId:'asdsa' 
        }
      }); */
    
      return NextResponse.json("good");
    } catch (error) {
      return new NextResponse("Internal error", { status: 500 });
    }
};
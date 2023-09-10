import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { currentUser } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getRole() {
  const { unsafeMetadata } = await currentUser();

  return unsafeMetadata.role;
}

export async function getStore(storeId = null) {
  const { unsafeMetadata, id } = await currentUser();

  var store = {};

  if (unsafeMetadata.role == "MODERATOR") {
    if (storeId) {
      store = await prismadb.store.findFirst({
        where: {
          id: storeId,
          profiles: {
            some: {
              userId: id
            }
          }
        }
      });
    } else {
      store = await prismadb.store.findFirst({
        where: {
          profiles: {
            some: {
              userId: id
            }
          }
        }
      });
    }
  }

  if (unsafeMetadata.role == "SUPERADMIN") {
    if (storeId) {
      store = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId:id
        }
      });
    } else {
      store = await prismadb.store.findFirst({
        where: {
          userId:id
        }
      });
    }
  }

    return store;
}

export function padWithLeadingZeros(num:number, totalLength:number) {
  return String(num).padStart(totalLength, '0');
}

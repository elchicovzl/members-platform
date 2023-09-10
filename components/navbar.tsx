import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";
import { getRole, getStore } from "@/lib/utils";
import { Heading } from "./ui/heading";
import { Label } from "./ui/label";
import { UserSquare } from "lucide-react";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const role = await getRole();
  let stores = [];

  if (role == "SUPERADMIN") {
    stores = await prismadb.store.findMany({
      where: {
        userId,
      }
    });
  }

  const store = await getStore();

  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
      {role == "SUPERADMIN" ?
        <StoreSwitcher items={stores} /> : <><UserSquare className="mr-2 h-4 w-4" /> <Label className="text-sm">{store.name}</Label></>
      }
        <MainNav className="mx-6" role={role} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
 
export default Navbar;
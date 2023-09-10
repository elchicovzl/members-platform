import prismadb from "@/lib/prismadb";

import { GivewaysForm } from "./components/giveways-form";

const GivewayPage = async ({ 
    params
  }: {
    params: { givewayId: string }
  }) => {
    const giveway = await prismadb.giveaway.findUnique({
      where: {
        id: params.givewayId
      }
    });
  
    return ( 
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <GivewaysForm initialData={giveway} />
        </div>
      </div>
    );
  }
 
export default GivewayPage;
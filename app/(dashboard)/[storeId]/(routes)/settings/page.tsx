import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { SettingsForm } from "./components/settings-form";
import { getRole, getStore } from "@/lib/utils";

const SettingsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const role = await getRole();

  if (role != "ADMIN" && role != "SUPERADMIN") {
    redirect('/');
  }

  const store = await getStore(params.storeId);

  if (!store) {
    redirect('/');
  };

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}

export default SettingsPage;
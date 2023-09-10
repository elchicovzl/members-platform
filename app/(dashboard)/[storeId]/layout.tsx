import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';
import { getStore } from '@/lib/utils';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await getStore(params.storeId);

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
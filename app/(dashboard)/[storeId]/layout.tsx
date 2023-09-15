import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';
import { getStore } from '@/lib/utils';
import NextBreadcrumb from '@/components/next-breadcrumb';

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
      <NextBreadcrumb
        homeElement={'Resumen'}
        separator={<span> | </span>}
        activeClasses='text-amber-500'
        containerClasses='flex py-5 bg-gradient-to-r from-purple-600 to-blue-600' 
        listClasses='hover:underline mx-2 font-bold'
        capitalizeLinks
      />
      {children}
    </>
  );
};
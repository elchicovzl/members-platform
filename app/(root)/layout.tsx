import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import { getStore } from '@/lib/utils';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await getStore();

  if (store) {
    redirect(`/${store.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};
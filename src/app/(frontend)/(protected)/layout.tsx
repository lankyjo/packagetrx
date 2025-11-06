import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    // Redirect to homepage if user isn't logged in
    redirect('/');
  }

  return children
};

export default ProtectedLayout;

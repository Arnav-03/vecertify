"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';


export default function Dashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[100dvh] p-6 space-y-6 mt-[75px]">
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[100dvh] p-6 mt-[75px] p-4">

        <div className="mb-8 bg-primary p-4 shadow-custom flex items-start justify-between rounded-lg ">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row  font-bold text-gray-800 dark:text-white text-xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              <div className="mr-2">Welcome,
              </div>
              <div className="">
                {user?.name}!</div>
            </div>
            <p className="text-primary-foreground/80 text-sm lg:text-lg flex gap-2 items-center mt-2">
              <Mail className="h-6 w-6" /> {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold text-lg lg:text-3xl">
            <GraduationCap className='h-10 w-10 lg:h-16 lg:w-16 text-yellow-500' />
            Student</div>
        </div>
      </div>
    </Layout>
  );
}
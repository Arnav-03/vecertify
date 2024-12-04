"use client"
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Mail, Users, Building2, Award, ChartBar, CirclePlus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function EmployerDashboard() {
  const { user, loading } = useUser();
  const navigate=useRouter();
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

  const stats = [
    {
      title: "Active Job Listings",
      value: "12",
      icon: <Building2 className="h-6 w-6 text-blue-500" />,
      change: "+2",
      changeType: "positive"
    },
    {
      title: "Total Applications",
      value: "143",
      icon: <Users className="h-6 w-6 text-green-500" />,
      change: "+22.5%",
      changeType: "positive"
    },
    {
      title: "Hired This Month",
      value: "8",
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      change: "+3",
      changeType: "positive"
    }
  ];

  const recentApplicants = [
    { name: "Alice Johnson", position: "Software Engineer", status: "New" },
    { name: "Bob Smith", position: "Product Manager", status: "Interviewed" },
    { name: "Carol White", position: "UX Designer", status: "Reviewing" }
  ];

  return (
    <Layout>
      <div className="min-h-[100dvh] p-6 mt-[75px]">
        <div className="mb-8 bg-primary p-6 flex items-start justify-between rounded-lg">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row font-bold text-xl lg:text-3xl text-primary-foreground">
              <div className="mr-2">Welcome,</div>
              <div>{user?.name}!</div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <p className="text-primary-foreground/80 text-sm lg:text-lg flex gap-2 items-center">
                <Mail className="h-6 w-6" /> {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground font-bold text-lg lg:text-3xl">
            <Briefcase className="h-10 w-10 lg:h-16 lg:w-16 text-orange-300" />
            Employer
          </div>
        </div>

        <div className="w-full flex justify-end my-8">
          <div onClick={()=>navigate.push('/verify-document')} className="bg-primary/50 px-4 py-3 text-xl rounded-md flex gap-2 items-center hover:bg-primary/30 cursor-pointer  ">
          <CirclePlus className='h-8 w-8' />Verify Document</div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                } flex items-center`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplicants.map((applicant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">{applicant.position}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      applicant.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      applicant.status === 'Interviewed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {applicant.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Post New Job
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  View Applicants
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  Analytics
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  Manage Listings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
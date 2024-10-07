"use client"
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Mail, Users, FileText, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';

export default function AuthorityDashboard() {
  const { user, loading } = useUser();

  if (loading) {
    return (
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
    
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: "+5.2%",
      changeType: "positive"
    },
    {
      title: "Pending Approvals",
      value: "42",
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      change: "-12.5%",
      changeType: "positive"
    },
    {
      title: "Documents Reviewed",
      value: "891",
      icon: <FileText className="h-6 w-6 text-green-500" />,
      change: "+10.3%",
      changeType: "positive"
    }
  ];

  return (
      <div className="min-h-[100dvh] p-6 mt-[75px]">
        <div className="mb-8 bg-primary p-6 flex items-start justify-between rounded-lg">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row font-bold text-xl lg:text-3xl text-primary-foreground">
              <div className="mr-2">Welcome,</div>
              <div>{user?.name}!</div>
            </div>
            <p className="text-primary-foreground/80 text-sm lg:text-lg flex gap-2 items-center mt-2">
              <Mail className="h-6 w-6" /> {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground font-bold text-lg lg:text-3xl">
            <Building2 className="h-10 w-10 lg:h-16 lg:w-16 text-yellow-500" />
            Authority
          </div>
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Student application reviewed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
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
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80">
                  Review Applications
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80">
                  Generate Reports
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80">
                  Manage Users
                </button>
                <button className="p-4 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80">
                  System Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

  );
}
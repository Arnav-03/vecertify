"use client"
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Mail, Activity, XCircle, CheckCircle, Plus, Filter, MoreHorizontal, Clock } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  return (
    <div className="min-h-[100dvh] p-6 mt-[75px]">
      <div className="mb-8 bg-primary p-4 py-6 flex items-start justify-between rounded-lg">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row font-bold text-xl lg:text-3xl text-primary-foreground">
            <div className="mr-2">Welcome,</div>
            <div className="">{user?.name}</div>
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-primary-foreground/80 text-sm lg:text-lg flex gap-2 items-center">
              <Mail className="h-5 w-5" /> {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary-foreground font-bold text-lg lg:text-3xl">
          <Building2 className='h-10 w-10 lg:h-16 lg:w-16 text-yellow-500' />
          Authority
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Statistics Cards */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Lifetime certificates issued
            </p>
          </CardContent>
        </Card>
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Certificates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Awaiting final approval
            </p>
          </CardContent>
        </Card>
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Certificates</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              Successfully verified by third parties
            </p>
          </CardContent>
        </Card>

        {/* Issue Certificate Card and Recent Activities - Same Line */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader>
            <CardTitle>Issue New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Create and issue new certificates to students or professionals.</p>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Issue Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-custom bg-accent" >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activities</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Certificate Issued", details: "BSc Computer Science - John Doe", time: "2 hours ago" },
                { action: "Certificate Verified", details: "By TechCorp Inc.", time: "5 hours ago" },
                { action: "Certificate Revoked", details: "MBA Business - Sarah Smith", time: "1 day ago" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Certificates Card */}
        <Card className="md:col-span-2 shadow-custom bg-accent">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>View Issued Certificates</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search certificates..." className="flex-1" />
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { name: "John Doe", cert: "BSc Computer Science", date: "2024-03-15" },
                  { name: "Jane Smith", cert: "MBA Business", date: "2024-03-14" },
                ].map((cert, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.cert}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{cert.date}</span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revoke Certificate Card */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader>
            <CardTitle>Revoke Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Revoke certificates that were issued in error or need cancellation.</p>
              <Button variant="destructive" className="w-full">
                <XCircle className="mr-2 h-4 w-4" /> Revoke Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
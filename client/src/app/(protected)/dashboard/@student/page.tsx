"use client"
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, Mail, Award, Search, BookOpen, Clock, Download, MoreHorizontal, ExternalLink } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

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
          <GraduationCap className='h-10 w-10 lg:h-16 lg:w-16 text-yellow-500' />
          Student
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Statistics Cards */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Earned Certificates</CardTitle>
            <Award className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Certificates earned so far
            </p>
          </CardContent>
        </Card>
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Courses</CardTitle>
            <BookOpen className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled courses
            </p>
          </CardContent>
        </Card>
        <Card className='shadow-custom bg-accent'>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Certificates</CardTitle>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Certificates awaiting issuance
            </p>
          </CardContent>
        </Card>

        {/* Recent Certificates Card */}
        <Card className="md:col-span-2 shadow-custom bg-accent">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Certificates</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { course: "Introduction to Web Development", issuer: "TechEd Institute", date: "2024-03-15" },
                { course: "Data Structures and Algorithms", issuer: "CodeMaster Academy", date: "2024-02-28" },
              ].map((cert, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                  <div>
                    <p className="font-medium">{cert.course}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{cert.date}</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verify Certificate Card */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader>
            <CardTitle>Verify Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Verify the authenticity of your certificates or share them with employers.</p>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" /> Verify Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses Card */}
        <Card className="md:col-span-2 shadow-custom bg-accent">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Enrolled Courses</CardTitle>
              <Button variant="outline" size="sm">Browse Courses</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Advanced JavaScript", progress: 75, institution: "Web Dev Academy" },
                { name: "Machine Learning Basics", progress: 45, institution: "AI Learning Center" },
              ].map((course, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.institution}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{course.progress}% complete</div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Showcase Card */}
        <Card className='shadow-custom bg-accent'>
          <CardHeader>
            <CardTitle>Achievement Showcase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Display your achievements and certificates on your public profile.</p>
              <Button variant="outline" className="w-full">
                Manage Showcase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
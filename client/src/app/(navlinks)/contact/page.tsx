import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

export default function ContactPage() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 mt-[75px]">
                <h1 className="text-4xl font-bold text-center mb-2">Contact Me</h1>

                <div className="grid md:grid-cols-2 gap-8 ">
                    {/* Contact Form */}
                    <Card className="p-6 shadow-custom">
                        <h2 className="text-2xl font-semibold mb-4">Send me a message</h2>
                        <form className="space-y-4 ">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <Input id="name" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="email">
                                    Email
                                </label>
                                <Input id="email" type="email" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="message">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here."
                                    className="min-h-[150px]"
                                />
                            </div>
                            <Button className="w-full">Send Message</Button>
                        </form>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <div className="shadow-custom">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Let&apos;s Connect</h2>
                                    <div className="space-y-4">
                                        {/* Email */}
                                        <a href="mailto:arnavarora0003@gmail.com"
                                            className="flex items-center space-x-3 p-2 hover:bg-primary rounded-lg transition-colors">
                                            <Mail className="w-5 h-5" />
                                            <div>
                                                <h3 className="font-medium">Email</h3>
                                            </div>
                                        </a>

                                        {/* GitHub */}
                                        <a href="https://github.com/Arnav-03"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-2 hover:bg-primary rounded-lg transition-colors">
                                            <Github className="w-5 h-5" />
                                            <div>
                                                <h3 className="font-medium">GitHub</h3>
                                            </div>
                                        </a>

                                        {/* LinkedIn */}
                                        <a href="https://www.linkedin.com/in/arnavarora3/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-2 hover:bg-primary rounded-lg transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                            <div>
                                                <h3 className="font-medium">LinkedIn</h3>
                                            </div>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    );
}
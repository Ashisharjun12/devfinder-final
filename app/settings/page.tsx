'use client';

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
 

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-primary/10 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
          
          {/* Coming Soon Content */}
          <div className="bg-secondary/30 rounded-xl p-8 border border-primary/10 text-center">
            <Settings className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Coming Soon!</h2>
            <p className="text-muted-foreground mb-6">
              We're working on bringing you powerful settings and customization options. Check back soon!
            </p>
            <Button asChild>
              <Link href="/">
                Return to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

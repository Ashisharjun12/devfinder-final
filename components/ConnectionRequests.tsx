'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";
import { Check, X, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "./ui/use-toast";

interface ConnectionRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
}

interface ConnectionRequestsProps {
  projectId: string;
}

export function ConnectionRequests({ projectId }: ConnectionRequestsProps) {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/connect`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const handleRequest = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/connect`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        toast({
          title: action === 'ACCEPT' ? "Request Accepted" : "Request Rejected",
          description: action === 'ACCEPT' 
            ? "The developer has been added to your project." 
            : "The connection request has been rejected.",
        });
        fetchRequests(); // Refresh the requests list
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to handle request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'PENDING');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connection Requests</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground">No connection requests yet</p>
          ) : (
            requests.map((request) => (
              <div 
                key={request._id}
                className="flex flex-col gap-4 p-4 rounded-lg bg-secondary/50 border border-primary/10"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.user.image} alt={request.user.name} />
                    <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{request.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{request.user.email}</p>
                  </div>
                  <Badge
                    variant={
                      request.status === 'PENDING' 
                        ? 'outline'
                        : request.status === 'ACCEPTED'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
                {request.message && (
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                    {request.message}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Requested {formatDate(request.createdAt)}</span>
                  {request.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary-hover"
                        onClick={() => handleRequest(request._id, 'ACCEPT')}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleRequest(request._id, 'REJECT')}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

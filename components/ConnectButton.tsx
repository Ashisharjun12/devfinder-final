'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Users, Loader2, Check } from 'lucide-react';
import { useToast } from './ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from './ui/textarea';

interface ConnectButtonProps {
  projectId: string;
}

type ConnectionStatus = 'NOT_REQUESTED' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'MEMBER';

export function ConnectButton({ projectId }: ConnectButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus>('NOT_REQUESTED');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectionStatus();
  }, [projectId]);

  const fetchConnectionStatus = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/connect`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        throw new Error('Failed to fetch status');
      }
    } catch (error) {
      console.error('Failed to get connection status:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim() || 'I would like to join this project.',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('PENDING');
        toast({
          title: "Success!",
          description: data.message || "Your request has been sent successfully.",
        });
        setOpen(false);
      } else {
        throw new Error(data.error || 'Failed to send request');
      }
    } catch (error: any) {
      console.error('Connection request error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'MEMBER' || status === 'ACCEPTED') {
    return (
      <Button 
        variant="outline" 
        className="w-full bg-primary/10 text-primary hover:bg-primary/20"
        disabled
      >
        <Check className="h-4 w-4 mr-2" />
        Connected
      </Button>
    );
  }

  if (status === 'PENDING') {
    return (
      <Button 
        variant="outline" 
        className="w-full"
        disabled
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Request Pending
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full"
          disabled={isLoading}
        >
          <Users className="h-4 w-4 mr-2" />
          Connect with Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Project</DialogTitle>
          <DialogDescription>
            Send a message to the project owner explaining why you'd like to join.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="I'm interested in joining this project because..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

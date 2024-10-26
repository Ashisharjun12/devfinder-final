'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import { useToast } from './ui/use-toast';
import { Bell } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface Notification {
  id: string;
  type: 'CONNECTION_REQUEST';
  userId: string;
  projectId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
}

export function ProjectNotifications({ projectId }: { projectId: string }) {
  const { socket } = useSocket();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-project', projectId);

      socket.on('new-connection-request', (data) => {
        toast({
          title: 'New Connection Request',
          description: 'Someone wants to join your project!',
        });
        // Fetch updated notifications
        fetchNotifications();
      });

      // Fetch initial notifications
      fetchNotifications();
    }
  }, [socket, projectId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleResponse = async (notificationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        socket?.emit('request-response', {
          projectId,
          notificationId,
          status,
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
  };

  const pendingNotifications = notifications.filter(n => n.status === 'PENDING');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingNotifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {pendingNotifications.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connection Requests</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
              >
                <Avatar>
                  <AvatarImage src={notification.user.image} />
                  <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{notification.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Wants to join your project
                  </p>
                </div>
                {notification.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResponse(notification.id, 'ACCEPTED')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResponse(notification.id, 'REJECTED')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

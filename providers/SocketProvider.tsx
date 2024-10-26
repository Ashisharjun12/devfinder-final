'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const socketInstance = io({
        path: '/api/socketio',
      });

      socketInstance.on('connect', () => {
        console.log('Connected to Socket.IO');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from Socket.IO');
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

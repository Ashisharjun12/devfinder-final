import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socketio',
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('connection-request', ({ projectId, userId }) => {
      io.to(`project:${projectId}`).emit('new-connection-request', {
        projectId,
        userId,
      });
    });

    socket.on('request-response', ({ projectId, userId, status }) => {
      io.to(`project:${projectId}`).emit('connection-response', {
        projectId,
        userId,
        status,
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

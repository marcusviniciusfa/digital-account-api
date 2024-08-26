import { routes } from '@src/infra/http/routes';
import express from 'express';
import { prismaClient } from './infra/database/prisma-client';

const { SERVER_PORT = 3000, API_MAJOR_VERSION = 1 } = process.env;

const server = express();

server.use(express.json());
server.use(`/api/v${API_MAJOR_VERSION}`, routes);

async function startServer() {
  await prismaClient.$connect();
  server.listen(SERVER_PORT);
}

startServer()
  .then(() => {
    console.info(`server is running on port ${SERVER_PORT}`);
  })
  .catch(error => {
    console.error(error);
  });

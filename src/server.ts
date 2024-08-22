import { routes } from '@src/routes';
import express from 'express';

const { SERVER_PORT = 3000, API_MAJOR_VERSION = 1 } = process.env;

const server = express();

server.use(express.json());
server.use(`/api/v${API_MAJOR_VERSION}`, routes);

server.listen(SERVER_PORT, () => {
  console.info(`server is running on port ${SERVER_PORT}`);
});

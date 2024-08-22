import { Request, Response, Router } from 'express';

const routes = Router();

routes.get('/', (_req: Request, res: Response) => {
  res.send();
});

export { routes };

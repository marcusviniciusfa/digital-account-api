import { Request, Response, Router } from 'express';
import { accountHoldersRoutes } from './account-holders-routes';
import { digitalAccountsRoutes } from './digital-accounts-routes';

const routes = Router();

routes.get('/', (_req: Request, res: Response) => {
  res.send();
});

routes.use('/', accountHoldersRoutes, digitalAccountsRoutes);

export { routes };

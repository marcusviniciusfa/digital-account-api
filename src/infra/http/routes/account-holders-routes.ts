import {
  CreateAccountHolderInputDTO,
  CreateAccountHolderUseCase,
  DeleteAccountHolderUseCase,
  GetAccountHolderUseCase,
  UpdateAccountHolderInputDTO,
  UpdateAccountHolderUseCase,
} from '@src/application/use-cases/account-holder';
import { GetDigitalAccountsByHolderUseCase } from '@src/application/use-cases/digital-account';
import { AccountHolderRepositoryPrisma, DigitalAccountRepositoryPrisma } from '@src/infra/database/repositories';
import { Request, Response, Router } from 'express';

const accountHoldersRoutes = Router();
const accountHolderRepositoryPrisma = new AccountHolderRepositoryPrisma();
const digitalAccountRepositoryPrisma = new DigitalAccountRepositoryPrisma();

accountHoldersRoutes.post('/account-holders', async (req: Request, res: Response) => {
  const createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepositoryPrisma);
  try {
    const output = await createAccountHolderUseCase.execute(req.body as CreateAccountHolderInputDTO);
    res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

accountHoldersRoutes.get('/account-holders/:id', async (req: Request, res: Response) => {
  const getAccountHolderUseCase = new GetAccountHolderUseCase(accountHolderRepositoryPrisma);
  try {
    const output = await getAccountHolderUseCase.execute({ id: req.params.id });
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

accountHoldersRoutes.get('/account-holders/:id/digital-accounts', async (req: Request, res: Response) => {
  const getDigitalAccountsByHolder = new GetDigitalAccountsByHolderUseCase(digitalAccountRepositoryPrisma);
  try {
    const output = await getDigitalAccountsByHolder.execute({ holderId: req.params.id });
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

accountHoldersRoutes.delete('/account-holders/:id', async (req: Request, res: Response) => {
  const deleteAccountHolderUseCase = new DeleteAccountHolderUseCase(accountHolderRepositoryPrisma);
  try {
    await deleteAccountHolderUseCase.execute({ id: req.params.id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

accountHoldersRoutes.patch('/account-holders/:id', async (req: Request, res: Response) => {
  const updateAccountHolderUseCase = new UpdateAccountHolderUseCase(accountHolderRepositoryPrisma);
  const input = { id: req.params.id, ...req.body } as UpdateAccountHolderInputDTO;
  try {
    await updateAccountHolderUseCase.execute(input);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export { accountHoldersRoutes };

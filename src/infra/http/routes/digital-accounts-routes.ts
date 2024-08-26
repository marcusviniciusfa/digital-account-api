import {
  BlockDigitalAccountUseCase,
  CreateDigitalAccountInputDTO,
  CreateDigitalAccountUseCase,
  DeactivateDigitalAccountUseCase,
  DepositMoneyIntoDigitalAccountInputDTO,
  DepositMoneyIntoDigitalAccountUseCase,
  GetDigitalAccountStatementInputDTO,
  GetDigitalAccountStatementUseCase,
  GetDigitalAccountUseCase,
  UnblockDigitalAccountUseCase,
  WithdrawMoneyFromDigitalAccountInputDTO,
  WithdrawMoneyFromDigitalAccountUseCase,
} from '@src/application/use-cases/digital-account';
import { DateHelper } from '@src/helpers';
import {
  AccountHolderRepositoryPrisma,
  DigitalAccountRepositoryPrisma,
  StatementRepositoryPrisma,
} from '@src/infra/database/repositories';
import { Request, Response, Router } from 'express';

const digitalAccountsRoutes = Router();
const accountHolderRepositoryPrisma = new AccountHolderRepositoryPrisma();
const digitalAccountRepositoryPrisma = new DigitalAccountRepositoryPrisma();
const statementRepositoryPrisma = new StatementRepositoryPrisma();

digitalAccountsRoutes.post('/digital-accounts', async (req: Request, res: Response) => {
  const createDigitalAccountUseCase = new CreateDigitalAccountUseCase(
    accountHolderRepositoryPrisma,
    digitalAccountRepositoryPrisma,
  );
  try {
    const output = await createDigitalAccountUseCase.execute(req.body as CreateDigitalAccountInputDTO);
    res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.get('/digital-accounts/:id', async (req: Request, res: Response) => {
  const getDigitalAccountUseCase = new GetDigitalAccountUseCase(digitalAccountRepositoryPrisma);
  try {
    const output = await getDigitalAccountUseCase.execute({ digitalAccountId: req.params.id });
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.get('/digital-accounts/:id/operations', async (req: Request, res: Response) => {
  const getDigitalAccountStatementUseCase = new GetDigitalAccountStatementUseCase(
    digitalAccountRepositoryPrisma,
    statementRepositoryPrisma,
  );
  const { start_date: startDate, end_date: endDate } = req.query as { start_date: string; end_date: string };
  const input: GetDigitalAccountStatementInputDTO = {
    digitalAccountId: req.params.id,
    startDate: startDate ? DateHelper.startOfDayUTC(new Date(startDate)) : DateHelper.startOfDayUTC(),
    endDate: endDate ? DateHelper.endOfDayUTC(new Date(endDate)) : DateHelper.endOfDayUTC(),
    order: req.query.order,
  } as GetDigitalAccountStatementInputDTO;
  try {
    const output = await getDigitalAccountStatementUseCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.delete('/digital-accounts/:id', async (req: Request, res: Response) => {
  const deactivateDigitalAccountUseCase = new DeactivateDigitalAccountUseCase(digitalAccountRepositoryPrisma);
  try {
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: req.params.id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.post('/digital-accounts/:id/block', async (req: Request, res: Response) => {
  const blockDigitalAccountUseCase = new BlockDigitalAccountUseCase(digitalAccountRepositoryPrisma);
  try {
    await blockDigitalAccountUseCase.execute({ digitalAccountId: req.params.id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.post('/digital-accounts/:id/unlock', async (req: Request, res: Response) => {
  const unblockDigitalAccountUseCase = new UnblockDigitalAccountUseCase(digitalAccountRepositoryPrisma);
  try {
    await unblockDigitalAccountUseCase.execute({ digitalAccountId: req.params.id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.post('/digital-accounts/:id/deposit', async (req: Request, res: Response) => {
  const depositMoneyIntoDigitalAccountUseCase = new DepositMoneyIntoDigitalAccountUseCase(
    digitalAccountRepositoryPrisma,
    statementRepositoryPrisma,
  );
  const input = { digitalAccountId: req.params.id, ...req.body } as DepositMoneyIntoDigitalAccountInputDTO;
  try {
    const output = await depositMoneyIntoDigitalAccountUseCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

digitalAccountsRoutes.post('/digital-accounts/:id/withdraw', async (req: Request, res: Response) => {
  const withdrawMoneyFromDigitalAccountUseCase = new WithdrawMoneyFromDigitalAccountUseCase(
    digitalAccountRepositoryPrisma,
    statementRepositoryPrisma,
  );
  const input = { digitalAccountId: req.params.id, ...req.body } as WithdrawMoneyFromDigitalAccountInputDTO;
  try {
    const output = await withdrawMoneyFromDigitalAccountUseCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export { digitalAccountsRoutes };

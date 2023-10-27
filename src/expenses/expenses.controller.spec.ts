import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Model } from 'mongoose';
import { ExpenseList, Expenses } from './schemas/expenses.schema';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;
  let model: Model<Expenses>;
  const mockExpenses = {
    _id: '653a6f75fa61e9c4890d44d2',
    expenseList: ExpenseList.INCOME,
    description: 'ขอแม่มา',
    date: '2023-10-26T00:00:00.000Z',
    price: 100,
    createdAt: '2023-10-26T13:53:57.924Z',
    updatedAt: '2023-10-26T13:53:57.924Z',
    __v: 0,
  };
  const mockExpensesService = { create: jest.fn(), findAll: jest.fn().mockResolvedValueOnce([mockExpenses]) };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ExpensesService, useValue: mockExpensesService }],
      controllers: [ExpensesController],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllExpensess', () => {
    it('should find and return list expenses', async () => {
      let result: Promise<Expenses[]>;
      jest.spyOn(controller, 'getAllExpensess').mockImplementation(() => result);

      expect(await controller.getAllExpensess()).toBe(result);
    });
  });
  describe('cal', () => {
    it('should return cal Income minus Expenses', async () => {
      jest.spyOn(controller, 'remainingExpenses').mockImplementation();

      expect(await controller.remainingExpenses());
    });
  });
  describe('summary', () => {
    it('should return cal Income minus Expenses', async () => {
      jest.spyOn(controller, 'getSummaryExpensess').mockImplementation();

      expect(await controller.getSummaryExpensess());
    });
  });
});

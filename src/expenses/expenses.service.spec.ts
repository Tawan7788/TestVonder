import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { Model } from 'mongoose';
import { ExpenseList, Expenses } from './schemas/expenses.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateExpensesDto } from './dto/create-expenses-dto';

describe('ExpensesService', () => {
  let expensesService: ExpensesService;
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
  const mockTest = {
    expenseList: ExpenseList.INCOME,
    description: 'string',
    date: '2023-10-26',
    price: 200,
  };

  const mockList = {
    expenseList: ExpenseList.INCOME,
    description: 'string',
    date: 'Date',
    price: 100,
  };
  const mockExpensesService = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expenses.name),
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    expensesService = module.get<ExpensesService>(ExpensesService);
    model = module.get<Model<Expenses>>(getModelToken(Expenses.name));
  });

  describe('findAll', () => {
    it('should find and return list expenses', async () => {
      let result: Promise<Expenses[]>;
      jest.spyOn(expensesService, 'findAll').mockImplementation(() => result);

      expect(await expensesService.findAll()).toBe(result);
    });
  });
  describe('summary', () => {
    it('should return Income and Expenses', async () => {
      let result: Promise<{ รายรับ: number[]; รายจ่าย: number[] }>;
      jest.spyOn(expensesService, 'summary').mockImplementation(() => result);

      expect(await expensesService.summary()).toBe(result);
    });
  });
  describe('remaining', () => {
    it('should return remaining balance', async () => {
      let result: Promise<string>;
      jest.spyOn(expensesService, 'remaining').mockImplementation(() => result);

      expect(await expensesService.remaining()).toBe(result);
    });
  });
  // describe('create', () => {
  //   it('should create and return a list expenses', async () => {
  //     const newList = {
  //       expenseList: ExpenseList.INCOME,
  //       description: 'string',
  //       date: '2023-10-26',
  //       price: 100,
  //     };
  //     const expectResult = {
  //       expenseList: ExpenseList.INCOME,
  //       description: 'ขอแม่มา',
  //       date: '2023-10-26T00:00:00.000Z',
  //       price: 100,
       
  //     };
  //     jest
  //       .spyOn(model, 'create')
  //       .mockImplementationOnce(() => Promise.resolve(expectResult));
  //     const result = await expensesService.create();
  //   });
  // });
  // describe('deleteById', () => {
  //   it('should return delete By Id ', async () => {
  //     jest.spyOn(expensesService, 'deleteById').mockResolvedValue(mockExpenses._id);
  //     const result =await expensesService.deleteById(mockExpenses._id)
  //     expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockExpenses._id);
  //     expect(result).toEqual(mockExpenses)
  //   });
  // });
});

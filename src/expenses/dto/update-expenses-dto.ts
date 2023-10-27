import { ExpenseList } from "../schemas/expenses.schema";


export class UpdateExpensesDto {
  readonly expenseList: ExpenseList;
  readonly description: string;
  readonly date: String;
  readonly price: number;

}
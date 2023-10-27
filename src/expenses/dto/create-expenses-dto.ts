import { ApiProperty } from "@nestjs/swagger";
import { ExpenseList } from "../schemas/expenses.schema";

export class CreateExpensesDto {
  @ApiProperty({
    type: String,
    description: 'เลือกประเภท "Income" กับ "Pay"',
  })
  readonly expenseList: ExpenseList;
  @ApiProperty({
    type: String,
    description: 'เขียนคำอธิบายได้เงินหรือใช่จ่ายไปกับอะไร',
  })
  readonly description: string;
  @ApiProperty({
    type: Date,
    description: 'เขียนวันตาม Date Format เช่น 2023-10-26',
  })
  readonly date: String;
  @ApiProperty({
    type: Number,
    description: 'กรอกจำนวนเงินที่จะเพิ่มเข้ารายการ',
  })
  readonly price: number;

}
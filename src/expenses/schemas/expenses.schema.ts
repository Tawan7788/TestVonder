import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export enum ExpenseList {
  INCOME = 'Income',
  PAY = 'Pay',
}

@Schema({
  timestamps: true,
})
export class Expenses {
  @Prop({type:String,required: true})
  expenseList: ExpenseList;

  @Prop({type:String})
  description: string;

  @Prop()
  date: String;

  @Prop({type:Number,required: true})
  price: number;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expenses);
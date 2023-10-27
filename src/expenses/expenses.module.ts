import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesSchema } from './schemas/expenses.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Expenses', schema: ExpensesSchema }])],
  controllers: [ExpensesController],
  providers: [ExpensesService]
})
export class ExpensesModule {}

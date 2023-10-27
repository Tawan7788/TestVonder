import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Expenses } from './schemas/expenses.schema';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import { writeFile } from 'fs/promises';
@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expenses.name)
    private expensesModel: mongoose.Model<Expenses>,
  ) {}

  async findAll(): Promise<Expenses[]> {
    const expenses = await this.expensesModel.find();
    return expenses;
  }
  async summary() {
    const Income = await this.findIncome();
    const Pay = await this.findPay();
    const resultIncome = Income.map(({ price }) => price);
    const resultPay = Pay.map(({ price }) => price);
    const sum = {
      รายรับ: resultIncome,
      รายจ่าย: resultPay,
    };
    return sum;
  }
  async findIncome() {
    const expenses = await this.expensesModel.find({ expenseList: 'Income' });
    return expenses;
  }
  async findPay() {
    const expenses = await this.expensesModel.find({ expenseList: 'Pay' });
    return expenses;
  }
  async exportExcel() {
    try {
      let rows = [];
      const AllList = await this.findAll();
      let workBook = new Workbook();
      // AllList.forEach((doc) => {
      //   rows.push(Object.values(doc));
      // });
      const sheet = workBook.addWorksheet('Expenses');

      // rows.unshift(Object.keys(AllList[0]))
      sheet.columns = [
        // { header: 'ID', key: 'id', width: 25 },
        { header: 'Expense List', key: 'list', width: 25 },
        { header: 'Description', key: 'description', width: 25 },
        { header: 'Date', key: 'date', width: 25 },
        { header: 'Price', key: 'price', width: 25 },
      ];
      AllList.map((value, idx) => {
        sheet.addRow({
          list: value.expenseList,
          description: value.date,
          date: value.date,
          price: value.price,
        });
      });
      const remaining = await this.remaining();
      sheet.addRow({ list: '', description: '', date: '', price: remaining });
      this.styleSheet(sheet)
      this.styleSumSheet(sheet)
      // sheet.addRows(rows);
      let File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: `Expenses Vonder`,
            postfix: `.xlsx`,
            mode: parseInt('0600', 8),
          },
          async (err, file) => {
            if (err) throw new BadRequestException(err);

            workBook.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          },
        );
      });
      return File;
    } catch (error) {
      console.log(error);
    }
  }
  private styleSheet(sheet) {
    sheet.getColumn(1).width = 20.5;
    sheet.getColumn(2).width = 20.5;

    sheet.getRow(1).height = 30.5;

    sheet.getRow(1).font = {
      size: 18.5,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: '#ffc0cb', fgColor: { argb: '#ffc0cb' } },
    };
    sheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    // sheet.getRow(1).border={

    // }
  }
  private styleSumSheet(sheet) {
    sheet.getRow(-1).font = {
      size: 11.5,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    sheet.getRow(-1).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: '#4b0ce0', fgColor: { argb: '#4b0ce0' } },
    };
    sheet.getRow(-1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    // sheet.getRow(1).border={

    // }
  }
  async remaining() {
    const Income = await this.findIncome();
    const Pay = await this.findPay();
    const resultIncome = Income.map(({ price }) => price);
    const resultPay = Pay.map(({ price }) => price);
    // console.log(resultIncome.reduce((partialSum, a) => partialSum + a, 0));
    // console.log(resultPay.reduce((partialSum, a) => partialSum + a, 0));
    const totalMoney =
      resultIncome.reduce((partialSum, a) => partialSum + a, 0) -
      resultPay.reduce((partialSum, a) => partialSum + a, 0);

    return `ยอดเงินคงเหลือ ${totalMoney}`;
  }

  async create(expense: Expenses): Promise<Expenses> {
    const res = await this.expensesModel.create(expense);
    return res;
  }

  async findByDateOrList(date: string, list: string) {
    let result: any;
    if (!!date || !!list) {
      if (!!date && !!list) {
        result = await this.expensesModel.find({
          expenseList: list,
          date: date,
        });
      }
      if (!!date) {
        result = await this.expensesModel.find({ date: date });
      }
      if (!!list) {
        result = await this.expensesModel.find({ expenseList: list });
      }
    } else {
      result=await this.findAll();
    }

    return result;
  }

  //   async updateById(id: string, expense: Expenses): Promise<Expenses> {
  //     return await this.expensesModel.findByIdAndUpdate(id, expense, {
  //       new: true,
  //       runValidators: true,
  //     });
  //   }

  async deleteById(id: number): Promise<number> {
    return await this.expensesModel.findByIdAndDelete(id);
  }
}

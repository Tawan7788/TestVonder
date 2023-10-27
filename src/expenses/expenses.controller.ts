import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Expenses } from './schemas/expenses.schema';
import { ExpensesService } from './expenses.service';
import { CreateExpensesDto } from './dto/create-expenses-dto';
import { UpdateExpensesDto } from './dto/update-expenses-dto';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}
  @ApiTags('การแสดงรายการทั้งหมด')
  @Get()
  @ApiOkResponse({
    description: `\n[
    {\n
        "_id": "653a6f75fa61e9c4890d44d2",\n
        "expenseList": "Income",\n
        "description": "ขอแม่มา",\n
        "date": "2023-10-26T00:00:00.000Z",\n
        "price": 100,\n
        "createdAt": "2023-10-26T13:53:57.924Z",\n
        "updatedAt": "2023-10-26T13:53:57.924Z",\n
        "__v": 0\n
    },]`,
  })
  //   @ApiTags({})
  async getAllExpensess(): Promise<Expenses[]> {
    return this.expensesService.findAll();
  }
  @ApiTags('การคำนวณยอดคงเหลือ')
  @Get('cal')
  @ApiOkResponse({ description: 'ยอดเงินคงเหลือ -850' })
  async remainingExpenses() {
    return this.expensesService.remaining();
  }
  @ApiTags('การแสดงสรุป')
  @Get('summary')
  @ApiOkResponse({
    description: `\n{\n
    "รายรับ": [\n
        100,\n
        1000\n
    ],\n
    "รายจ่าย": [\n
        1000,\n
        1000\n
    ]\n
}`,
  })
  async getSummaryExpensess() {
    return this.expensesService.summary();
  }
  @ApiTags('การค้นหา - ผู้ใช้สามารถค้นหารายการตามวันที่หรือประเภท')
  @Get('seacrh')
  @ApiOkResponse({
    description: `\n[
    {\n
        "_id": "653a86abaad930dfb9fe9d25",\n
        "expenseList": "Income",\n
        "description": "เก็บเงินได้",\n
        "date": "2023-10-25T00:00:00.000Z",\n
        "price": 50,\n
        "createdAt": "2023-10-26T15:32:59.125Z",\n
        "updatedAt": "2023-10-26T15:32:59.125Z",\n
        "__v": 0\n
    }\n
]`,
  })
  async getSeacrhExpenses(
    @Query('date') date: string,
    @Query('list') list: string,
  ) {
    return this.expensesService.findByDateOrList(date, list);
  }
  @ApiTags('การเพิ่มรายการ')
  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  async createExpenses(
    @Body()
    Expenses: CreateExpensesDto,
  ): Promise<Expenses> {
    return this.expensesService.create(Expenses);
  }

  //   @Put(':id')
  //   async updateExpenses(
  //     @Param('id')
  //     id: string,
  //     @Body()
  //     Expenses: UpdateExpensesDto,
  //   ): Promise<Expenses> {
  //     return this.expensesService.updateById(id, Expenses);
  //   }
  @ApiTags('การลบรายการ')
  @Delete(':id')
  @ApiOkResponse({
    description: `\n[
    {\n
        "_id": "653a86abaad930dfb9fe9d25",\n
        "expenseList": "Income",\n
        "description": "เก็บเงินได้",\n
        "date": "2023-10-25T00:00:00.000Z",\n
        "price": 50,\n
        "createdAt": "2023-10-26T15:32:59.125Z",\n
        "updatedAt": "2023-10-26T15:32:59.125Z",\n
        "__v": 0\n
    }\n
]`,
  })
  async deleteExpenses(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.expensesService.deleteById(id);
  }
  @ApiTags('ดาวน์โหลดไฟล์ Excel เป็นการ export สรุปที่ได้ service')
  @Get('/download')
  @Header('Content-Type', 'text/xlsx')
  async downloadReport(@Res() res: Response) {
    let result = await this.expensesService.exportExcel();
    res.download(`${result}`);
  }
}

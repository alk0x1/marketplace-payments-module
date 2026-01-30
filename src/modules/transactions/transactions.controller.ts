import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  type CreateTransactionDto,
  type TransactionQueryDto,
  TransactionResponseDto,
} from './dto/index.js';
import type { TransactionsService } from './transactions.service.js';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({ status: 201, type: TransactionResponseDto })
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transações' })
  @ApiResponse({ status: 200, type: [TransactionResponseDto] })
  findAll(@Query() query: TransactionQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Processar pagamento da transação' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  processPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.processPayment(id);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar conclusão do serviço' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  confirm(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.confirmPayment(id);
  }
}

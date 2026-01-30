import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import type { PrismaService } from '../../database/prisma.service.js';
import {
  type CreateTransactionDto,
  type TransactionQueryDto,
  TransactionResponseDto,
} from './dto/index.js';
import { TransactionStatus } from './enums/index.js';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const feePercent = this.config.get<number>('platform.feePercent') || 10;
    const platformFee = dto.amount * (feePercent / 100);
    const autoConfirmDays = this.config.get<number>('platform.autoConfirmDays') || 7;

    const tx = await this.prisma.transaction.create({
      data: {
        clientId: dto.clientId,
        providerId: dto.providerId,
        serviceId: dto.serviceId,
        amount: dto.amount,
        platformFee,
        totalAmount: dto.amount + platformFee,
        netAmount: dto.amount - platformFee,
        paymentMethod: dto.paymentMethod,
        status: TransactionStatus.PENDING,
        autoConfirmAt: this.addDays(new Date(), autoConfirmDays),
      },
    });

    return this.toResponse(tx);
  }

  async findById(id: string): Promise<TransactionResponseDto> {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });

    if (!tx) {
      throw new NotFoundException(`Transação ${id} não encontrada`);
    }

    return this.toResponse(tx);
  }

  async findAll(query: TransactionQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.clientId && { clientId: filters.clientId }),
      ...(filters.providerId && { providerId: filters.providerId }),
      ...(filters.status && { status: filters.status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: data.map((tx) => this.toResponse(tx)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async processPayment(id: string): Promise<TransactionResponseDto> {
    const tx = await this.findByIdOrFail(id);

    if (tx.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transação não está pendente');
    }

    // TODO: integrar com Iugu
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: { status: TransactionStatus.PROCESSING },
    });

    return this.toResponse(updated);
  }

  async confirmPayment(id: string): Promise<TransactionResponseDto> {
    const tx = await this.findByIdOrFail(id);

    if (tx.status !== TransactionStatus.PAID) {
      throw new BadRequestException('Transação não está paga');
    }

    // TODO: criar splits e liberar
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
    });

    return this.toResponse(updated);
  }

  // helpers
  private async findByIdOrFail(id: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });
    if (!tx) {
      throw new NotFoundException(`Transação ${id} não encontrada`);
    }
    return tx;
  }

  private toResponse(tx: unknown): TransactionResponseDto {
    return plainToInstance(TransactionResponseDto, tx, {
      excludeExtraneousValues: true,
    });
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

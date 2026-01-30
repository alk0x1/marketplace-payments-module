import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaymentMethod, TransactionStatus } from '../enums/index.js';

@Exclude()
export class TransactionResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  clientId: string;

  @Expose()
  @ApiProperty()
  providerId: string;

  @Expose()
  @ApiProperty()
  serviceId: string;

  @Expose()
  @ApiProperty({ example: 1000.0 })
  amount: number;

  @Expose()
  @ApiProperty({ example: 100.0 })
  platformFee: number;

  @Expose()
  @ApiProperty({ example: 1100.0 })
  totalAmount: number;

  @Expose()
  @ApiProperty({ example: 900.0 })
  netAmount: number;

  @Expose()
  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @Expose()
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty({ required: false })
  paidAt?: Date;

  @Expose()
  @ApiProperty({ required: false })
  confirmedAt?: Date;

  @Expose()
  @ApiProperty({ required: false })
  releasedAt?: Date;

  @Expose()
  @ApiProperty()
  autoConfirmAt: Date;
}

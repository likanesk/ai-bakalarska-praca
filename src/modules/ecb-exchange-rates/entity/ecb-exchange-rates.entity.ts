import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'exchange_rates' })
export class EcbExchangeRatesEntity {
  @ApiProperty({ required: true, type: 'uuid' })
  @PrimaryColumn()
  @Generated('uuid')
  @IsUUID()
  record_id: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'timestamp with time zone',
  })
  @Column('timestamp with time zone', { default: Timestamp, nullable: false })
  @Index()
  created: string;

  @ApiProperty({ required: true, type: 'string' })
  @Column({ type: 'varchar', nullable: false, length: 3 })
  @Index()
  currency: string;

  @ApiProperty({ required: false, type: 'string' })
  @Column({ type: 'varchar', nullable: true, length: 24 })
  currency_alias: string;

  @ApiProperty({
    required: false,
    type: Number,
    format: '12,6',
  })
  @Column({ type: 'decimal', precision: 12, scale: 6, default: 0 })
  @IsDecimal()
  spot: number;
}

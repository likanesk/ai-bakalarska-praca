import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Column, Entity, Generated, Index, PrimaryColumn } from 'typeorm';
import { LogLevel } from '../type/log-level.enum';

@Entity({ name: 'log' })
export class LogEntity {
  @ApiProperty({ required: true, type: 'uuid' })
  @PrimaryColumn()
  @Generated('uuid')
  @IsUUID()
  record_id: string;

  @ApiProperty({ required: true, type: 'timestamp' })
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  created: Date;

  @ApiProperty({ required: true, enumName: 'log_level', enum: LogLevel })
  @Column({
    type: 'enum',
    enum: LogLevel,
    default: LogLevel.ERROR,
    nullable: false,
  })
  log_level: LogLevel;

  @ApiProperty({ required: true, type: 'object' })
  @Column('simple-json', { nullable: false })
  message: {
    class: string;
    function: string;
    input: object;
    message: string;
    status: number;
  };
}

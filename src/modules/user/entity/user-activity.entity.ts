import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_activity' })
export class UserActivityEntity {
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

  @Column({ type: 'uuid' })
  user_record_id: 'string';

  @ApiProperty({ required: true, type: 'string' })
  @Index()
  @Column({ type: 'varchar', nullable: false, length: 255 })
  @IsString()
  @IsNotEmpty()
  route: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_record_id', referencedColumnName: 'record_id' })
  user: UserEntity;
}

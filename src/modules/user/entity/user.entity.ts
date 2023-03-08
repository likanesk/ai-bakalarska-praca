import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import {
  Column,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserActivityEntity } from './user-activity.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @ApiProperty({ required: true, type: 'uuid' })
  @PrimaryColumn()
  @Generated('uuid')
  @IsUUID()
  record_id: string;

  @ApiProperty({ required: true, type: 'string' })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  @IsEmail()
  @Length(6, 64)
  @Index({ unique: true })
  user_name: string;

  @ApiProperty({ required: true, type: 'string' })
  @Index()
  @Column({ type: 'varchar', nullable: false, length: 64 })
  @IsString()
  @Length(6, 64)
  user_pass: string;

  @ApiProperty({ required: false, type: 'boolean' })
  @Index()
  @Column({ type: 'boolean', nullable: false, default: false })
  @IsOptional()
  is_admin: boolean;

  @OneToMany(
    () => UserActivityEntity,
    (userActivityEntity) => userActivityEntity.user,
  )
  activities: UserActivityEntity[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

/**
 * UserDto represents user credentials for user registration
 */
export class UserDto {
  @ApiProperty({
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 64,
    example: 'adrian.ihring@gmail.com',
  })
  @IsEmail()
  @Length(6, 64)
  username: string;

  @ApiProperty({
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 64,
    example: 'a+J}pF$+2}u+Y3hn',
  })
  @IsString()
  @Length(6, 64)
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BooksDto {
  @ApiProperty({
    required: true,
    example: 'Laskar Pelangi',
    description: 'Input book title',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
    example: 'Dede',
    description: 'Input book author',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Input book quantity',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    required: false,
    example: 'NRN-5',
    description: 'Input book code',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
    example: 'Active',
    description: 'Input books status',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: string;
}
export class TodoDto {
  @ApiProperty({
    required: true,
    example: 'Laskar Pelangi',
    description: 'Input book title',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: 'Dede',
    description: 'Input book author',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateTodoDto {
  @ApiProperty({
    required: false,
    example: 'Laskar Pelangi',
    description: 'Input book title',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    example: 'Dede',
    description: 'Input book author',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Input book quantity',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  assigne_id?: number;

  @ApiProperty({
    required: false,
    example: 'Active',
    description: 'Input books status',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  status?: status;
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Request,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import {
  BooksDto,
  QueryParams,
  SUCCESS_STATUS,
  TodoDto,
  UpdateTodoDto,
} from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('todo')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['lead'])
  @ApiOperation({
    summary: 'Input Todo',
    description: 'Input Todo ',
  })
  async postTodo(@Body() dto: TodoDto, @Request() req: any) {
    try {
      const data = await this.booksService.postTodo(dto, req.user.userId);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success post todo',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['lead'])
  @ApiOperation({
    summary: 'Update Todo',
    description: 'Update Todo',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @Request() req: any,
  ) {
    try {
      const data = await this.booksService.updateTodo(
        +id,
        dto,
        req.user.userId,
      );
      return {
        data: data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success update todo',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Book',
    description: 'Delete Book',
  })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.booksService.delete(+id);
      return {
        data: data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success delete books',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Books',
    description: 'Get books using query params',
  })
  async getTodo(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.booksService.getTodo(params);

      const metadata = {
        total_count: total_data,
        page_count: params.is_all_data
          ? 1
          : Math.ceil(total_data / (params.per_page ?? 10)),
        page: params.is_all_data ? 1 : params.page,
        per_page: params.is_all_data ? total_data : params.per_page,
        sort: params.sort,
        order_by: params.order_by,
        keyword: params.keyword,
      };

      return {
        data,
        metadata: metadata ? metadata : null,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get todo',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

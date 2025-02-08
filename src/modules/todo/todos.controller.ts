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
import { QueryParams, SUCCESS_STATUS, TodoDto, UpdateTodoDto } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { TodoService } from './todos.service';

@Controller('todo')
@ApiTags('Todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['lead'])
  @ApiOperation({
    summary: 'Input Todo',
    description: 'Input Todo ',
  })
  async postTodo(@Body() dto: TodoDto, @Request() req: any) {
    try {
      const data = await this.todoService.postTodo(dto, req.user.userId);
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
  @UseGuards(JwtAuthGuard)
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
      const data = await this.todoService.updateTodo(
        +id,
        dto,
        req.user.userId,
        req.user,
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
      const data = await this.todoService.delete(+id);
      return {
        data: data,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success delete todo',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get Todo',
    description: 'Get todo using query params',
  })
  async getTodo(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.todoService.getTodo(params);

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

  @Get('history')
  @ApiOperation({
    summary: 'Get Todo',
    description: 'Get todo using query params',
  })
  async getRecordsTodo(@Query() params: QueryParams) {
    try {
      const { total_data, data } =
        await this.todoService.getRecordsTodo(params);

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

  @Get(':id')
  @ApiOperation({
    summary: 'Get Todo by id',
    description: 'Get todo using query params',
  })
  async getTodoById(@Param('id') id: string) {
    try {
      const data = await this.todoService.getTodoById(+id);

      return {
        data,
        metadata: null,
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

import { Injectable } from '@nestjs/common';
import { status } from '@prisma/client';
import { QueryParams, TodoDto, UpdateTodoDto } from 'src/dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async postTodo(dto: TodoDto, user_id: number) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const data = await prisma.todo.create({
        data: {
          name: dto.name,
          description: dto.description,
          status: status.not_started,
        },
      });

      await prisma.todo_audit_log.create({
        data: {
          operation: 'CREATE',
          user_id,
          todo_id: data.id,
          new_data: data,
        },
      });

      return data;
    });
    return result;
  }

  async updateTodo(id: number, dto: UpdateTodoDto, user_id: number, user: any) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const oldData = await prisma.todo.findUnique({
        where: { id: id },
      });

      let updateData: any = {};

      if (user.role === 'lead') {
        updateData = {
          name: dto.name,
          description: dto.description,
          assigne_id: dto.assigne_id,
          status: dto.status,
        };
      } else if (user.role === 'team') {
        updateData = {
          description: dto.description,
          status: dto.status,
        };
      } else {
        throw new Error('Unauthorized: Invalid role');
      }

      const data = await prisma.todo.update({
        where: { id: id },
        data: updateData,
      });

      await prisma.todo_audit_log.create({
        data: {
          operation: 'UPDATE',
          todo_id: id,
          user_id,
          old_data: oldData,
          new_data: data,
        },
      });

      return data;
    });

    return result;
  }

  async delete(id: number) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const data = await prisma.todo.delete({
        where: {
          id: id,
        },
      });

      return data;
    });
    return result;
  }

  async getTodoById(id: number) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const data = await prisma.todo.findUnique({
        where: {
          id: id,
        },
      });

      return data;
    });
    return result;
  }

  async getTodo(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

    if (params.keyword) {
      query.push({
        title: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await Promise.all([
      this.prisma.todo.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.todo.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
  async getRecordsTodo(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

    if (params.keyword) {
      query.push({
        title: {
          contains: params.keyword,
          mode: 'insensitive',
        },
      });
    }

    const [total_data, data] = await Promise.all([
      this.prisma.todo_audit_log.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.todo_audit_log.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
}

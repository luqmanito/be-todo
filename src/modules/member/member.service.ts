import { Injectable } from '@nestjs/common';
import { QueryParams } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(params: QueryParams) {
    const skip = params.page ? (params.page - 1) * params.per_page : 0;
    const query = [];

    const [total_data, data] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          AND: query,
        },
      }),
      this.prisma.user.findMany({
        skip: params.is_all_data ? undefined : skip,
        take: params.is_all_data ? undefined : params.per_page,
        where: {
          AND: query,
        },
        select: {
          id: true,
          email: true,
        },

        orderBy: {
          [params.order_by]: params.sort,
        },
      }),
    ]);

    return { total_data, data };
  }
}

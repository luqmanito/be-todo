import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { QueryParams, SUCCESS_STATUS } from 'src/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';

@Controller('member')
@ApiTags('Member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Member',
    description: 'Get member using query params',
  })
  async getUser(@Query() params: QueryParams) {
    try {
      const { total_data, data } = await this.memberService.getUser(params);

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
        data: data,
        metadata: metadata ? metadata : null,
        _meta: {
          code: HttpStatus.OK,
          status: SUCCESS_STATUS,
          message: 'success get member',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

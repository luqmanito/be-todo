import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todos.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [TodoModule, MemberModule, AuthModule],
})
export class ServiceModule {}

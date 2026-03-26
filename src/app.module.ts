import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PondModule } from './ponds/pond.module';
import { CustomRabbitModule } from './rabbitmq/rabbitmq.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AuthModule,
    CustomRabbitModule,
    PondModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

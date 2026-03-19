import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService
          .get<string>('JWT_ACCESS_TOKEN_SECRET')!
          .replace(/\\n/g, '\n'),
      }),
    }),
    TypeOrmModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';

@Module({
  imports: [
    TypeOrmModule,
  ],
  controllers: [],
  providers: [],
})
export class PondModule {}
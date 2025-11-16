import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThankYou } from './entities/thank_you.entity';
import { ThankYouController } from './thank_you.controller';
import { ThankYouService } from './thank_you.service';

@Module({
  imports: [TypeOrmModule.forFeature([ThankYou]), AuthModule],
  controllers: [ThankYouController],
  providers: [ThankYouService],
  exports: [ThankYouService],
})
export class ThankYouModule {}

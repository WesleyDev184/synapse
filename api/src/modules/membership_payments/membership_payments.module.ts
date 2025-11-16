import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPayment } from './entities/membership_payment.entity';
import { MembershipPaymentsController } from './membership_payments.controller';
import { MembershipPaymentsService } from './membership_payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPayment]), AuthModule],
  controllers: [MembershipPaymentsController],
  providers: [MembershipPaymentsService],
  exports: [MembershipPaymentsService],
})
export class MembershipPaymentsModule {}

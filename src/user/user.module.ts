import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { LocationService } from '../utils/location';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, LocationService],
  controllers: [UserController],
})
export class UserModule {}

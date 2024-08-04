import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from 'src/utils/location';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, LocationService],
  controllers: [UserController],
})
export class UserModule {}

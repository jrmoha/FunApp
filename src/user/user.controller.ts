import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './user.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:user_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user profile',
    example: {
      name: 'string',
      email: 'string',
      city: 'string',
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiParam({
    name: 'user_id',
    description: 'The target user id',
    type: 'string',
  })
  profile(@Param('user_id', ParseUUIDPipe) user_id: string): Promise<User> {
    return this.userService.profile(user_id);
  }

  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The created user',
    example: {
      id: 'string',
      name: 'string',
      email: 'string',
      city: 'string',
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input body',
  })
  signup(@Body() body: SignupDto) {
    return this.userService.create(body);
  }
}

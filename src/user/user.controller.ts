import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiHeaders, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
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
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiParam({
    name: 'user_id',
    description: 'The target user id',
    type: 'string',
  })
  @ApiHeaders([
    {
      name: 'token',
      description: 'access token',
    },
  ])
  profile(@Param('user_id', ParseUUIDPipe) user_id: string): Promise<User> {
    return this.userService.profile(user_id);
  }

  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The created user',
    example: {
      token: 'string',
      id: 'string',
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

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/:user_id')
  profile(@Param('user_id') user_id: string) {
    return 'Hello from profile' + user_id;
  }
  /** Create a new user endpoint
   *
   * @param {SignupDto} body
   * @throws {BadRequestException} If the input doesn't follow the validation rules
   * @returns
   */
  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signup(@Body() body: SignupDto) {
    console.log(body);

    return this.userService.create(body);
  }
}

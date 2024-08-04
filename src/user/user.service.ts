import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { LocationService } from 'src/utils/location';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private locationService: LocationService,
  ) {}

  /**
   * Create a new user
   *
   * @param {SignupDto} input - The DTO containing the user's signup details
   * @throws {ConflictException} If the email input doesn't follow unique constraint
   * @returns {Promise<User>} The created user
   */
  async create(input: SignupDto): Promise<User> {
    const email_exists = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (email_exists) throw new ConflictException('Email already exists');
    const city = await this.locationService.getLocation(input);

    const user = new User();
    user.name = input.name;
    user.email = input.email;
    user.city = city;
    return this.userRepository.save(user);
  }
}

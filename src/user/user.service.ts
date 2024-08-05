import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { LocationService } from '../utils/location';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private locationService: LocationService,
  ) {}

  /**
   * Get user profile
   * @param {string} user_id - The target user's id
   * @throws {NotFoundException} If the user doesn't exist
   * @returns {Promise<User>} The user's profile
   */
  async profile(user_id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['name', 'email', 'city'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
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

    const { city, country } = await this.locationService.getLocation(input);
    if (!city || country !== 'EG')
      throw new BadRequestException('The user location must be within Egypt');

    const user = new User();
    user.name = input.name;
    user.email = input.email;
    user.city = city;

    return this.userRepository.save(user);
  }
}

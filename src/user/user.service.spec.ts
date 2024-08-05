import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LocationService } from '../utils/location';
import { AppModule } from '../app.module';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let locationService: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserService,
        ConfigService,
        LocationService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    locationService = module.get<LocationService>(LocationService);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });
  it('location service should be defined', () => {
    expect(locationService).toBeDefined();
  });
  describe('profile', () => {
    it('should return user profile when user is found', async () => {
      const user_id = 'eeeca84c-0a41-453f-b6d6-76c41bb879af';
      const mockUser = {
        name: 'Mostafa Muhammed',
        email: 'mostafa22@google.com',
        city: 'Luxor City',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.profile(user_id);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user_id },
        select: ['name', 'email', 'city'],
      });
    });
    it('should throw NotFoundException when user is not found', async () => {
      const user_id = '123';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.profile(user_id)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user_id },
        select: ['name', 'email', 'city'],
      });
    });
  });

  describe('signup', () => {
    const input: SignupDto = {
      name: 'Mostafa Mouhamed',
      email: 'mostafa@example.com',
      latitude: 30.0444,
      longitude: 31.2357,
    };
    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        name: 'Mostafa Mouhamed',
        email: 'mostafa@example.com',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.create(input)).rejects.toThrow(ConflictException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: input.email },
      });
    });
    it('should throw BadRequestException if user location is not in Egypt', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(locationService, 'getLocation')
        .mockResolvedValue({ city: 'Cairo', country: 'US' });

      await expect(service.create(input)).rejects.toThrow(BadRequestException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: input.email },
      });
      expect(locationService.getLocation).toHaveBeenCalledWith(input);
    });
    it('should create a new user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(locationService, 'getLocation')
        .mockResolvedValue({ city: 'Cairo', country: 'EG' });
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        id: 'uuid',
        ...input,
        city: 'Cairo',
      });

      const result = await service.create(input);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('id');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: input.email },
      });
      expect(locationService.getLocation).toHaveBeenCalledWith(input);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          city: 'Cairo',
        }),
      );
    });
  });
});

import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        token: 'test-token',
      };
    }),
    profile: jest.fn((id) => {
      return {
        name: 'test',
        email: 'test@test.com',
        city: 'Cairo',
      };
    }),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [JwtService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('signUp', () => {
    const dto: SignupDto = {
      name: 'test',
      email: 'test@test.com',
      latitude: 30.0444,
      longitude: 31.2357,
    };
    it('should create a new user and returns token', async () => {
      expect(await userController.signup(dto)).toEqual({
        token: expect.any(String),
      });

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
    it('should throw an error if latitude or longitude is out of bounds', async () => {
      const invalidDto = { ...dto, latitude: 30.6, longitude: 36.2357 };
      const validationPipe = new ValidationPipe({
        whitelist: true,
      });

      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: SignupDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw an error if email is already taken', async () => {
      mockUserService.create = jest
        .fn()
        .mockRejectedValue(new ConflictException());
      await expect(userController.signup(dto)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should throw an error if body input is invalid', async () => {
      const invalidDto = { ...dto, email: 'invalid-email' };
      const validationPipe = new ValidationPipe({
        whitelist: true,
      });

      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: SignupDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('profile', () => {
    const id = randomUUID();
    const user = {
      name: 'test',
      email: 'test@test.com',
      city: 'Cairo',
    };
    it('should return a user', async () => {
      expect(await userController.profile(id)).toStrictEqual(user);
      expect(mockUserService.profile).toHaveBeenCalledWith(id);
    });
    it('should throw an error if user not found', async () => {
      mockUserService.profile.mockRejectedValue(
        new NotFoundException() as never,
      );
      await expect(userController.profile(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

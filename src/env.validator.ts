import {
  Min,
  Max,
  validateSync,
  IsInt,
  IsString,
  IsOptional,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  DATABASE_HOST: string = 'localhost';

  @IsInt()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE: string;

  @IsString()
  OPENWEATHER_API_URL: string;

  @IsString()
  OPENWEATHER_API_KEY: string;

  @IsString()
  JWT_SECRET: string;
}

export function validateEnvFile(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

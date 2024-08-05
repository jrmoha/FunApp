import { IsEmail, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EgyptBounds,
  LatitudeErrorMessage,
  LongitudeErrorMessage,
} from '../../constants';

export class SignupDto {
  @IsString()
  @ApiProperty({
    description: 'The user name',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The user email',
  })
  email: string;

  @IsNumber({ maxDecimalPlaces: 8, allowInfinity: false, allowNaN: false })
  @Min(EgyptBounds.latitude.min, { message: LatitudeErrorMessage })
  @Max(EgyptBounds.latitude.max, { message: LatitudeErrorMessage })
  @ApiProperty({
    description: 'The user latitude location, must be within Egypt',
  })
  latitude: number;

  @IsNumber({ maxDecimalPlaces: 8, allowInfinity: false, allowNaN: false })
  @Min(EgyptBounds.longitude.min, { message: LongitudeErrorMessage })
  @Max(EgyptBounds.longitude.max, { message: LongitudeErrorMessage })
  @ApiProperty({
    description: 'The user longitude location, must be within Egypt',
  })
  longitude: number;
}

import { IsEmail, IsNumber, IsString, Max, Min } from 'class-validator';
import {
  EgyptBounds,
  LatitudeErrorMessage,
  LongitudeErrorMessage,
} from 'src/constants';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber({ maxDecimalPlaces: 8, allowInfinity: false, allowNaN: false })
  @Min(EgyptBounds.latitude.min, { message: LatitudeErrorMessage })
  @Max(EgyptBounds.latitude.max, { message: LatitudeErrorMessage })
  latitude: number;

  @IsNumber({ maxDecimalPlaces: 8, allowInfinity: false, allowNaN: false })
  @Min(EgyptBounds.longitude.min, { message: LongitudeErrorMessage })
  @Max(EgyptBounds.longitude.max, { message: LongitudeErrorMessage })
  longitude: number;
}

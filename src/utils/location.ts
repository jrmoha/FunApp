import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { SignupDto } from 'src/user/dto/signup.dto';

@Injectable()
export class LocationService {
  constructor(private configService: ConfigService) {}

  /** Get the location of the user using the latitude and longitude
   *
   * @param {Partial<SignupDto>} { latitude, longitude }
   * @returns The location of the user
   */

  async getLocation({ latitude, longitude }: Partial<SignupDto>): Promise<{
    city: string;
    country: string;
  }> {
    const provider_url = this.configService.get('OPENWEATHER_API_URL');
    const appid = this.configService.get('OPENWEATHER_API_KEY');
    const url = `${provider_url}?lat=${latitude}&lon=${longitude}&limit=5&appid=${appid}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        return { city: data[0]?.name, country: data[0]?.country };
      });
  }
}

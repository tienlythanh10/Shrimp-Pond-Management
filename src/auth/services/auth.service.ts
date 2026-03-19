import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponse } from 'src/shared/dto/response.dto';
import { SignInDTO } from '../dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  
  async signIn(signInData: SignInDTO) : Promise<HttpResponse> {
    return {
      success: true, 
      status: 200,
      data: {}
    }
  }
  
}
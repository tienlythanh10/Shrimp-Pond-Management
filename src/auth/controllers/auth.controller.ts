import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDTO } from '../dto/sign-in.dto';
import type { Response } from 'express';


@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInData: SignInDTO, @Res() res: Response) {
    const response = await this.authService.signIn(signInData);
    res.status(response.status).json({
      success: response.success,
      data: response.data,
      message: response.message
    })
  }

  @Post('otp')
  async generateNewOTP() {

  }

  @Post('otp/verify')
  async verifyOTP() {

  }

  @Post('reset-password') 
  async resetPassword (){}

  @Post('renew-access-token')
  async renewAccessToken() {

  }
}
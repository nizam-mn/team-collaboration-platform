import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(
      body.username,
      body.email,
      body.password,
    );

    // res.cookie('token', result.access_token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    //   maxAge: 1000 * 60 * 60 * 24, // 1 day
    // });

    // res.cookie('token', result.access_token, {
    //   httpOnly: true,
    //   secure: false, // ✅ must be false for localhost
    //   sameSite: 'lax', // ✅ works on localhost
    //   maxAge: 1000 * 60 * 60 * 24,
    // });

    res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ IMPORTANT
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Signup successful' };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.email, body.password);

    // res.cookie('token', result.access_token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    //   maxAge: 1000 * 60 * 60 * 24, // 1 day
    // });

    // res.cookie('token', result.access_token, {
    //   httpOnly: true,
    //   secure: false, // ✅ must be false for localhost
    //   sameSite: 'lax', // ✅ works on localhost
    //   maxAge: 1000 * 60 * 60 * 24,
    // });

    res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ IMPORTANT
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppleLoginDto } from './dto/apple-login.dto';
import { AppleGuard } from './guards/apple.guard';
import { AppAuthService } from './app-auth.service';
import { AppJwtAuthGuard } from './guards/app-jwt-auth.guard';
import { AppRefreshAuthGuard } from './guards/app-refresh-auth.guard';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';
import {
  IsLoggedInResponse,
  LoginResponse,
  RefreshTokenResponse,
} from '@cartrackr/cartrackr-shared';
import { AppCarService } from '../app-car/app-car.service';
import { BusinessLoginDto } from './dto/business-login.dto';
import { UsersService } from '../../admin/users/users.service';
import { LoggedInJwtAuthGuard } from './guards/logged-in-jwt-auth.guard';
import { UserBusinessService } from '../../admin/user-business/user-business.service';
import axios from 'axios';
import { GoogleLoginDto } from './dto/google-login.dto';
import { resolve } from 'path';

@Controller('auth')
export class AppAuthController {
  constructor(
    private readonly authService: AppAuthService,
    private readonly carService: AppCarService,
    private readonly businessUserService: UsersService,
    private readonly userBusinessService: UserBusinessService
  ) {}

  @UseGuards(AppleGuard)
  @Post('sign-in-with-apple')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: AppleLoginDto
  ): Promise<LoginResponse> {
    const user = await this.authService.findOrCreateUser({
      ...body,
      email: req.user.email,
    });

    const accessToken = await this.authService.generateJwtForUser(user);
    const refreshToken = await this.authService.generateRefreshTokenForUser(
      user
    );
    res.status(HttpStatus.OK);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('sign-in-with-google')
  async googleLogin(
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: GoogleLoginDto
  ): Promise<LoginResponse> {
    const googleUser = await axios.get<{
      email: string;
      given_name: string;
      name: string;
    }>(`https://oauth2.googleapis.com/tokeninfo?id_token=${body.idToken}`);

    const user = await this.authService.findOrCreateUser({
      email: googleUser.data.email,
      firstName: googleUser.data.given_name,
      lastName: googleUser.data.name,
    });

    const accessToken = await this.authService.generateJwtForUser(user);
    const refreshToken = await this.authService.generateRefreshTokenForUser(
      user
    );
    res.status(HttpStatus.OK);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('sign-in-with-business-id')
  async loginWithBusinessId(
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: BusinessLoginDto
  ): Promise<LoginResponse> {
    const userBusiness = await this.businessUserService.getAppLoginCredentials(
      body.token
    );

    const accessToken = await this.authService.generateJwtForBusiness(
      userBusiness
    );
    res.status(HttpStatus.OK);
    return {
      accessToken,
      refreshToken: null,
    };
  }

  @Get('is-logged-in')
  @UseGuards(LoggedInJwtAuthGuard)
  async isLoggedIn(
    @Req() req: { user: { role: string; id: number; userBusinessId: number } }
  ): Promise<IsLoggedInResponse> {
    if (req.user.role === 'user') {
      const user = await this.authService.findById(req.user.id);

      if (!user) {
        throw new UnauthorizedException('user_not_found');
      }
      const cars = await this.carService.findCarsByUserId(req.user.id);
      return {
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'user',
        },
        cars,
      };
    } else {
      const userBusiness = await this.userBusinessService.findByUserBusinessId(
        req.user.userBusinessId
      );

      if (!userBusiness) {
        throw new UnauthorizedException('user_not_found');
      }

      return {
        user: {
          email: userBusiness.user.email,
          firstName: userBusiness.user.firstName,
          lastName: userBusiness.user.lastName,
          role: 'business',
          businessName: userBusiness.business.name,
        },
        cars: [],
      };
    }
  }

  @Post('token/refresh')
  @UseGuards(AppRefreshAuthGuard)
  async logout(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: RefreshTokenRequestDto
  ): Promise<RefreshTokenResponse> {
    await this.authService.deleteRefreshTokenForUser(
      req.user,
      body.refreshToken
    );

    const accessToken = await this.authService.generateJwtForUser(req.user);
    const refreshToken = await this.authService.generateRefreshTokenForUser(
      req.user
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(HttpStatus.OK);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('set-firebase-token')
  @UseGuards(AppJwtAuthGuard)
  async setFirebaseToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: { token: string }
  ): Promise<void> {
    await this.authService.setFirebaseToken(req.user.id, body.token);
    res.status(HttpStatus.OK);
  }

  @Post('delete-firebase-token')
  @UseGuards(AppJwtAuthGuard)
  async deleteFirebaseToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) body: { token: string }
  ): Promise<void> {
    await this.authService.deleteFirebaseToken(req.user.id, body.token);
    res.status(HttpStatus.OK);
  }
}

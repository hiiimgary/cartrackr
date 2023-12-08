import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  Sse,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { MagicLoginStragegy } from './strategies/magic-login.strategy';
import { LoginDto } from './dto/login.dto';
import { MagicAuthGuard } from './guards/magic-login.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserBusinessService } from '../user-business/user-business.service';
import { SelectBusinesDto } from './dto/select-business.dto';
import { Observable, from, interval, map, startWith, switchMap } from 'rxjs';

@Controller('admin-auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userBusinessService: UserBusinessService,
    private readonly magicLinkStrategy: MagicLoginStragegy
  ) {}

  @Post('registration')
  async registration(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe()) user: CreateUserDto
  ) {
    await this.authService.createNewUser(user);

    this.magicLinkStrategy.send(req, res);
  }

  @Post('login')
  async login(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) body: LoginDto
  ) {
    await this.authService.validateUser(body.destination);

    this.magicLinkStrategy.send(req, res);
  }

  @Get('login/callback')
  @UseGuards(MagicAuthGuard)
  async loginCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.generateJwt(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });

    res.status(HttpStatus.OK);
  }

  @Get('is-logged-in')
  @UseGuards(JwtAuthGuard)
  async isLoggedIn(@Req() req) {
    const businesses = await this.userBusinessService
      .findAllByUserId(req.user.id)
      .then((businesses) =>
        businesses.map((business) => ({
          permission: business.permission,
          id: business.id,
          businessId: business.business.id,
          name: business.business.name,
          createdAt: business.business.createdAt,
          isActive: business.business.isActive,
        }))
      );

    return {
      user: req.user,
      businesses,
      activeBusiness:
        businesses.find(
          (business) => business.id === req.user.activeUserBusinessId
        ) || null,
    };
  }

  @Post('select-business')
  @UseGuards(JwtAuthGuard)
  async selectBusiness(
    @Req() req,
    @Body(new ValidationPipe()) selectedBusiness: SelectBusinesDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const userBusiness = await this.userBusinessService.findUserBusinessById(
      selectedBusiness.id,
      req.user.id
    );

    if (!userBusiness) {
      throw new BadRequestException('no-user-business');
    }

    if (!userBusiness.business.isActive) {
      throw new BadRequestException('business-not-active');
    }

    const access_token = await this.authService.generateJwt(
      req.user,
      userBusiness.id
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });

    res.status(HttpStatus.OK);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.status(HttpStatus.OK);
  }

  @Sse('app-login')
  @UseGuards(JwtAuthGuard)
  appLogin(@Res() response: Response, @Req() req): Observable<MessageEvent> {
    response.on('close', () => {
      this.authService.deleteAppLoginCredentials(req.user.activeUserBusinessId);
    });
    return interval(30000).pipe(
      startWith(''),
      switchMap(() =>
        from(
          this.authService.generateAppLoginCredentials(
            req.user.activeUserBusinessId
          )
        ).pipe(map((token) => ({ data: { token } } as MessageEvent)))
      )
    );
  }
}

import { Module } from '@nestjs/common';
import { AppAuthService } from './app-auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppJwtStrategy } from './strategies/app-jwt.strategy';
import { AppAuthController } from './app-auth.controller';
import { AppUserModule } from '../app-user/app-user.module';
import { AppleStrategy } from './guards/apple.guard';
import { AppRefreshStrategy } from './strategies/app-refresh.strategy';
import { AppCarModule } from '../app-car/app-car.module';
import { UsersModule } from '../../admin/users/users.module';
import { BusinessJwtStrategy } from './strategies/business-jwt.strategy';
import { LoggedInJwtStrategy } from './strategies/logged-in-jwt.strategy';
import { UserBusinessModule } from '../../admin/user-business/user-business.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '15s' },
    }),
    AppUserModule,
    UsersModule,
    AppCarModule,
    UserBusinessModule,
  ],
  controllers: [AppAuthController],
  providers: [
    AppAuthService,
    AppJwtStrategy,
    AppleStrategy,
    AppRefreshStrategy,
    BusinessJwtStrategy,
    LoggedInJwtStrategy,
  ],
})
export class AppAuthModule {}

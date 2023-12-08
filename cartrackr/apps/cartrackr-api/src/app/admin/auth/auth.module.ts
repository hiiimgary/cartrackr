import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MagicLoginStragegy } from './strategies/magic-login.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserBusinessModule } from '../user-business/user-business.module';

@Module({
  imports: [
    UsersModule,
    UserBusinessModule,
    PassportModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '2h' },
    }),
    MailerModule.forRoot({
      transport: {
        port: 1025,
        host: 'localhost',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MagicLoginStragegy, JwtStrategy],
})
export class AuthModule {}

import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MagicLoginStragegy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStragegy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly mailer: MailerService
  ) {
    super({
      secret: process.env.MAGIC_LOGIN_SECRET,
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: `${process.env.APP_URL}/auth/login-verification`,
      sendMagicLink: async (email: string, href: string) => {
        mailer.sendMail({
          from: 'info@cartrackr.com',
          to: email,
          subject: 'CarTrackr Login',
          html: `Your login link is <a href="${href}">here</a>`,
        });
        this.logger.debug(`Send magic link to ${email} with href: ${href}`);
      },
      verify: async (payload: { destination: string }, callback) => {
        callback(null, this.validate(payload));
      },
    });
  }

  validate(payload: { destination: string }) {
    return this.authService.validateUser(payload.destination);
  }
}

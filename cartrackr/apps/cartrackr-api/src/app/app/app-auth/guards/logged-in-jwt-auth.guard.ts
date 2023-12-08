import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoggedInJwtAuthGuard extends AuthGuard('logged-in-jwt') {}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AppRefreshAuthGuard extends AuthGuard('app-refresh') {}

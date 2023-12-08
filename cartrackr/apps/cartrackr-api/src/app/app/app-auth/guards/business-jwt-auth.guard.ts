import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BusinessJwtAuthGuard extends AuthGuard('business-jwt') {}

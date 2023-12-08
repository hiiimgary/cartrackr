import { Controller } from '@nestjs/common';
import { AppUserService } from './app-user.service';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}
}

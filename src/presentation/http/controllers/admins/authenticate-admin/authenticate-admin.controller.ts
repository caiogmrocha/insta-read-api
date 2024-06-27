import { Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';

import { AuthenticateAdminService } from '@/app/services/admins/authenticate-admin/authenticate-admin.service'
import { AdminNotFoundException } from '@/app/services/admins/errors/admin-not-found.exception';
import { InvalidAdminPasswordException } from '@/app/services/admins/errors/invalid-admin-password.exception';
import { AuthenticateAdminDto } from './authenticate-admin.dto';

type AuthenticateAdminControllerResponse = {
  token: string;
};

@Controller()
export class AuthenticateAdminController {
  constructor (
    private readonly authenticateAdminService: AuthenticateAdminService
  ) {}

  @Post('/api/admins/login')
  public async handle(@Body() requestDto: AuthenticateAdminDto): Promise<AuthenticateAdminControllerResponse> {
    try {
      const response = await this.authenticateAdminService.execute({
        email: requestDto.email,
        password: requestDto.password,
      });

      return response;
    } catch (error) {
      switch (error.constructor) {
        case AdminNotFoundException: {
          throw new NotFoundException(error.message);
        };

        case InvalidAdminPasswordException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException();
        };
      }
    }
  }
}

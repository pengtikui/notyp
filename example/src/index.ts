import 'reflect-metadata';
import { Application, Controller, Get, Injectable, Query } from '@notyp/core';

@Injectable()
class UserService {
  getUserDetail() {
    return { hello: '@notyp/core' };
  }
}

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('detail')
  getUserDetail(@Query() query: any) {
    return { ...this.userService.getUserDetail(), query };
  }
}

const app = new Application({ controllers: [UserController] });

app.bootstrap(8000);

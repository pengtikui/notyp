import 'reflect-metadata';
import { Application, Controller, Get, Injectable, Query } from '@notyp/core';
import config from '@notyp/config';

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
    return { ...this.userService.getUserDetail(), query, dbConfig: config.get('DB') };
  }
}

const app = new Application({ controllers: [UserController] });

app.bootstrap(8000);

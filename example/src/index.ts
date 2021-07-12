import 'reflect-metadata';
import {
  Application,
  Body,
  Context,
  Controller,
  Get,
  Injectable,
  Next,
  NotypMiddleware,
  Params,
  Post,
  Query,
  ValidationException,
} from '@notyp/core';
import config from '@notyp/config';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Injectable()
class UserService {
  getUserDetail() {
    return { hello: '@notyp/core' };
  }
}

class UserQuery {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value) || 0)
  id: number;
}

class UserBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  user(@Params('id') id: string) {
    return `hello user ${id}`;
  }

  @Post('detail')
  getUserDetail(@Query() query: UserQuery, @Body() body: UserBody) {
    return {
      ...this.userService.getUserDetail(),
      query,
      body,
      dbConfig: config.get('DB'),
    };
  }
}

@Injectable()
class ErrorMiddleware implements NotypMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(ctx: Context, next: Next) {
    try {
      await next();
    } catch (error) {
      if (error instanceof ValidationException) {
        ctx.status = 400;
        ctx.body = {
          user: this.userService.getUserDetail(),
          error: '参数校验失败',
        };
      } else {
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
      }
    }
  }
}

const app = new Application({
  controllers: [UserController],
  middlewares: [ErrorMiddleware],
  globalPrefix: 'api',
});

app.bootstrap(8080, () => {
  console.log('server is runing at http://localhost:8080');
});

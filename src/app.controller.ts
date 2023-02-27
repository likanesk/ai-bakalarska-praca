import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Hello world!',
  })
  @Get()
  helloWorld() {
    return { message: 'Hello world!' };
  }
}

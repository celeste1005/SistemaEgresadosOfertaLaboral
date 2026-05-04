import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'SistemaEgresadosOfertaLaboral backend is running',
      status: 'ok',
      endpoints: ['/trpc'],
    };
  }
}
import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { JwtService } from '@nestjs/jwt';

export interface TrpcContext {
  user?: {
    sub: number;
    email: string;
    rol: string;
  };
}

@Injectable()
export class TrpcService {
  constructor(private jwtService: JwtService) {}

  trpc = initTRPC.context<TrpcContext>().create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;

  // Middleware para verificar autenticación
  isAuthed = this.trpc.middleware(({ next, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        user: ctx.user,
      },
    });
  });

  protectedProcedure = this.trpc.procedure.use(this.isAuthed);
}

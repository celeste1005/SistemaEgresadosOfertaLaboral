import { JwtService } from '@nestjs/jwt';
export interface TrpcContext {
    user?: {
        sub: number;
        email: string;
        rol: string;
    };
}
export declare class TrpcService {
    private jwtService;
    constructor(jwtService: JwtService);
    trpc: import("@trpc/server").TRPCRootObject<TrpcContext, object, import("@trpc/server").TRPCRuntimeConfigOptions<TrpcContext, object>, {
        ctx: TrpcContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }>;
    procedure: import("@trpc/server").TRPCProcedureBuilder<TrpcContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
    router: import("@trpc/server").TRPCRouterBuilder<{
        ctx: TrpcContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }>;
    mergeRouters: <TRouters extends import("@trpc/server").AnyRouter[]>(...routerList: TRouters) => import("@trpc/server").TRPCMergeRouters<TRouters>;
    isAuthed: import("@trpc/server").TRPCMiddlewareBuilder<TrpcContext, object, {
        user: {
            sub: number;
            email: string;
            rol: string;
        };
    }, unknown>;
    protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<TrpcContext, object, {
        user: {
            sub: number;
            email: string;
            rol: string;
        };
    }, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
}

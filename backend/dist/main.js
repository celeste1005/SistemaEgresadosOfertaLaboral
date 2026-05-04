"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const trpc_router_1 = require("./trpc/trpc.router");
const trpcExpress = require("@trpc/server/adapters/express");
const jwt_1 = require("@nestjs/jwt");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const trpcRouter = app.get(trpc_router_1.TrpcRouter);
    const jwtService = app.get(jwt_1.JwtService);
    app.use('/trpc', trpcExpress.createExpressMiddleware({
        router: trpcRouter.appRouter,
        createContext: ({ req }) => {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                try {
                    const user = jwtService.verify(token);
                    return { user };
                }
                catch (e) {
                    return {};
                }
            }
            return {};
        },
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend corriendo en: http://localhost:${port}/trpc`);
}
bootstrap();
//# sourceMappingURL=main.js.map
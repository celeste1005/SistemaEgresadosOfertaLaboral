"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./modules/database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const egresados_module_1 = require("./modules/egresados/egresados.module");
const ofertas_module_1 = require("./modules/ofertas/ofertas.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const reportes_module_1 = require("./modules/reportes/reportes.module");
const trpc_module_1 = require("./trpc/trpc.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            trpc_module_1.TrpcModule,
            auth_module_1.AuthModule,
            egresados_module_1.EgresadosModule,
            ofertas_module_1.OfertasModule,
            dashboard_module_1.DashboardModule,
            reportes_module_1.ReportesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
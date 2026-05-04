"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrpcModule = void 0;
const common_1 = require("@nestjs/common");
const trpc_service_1 = require("./trpc.service");
const trpc_router_1 = require("./trpc.router");
const notifications_gateway_1 = require("./notifications.gateway");
const auth_module_1 = require("../modules/auth/auth.module");
const dashboard_module_1 = require("../modules/dashboard/dashboard.module");
const egresados_module_1 = require("../modules/egresados/egresados.module");
const ofertas_module_1 = require("../modules/ofertas/ofertas.module");
const reportes_module_1 = require("../modules/reportes/reportes.module");
let TrpcModule = class TrpcModule {
};
exports.TrpcModule = TrpcModule;
exports.TrpcModule = TrpcModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, dashboard_module_1.DashboardModule, egresados_module_1.EgresadosModule, ofertas_module_1.OfertasModule, reportes_module_1.ReportesModule],
        providers: [trpc_service_1.TrpcService, trpc_router_1.TrpcRouter, notifications_gateway_1.NotificationsGateway],
        exports: [trpc_router_1.TrpcRouter, notifications_gateway_1.NotificationsGateway],
    })
], TrpcModule);
//# sourceMappingURL=trpc.module.js.map
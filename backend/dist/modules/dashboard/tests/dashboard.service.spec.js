"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_service_1 = require("../dashboard.service");
const trpc_service_1 = require("../../../trpc/trpc.service");
describe('DashboardService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                dashboard_service_1.DashboardService,
                {
                    provide: trpc_service_1.TrpcService,
                    useValue: {
                        trpc: { procedure: {}, router: {}, mergeRouters: {} },
                    },
                },
            ],
        }).compile();
        service = module.get(dashboard_service_1.DashboardService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should return admin statistics with correct structure', async () => {
        const stats = await service.getAdminStats();
        expect(stats).toHaveProperty('totalEgresados');
        expect(stats).toHaveProperty('totalEmpresas');
        expect(stats.evolucionOfertas).toBeInstanceOf(Array);
    });
});
//# sourceMappingURL=dashboard.service.spec.js.map
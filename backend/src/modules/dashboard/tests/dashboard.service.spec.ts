import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../dashboard.service';
import { TrpcService } from '../../../trpc/trpc.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: TrpcService,
          useValue: {
            trpc: { procedure: {}, router: {}, mergeRouters: {} },
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
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

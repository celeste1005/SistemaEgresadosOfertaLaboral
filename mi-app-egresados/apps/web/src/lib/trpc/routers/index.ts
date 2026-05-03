import { router } from '../server';
import { adminRouter } from './admin.router';
import { graduateRouter } from './graduate.router';
import { companyRouter } from './company.router';
import { reportsRouter } from './reports.router';

export const appRouter = router({
  admin: adminRouter,
  graduate: graduateRouter,
  company: companyRouter,
  reports: reportsRouter,
});

export type AppRouter = typeof appRouter;

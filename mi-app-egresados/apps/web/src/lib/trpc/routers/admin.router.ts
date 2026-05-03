import { router, publicProcedure } from '../server';
import { z } from 'zod';

export const adminRouter = router({
  getStats: publicProcedure.query(async () => {
    // Aquí llamaríamos al backend NestJS vía fetch o axios
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/admin/stats`);
    return res.json();
  }),
});

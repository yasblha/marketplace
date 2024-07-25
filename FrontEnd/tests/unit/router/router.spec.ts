import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import router from '@/router/router'; // Vérifiez que le chemin est correct

describe('Router', () => {
  it('contains correct routes', () => {
    const routes = router.getRoutes() as RouteRecordRaw[];
    expect(routes.length).toBeGreaterThan(0);
    expect(routes[0].path).toBe('/');
  });
});

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { mount } from '@vue/test-utils';
import Home from '@/pages/Home.vue';
import AdminDashboard from '@/pages/AdminDashboard.vue';
import NotFound from '@/pages/NotFound.vue';
import App from '@/App.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/:catchAll(.*)', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('Router', () => {
  it('renders Home component via routing', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findComponent(Home).exists()).toBe(true);
  });

  it('renders AdminDashboard component via routing', async () => {
    router.push('/admin/dashboard');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findComponent(AdminDashboard).exists()).toBe(true);
  });

  it('renders NotFound component for invalid route', async () => {
    router.push('/invalid-route');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findComponent(NotFound).exists()).toBe(true);
  });
});

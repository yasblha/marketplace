import { createApp } from 'vue';
// import { mount } from '@vue/test-utils';
import { mount } from '@vue/vue3-jest';
import BestSellers_Products from '@/components/UI/BestSellers_Products.vue';

describe('BestSellers_Products.vue', () => {
  it('renders correctly', () => {
    const app = createApp({});
    const wrapper = mount(BestSellers_Products, {
      global: {
        plugins: [app],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});

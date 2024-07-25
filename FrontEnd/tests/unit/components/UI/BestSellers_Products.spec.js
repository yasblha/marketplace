import { shallowMount } from '@vue/test-utils';
import BestSellers_Products from '@/components/UI/BestSellers_Products.vue';

describe('BestSellers_Products.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(BestSellers_Products);
    expect(wrapper.exists()).toBe(true);
  });
});

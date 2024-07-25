import { shallowMount } from '@vue/test-utils';
import FicheProducts from '@/components/UI/FicheProducts.vue';

describe('FicheProducts.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(FicheProducts);
    expect(wrapper.exists()).toBe(true);
  });
});

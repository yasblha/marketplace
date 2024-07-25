import { shallowMount } from '@vue/test-utils';
import CategoryCarousel from '@/components/UI/CategoryCarousel.vue';

describe('CategoryCarousel.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(CategoryCarousel);
    expect(wrapper.exists()).toBe(true);
  });
});

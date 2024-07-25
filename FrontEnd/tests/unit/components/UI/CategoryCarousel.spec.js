import { mount } from '@vue/test-utils';
import CategoryCarousel from '@/components/UI/CategoryCarousel.vue';

describe('CategoryCarousel.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(CategoryCarousel);
    expect(wrapper.exists()).toBe(true);
  });
});

import { mount } from '@vue/test-utils';
import CategoryCarousel from '@/components/UI/CategoryCarousel.vue';

describe('CategoryCarousel.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(CategoryCarousel, {
      global: {
        plugins: []
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('has carousel items', () => {
    const wrapper = mount(CategoryCarousel, {
      global: {
        plugins: []
      }
    });
    expect(wrapper.findAll('.carousel-item').length).toBeGreaterThan(0);
  });
});

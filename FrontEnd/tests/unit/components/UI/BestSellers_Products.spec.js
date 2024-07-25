import { mount } from '@vue/test-utils';
import BestSellers_Products from '@/components/UI/BestSellers_Products.vue';

describe('BestSellers_Products.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(BestSellers_Products, {
      global: {
        plugins: []
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('has a title', () => {
    const wrapper = mount(BestSellers_Products, {
      global: {
        plugins: []
      }
    });
    expect(wrapper.find('h1').text()).toBe('Best Sellers');
  });
});

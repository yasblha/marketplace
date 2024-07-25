import { shallowMount } from '@vue/test-utils';
import Footer from '@/components/UI/Footer.vue';

describe('Footer.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(Footer);
    expect(wrapper.exists()).toBe(true);
  });
});

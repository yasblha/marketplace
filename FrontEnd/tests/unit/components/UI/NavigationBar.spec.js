import { shallowMount } from '@vue/test-utils';
import NavigationBar from '@/components/UI/NavigationBar.vue';

describe('NavigationBar.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(NavigationBar);
    expect(wrapper.exists()).toBe(true);
  });
});

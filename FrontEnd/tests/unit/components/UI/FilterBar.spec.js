import { shallowMount } from '@vue/test-utils';
import FilterBar from '@/components/UI/FilterBar.vue';

describe('FilterBar.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(FilterBar);
    expect(wrapper.exists()).toBe(true);
  });
});

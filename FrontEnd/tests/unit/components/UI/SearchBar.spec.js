import { shallowMount } from '@vue/test-utils';
import SearchBar from '@/components/UI/SearchBar.vue';

describe('SearchBar.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(SearchBar);
    expect(wrapper.exists()).toBe(true);
  });
});

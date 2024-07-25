import { shallowMount } from '@vue/test-utils';
import Profile from '@/components/profil/Profile.vue';

describe('Profile.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(Profile);
    expect(wrapper.exists()).toBe(true);
  });
});

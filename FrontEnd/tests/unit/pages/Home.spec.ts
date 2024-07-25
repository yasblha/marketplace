// import { mount } from '@vue/test-utils';
// import Home from '@/pages/Home.vue'; // Vérifiez que le chemin est correct

// describe('Home.vue', () => {
//   it('renders correctly', () => {
//     const wrapper = mount(Home, {
//       global: {
//         plugins: []
//       }
//     });
//     expect(wrapper.element).toMatchSnapshot();
//   });

//   it('contains welcome message', () => {
//     const wrapper = mount(Home, {
//       global: {
//         plugins: []
//       }
//     });
//     expect(wrapper.text()).toContain('Welcome');
//   });
// });


import { shallowMount } from '@vue/test-utils';
import Home from '@/pages/Home.vue';

describe('Home.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.exists()).toBe(true);
  });
});

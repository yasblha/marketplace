import { shallowMount } from '@vue/test-utils';
import AuthModal from '@/components/common/AuthModal.vue';

describe('AuthModal.vue', () => {
  it('renders login form when isLogin is true', () => {
    const wrapper = shallowMount(AuthModal, {
      props: {
        isVisible: true
      }
    });

    expect(wrapper.find('.auth-title').text()).toBe('Connexion');
    expect(wrapper.find('form.auth-form').exists()).toBe(true);
    expect(wrapper.find('button.btn-primary').text()).toBe('Se connecter');
  });

  it('renders register form when isLogin is false', async () => {
    const wrapper = shallowMount(AuthModal, {
      props: {
        isVisible: true
      }
    });

    await wrapper.setData({ isLogin: false });

    expect(wrapper.find('.auth-title').text()).toBe('Inscription');
    expect(wrapper.find('form.auth-form').exists()).toBe(true);
    expect(wrapper.find('button.btn-primary').text()).toBe("S'inscrire");
  });

  it('emits close event when close button is clicked', async () => {
    const wrapper = shallowMount(AuthModal, {
      props: {
        isVisible: true
      }
    });

    await wrapper.find('.close-button').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});

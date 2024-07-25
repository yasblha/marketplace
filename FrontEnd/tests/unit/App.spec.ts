import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/panier';
import { useAuthModalStore } from '@/stores/authModale';

// Mock vue-router
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn()
}));

// Mock stores
jest.mock('@/stores/panier', () => ({
  useCartStore: jest.fn(() => ({
    loadCart: jest.fn()
  }))
}));

jest.mock('@/stores/authModale', () => ({
  useAuthModalStore: jest.fn(() => ({
    isVisible: false,
    closeModal: jest.fn()
  }))
}));

// Type assertions for mocked functions
const mockUseRoute = useRoute as unknown as jest.Mock;
const mockUseRouter = useRouter as unknown as jest.Mock;
const mockUseCartStore = useCartStore as unknown as jest.Mock;
const mockUseAuthModalStore = useAuthModalStore as unknown as jest.Mock;

describe('App.vue', () => {
  it('should mount the component', () => {
    const wrapper = shallowMount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it('should call loadCart on mounted', () => {
    shallowMount(App);
    expect(mockUseCartStore().loadCart).toHaveBeenCalled();
  });

  it('should display NavigationBar if not in admin route', () => {
    mockUseRoute.mockReturnValue({ path: '/home' });
    const wrapper = shallowMount(App);
    expect(wrapper.findComponent({ name: 'NavigationBar' }).exists()).toBe(true);
  });

  it('should not display NavigationBar if in admin route', () => {
    mockUseRoute.mockReturnValue({ path: '/admin' });
    const wrapper = shallowMount(App);
    expect(wrapper.findComponent({ name: 'NavigationBar' }).exists()).toBe(false);
  });

  it('should display AuthModal if authModalStore.isVisible is true', () => {
    mockUseAuthModalStore().isVisible = true;
    const wrapper = shallowMount(App);
    expect(wrapper.findComponent({ name: 'AuthModal' }).exists()).toBe(true);
  });
});

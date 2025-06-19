
<template>
  <footer class="bg-gray-900 text-white">
    <!-- Top Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12 p-6 bg-primary-600 rounded-lg">
        <div class="mb-4 md:mb-0">
          <h3 class="text-2xl font-bold mb-2">Consulting Agency For Your Business</h3>
          <p class="text-primary-100">The quick fox jumps over the lazy dog</p>
        </div>
        <a 
          href="#contact" 
          class="px-6 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          Contact Us
        </a>
      </div>

      <!-- Main Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <!-- Company Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Company Info</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">We're Hiring</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Legal</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">GDPR</a></li>
          </ul>
        </div>

        <!-- Features -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Features</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Business Marketing</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">User Analytics</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Live Chat</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">24/7 Support</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Resources</h4>
          <ul class="space-y-3">n            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">IOS & Android</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Watch a Demo</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Customers</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">API</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Get in Touch</h4>
          <address class="not-italic space-y-3">
            <div class="flex items-center">
              <i class="fas fa-phone-alt mr-2 text-primary-400"></i>
              <a href="tel:+4805550103" class="text-gray-400 hover:text-white transition-colors">(480) 555-0103</a>
            </div>
            <div class="flex items-start">
              <i class="fas fa-map-marker-alt mt-1 mr-2 text-primary-400"></i>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                4517 Washington Ave.<br>Kentucky 39495
              </a>
            </div>
            <div class="flex items-center">
              <i class="fas fa-envelope mr-2 text-primary-400"></i>
              <a href="mailto:debra.holt@example.com" class="text-gray-400 hover:text-white transition-colors">
                debra.holt@example.com
              </a>
            </div>
          </address>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 pt-8 pb-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 mb-4 md:mb-0">
            &copy; 2023 MarketPlace. All rights reserved.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-facebook-f text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-linkedin-in text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
/* Custom styles for Font Awesome icons if needed */
.fa-phone-alt,
.fa-map-marker-alt,
.fa-envelope {
  width: 16px;
  text-align: center;
}

/* Smooth hover transitions */
a {
  transition: color 0.2s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .text-center-mobile {
    text-align: center;
  }
}
</style>
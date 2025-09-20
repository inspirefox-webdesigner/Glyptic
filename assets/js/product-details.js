// Product details loader
class ProductDetailsLoader {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.init();
  }

  async init() {
    if (window.location.pathname.includes('product-details.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');

      if (productId) {
        await this.loadProductDetails(productId);
      }
    }
  }

  async loadProductDetails(productId) {
    try {
      const response = await fetch(`${this.apiBase}/products/${productId}`);
      const product = await response.json();
      this.renderProductDetails(product);
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  renderProductDetails(product) {
    // Update page title
    document.title = `${product.title} - Glyptic`;

    // Update breadcrumb
    const breadcrumbTitle = document.querySelector('.breadcumb-title');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = product.title;
    }

    // Update product title
    const productTitle = document.querySelector('.box-title');
    if (productTitle) {
      productTitle.textContent = product.title;
    }

    // Update carousel images
    this.updateCarousel(product);

    // Update product content
    this.updateProductContent(product);
  }

  updateCarousel(product) {
    const carouselInner = document.querySelector('.carousel-inner');
    if (!carouselInner) return;

    carouselInner.innerHTML = '';

    const images = product.contents.filter(c => c.type === 'image');

    images.forEach((imageContent, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;

      const img = document.createElement('img');
      img.src = `http://localhost:5000/uploads/${imageContent.data}`;
      img.className = 'd-block w-100';
      img.alt = product.title;
      img.style.height = '400px';
      img.style.objectFit = 'contain';

      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
    });
  }

  updateProductContent(product) {
    const contentContainer = document.querySelector('.space-bottom .container .row');
    if (!contentContainer) return;

    let contentHTML = '';

    product.contents.forEach(content => {
      if (content.type === 'title') {
        contentHTML += `<h4>${content.data}</h4>`;
      } else if (content.type === 'content') {
        contentHTML += `<div class="mb-3">${content.data}</div>`;
      }
    });

    contentContainer.innerHTML = contentHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductDetailsLoader();
});
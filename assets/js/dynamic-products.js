// Dynamic products loader for addressable-fire-alarm.html
class DynamicProductsLoader {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.init();
  }
 
  async init() {
    if (window.location.pathname.includes('addressable-fire-alarm.html')) {
      await this.loadProducts();
    } else if (window.location.pathname.includes('products.html')) {
      await this.loadProductsGallery();
    }
  }
 
  async loadProducts() {
    try {
      const response = await fetch(`${this.apiBase}/products`);
      const products = await response.json();
      this.renderProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
 
  renderProducts(products) {
    const tabNav = document.querySelector('#v-pills-tab');
    const tabContent = document.querySelector('#v-pills-tabContent');
 
    if (!tabNav || !tabContent) return;
 
    // Clear existing content
    tabNav.innerHTML = '';
    tabContent.innerHTML = '';
 
    // Group products by category
    const groupedProducts = this.groupProductsByCategory(products);
 
    // Render categories and products
    this.renderCategories(groupedProducts, tabNav, tabContent);
  }
 
  groupProductsByCategory(products) {
    const predefinedCategories = {
      'fire-alarm': 'Fire Alarm System',
      'other-products': 'Other Products',
      'fire-suppression': 'Fire Suppression System'
    };
 
    const categories = {};
 
    products.forEach(product => {
      const categoryKey = this.getCategoryKey(product.category);
      const categoryTitle = predefinedCategories[product.category] || product.category;
 
      if (!categories[categoryKey]) {
        categories[categoryKey] = {
          title: categoryTitle,
          products: []
        };
      }
      categories[categoryKey].products.push(product);
    });
 
    return categories;
  }
 
  getCategoryKey(category) {
    // Convert category to a valid key
    if (['fire-alarm', 'other-products', 'fire-suppression'].includes(category)) {
      return category;
    }
    // For custom categories, create a key from the name
    return category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
 
  renderCategories(groupedProducts, tabNav, tabContent) {
    let tabIndex = 1;
    let isFirstCategory = true;
    let globalFirstTab = true;
 
    Object.entries(groupedProducts).forEach(([categoryKey, categoryData]) => {
      if (categoryData.products.length === 0) return;
 
      // Create category section
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'nav-category';
 
      const categoryTitle = document.createElement('h6');
      categoryTitle.className = `nav-category-title ${isFirstCategory ? 'active' : ''}`;
      categoryTitle.setAttribute('data-category', categoryKey);
      categoryTitle.innerHTML = `${categoryData.title} <i class="fas fa-chevron-down"></i>`;
 
      const categoryContent = document.createElement('div');
      categoryContent.className = 'nav-category-content';
      categoryContent.id = categoryKey;
      if (!isFirstCategory) {
        categoryContent.style.display = 'none';
      }
 
      categoryData.products.forEach(product => {
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.className = `nav-link ${globalFirstTab ? 'active' : ''}`;
        tabButton.id = `tab-${tabIndex}`;
        tabButton.setAttribute('data-bs-toggle', 'pill');
        tabButton.setAttribute('data-bs-target', `#content-${tabIndex}`);
        tabButton.setAttribute('type', 'button');
        tabButton.setAttribute('role', 'tab');
        tabButton.textContent = product.title;
        categoryContent.appendChild(tabButton);
 
        // Create tab content
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade ${globalFirstTab ? 'show active' : ''}`;
        tabPane.id = `content-${tabIndex}`;
        tabPane.setAttribute('role', 'tabpanel');
 
        const container = document.createElement('div');
        container.className = 'container';
        container.style.wordWrap = 'break-word';
        container.style.overflowWrap = 'break-word';
 
        const row = document.createElement('div');
        row.className = 'row';
 
        // Create product cards
        this.createProductCards(product, row);
 
        container.appendChild(row);
        tabPane.appendChild(container);
        tabContent.appendChild(tabPane);
 
        tabIndex++;
        globalFirstTab = false;
      });
 
      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(categoryContent);
      tabNav.appendChild(categoryDiv);
 
      isFirstCategory = false;
    });
 
    // Add category toggle and tab functionality
    this.addCategoryToggleListeners();
    this.addTabListeners();
  }
 
  createProductCards(product, container) {
    // Create a single card for the product with its details
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6';
 
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = () => {
      window.location.href = `product-details.html?id=${product._id}`;
    };
 
    // Get first image
    const firstImage = product.contents.find(c => c.type === 'image');
    if (firstImage) {
      const img = document.createElement('img');
      // Handle both single image and array of images
      const imageData = Array.isArray(firstImage.data) ? firstImage.data[0] : firstImage.data;
      img.src = `http://localhost:5000/uploads/${imageData}`;
      img.className = 'card-img-top';
      img.alt = product.title;
      img.onerror = function() {
        this.src = 'assets/img/product/Fire-Alarm-System-fire-Alarm-Control-Panel-addressable-Fire-Detection.jpg';
      };
      card.appendChild(img);
    }
 
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
 
    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = product.title;
 
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);
    cardCol.appendChild(card);
    container.appendChild(cardCol);
  }
 
  addCategoryToggleListeners() {
    document.querySelectorAll('.nav-category-title').forEach(title => {
      title.addEventListener('click', () => {
        const category = title.getAttribute('data-category');
        const content = document.getElementById(category);
        const isActive = title.classList.contains('active');
 
        // Close all categories
        document.querySelectorAll('.nav-category-title').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-category-content').forEach(c => c.style.display = 'none');
 
        // Toggle current category
        if (!isActive) {
          title.classList.add('active');
          content.style.display = 'block';
        }
      });
    });
  }
 
  addTabListeners() {
    document.querySelectorAll('.nav-link[data-bs-toggle="pill"]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
 
        // Remove active from all tabs and content
        document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => {
          p.classList.remove('show', 'active');
        });
 
        // Add active to clicked tab
        tab.classList.add('active');
 
        // Show corresponding content
        const targetId = tab.getAttribute('data-bs-target');
        const targetPane = document.querySelector(targetId);
        if (targetPane) {
          targetPane.classList.add('show', 'active');
        }
      });
    });
  }
 
  // New method for products.html gallery
  async loadProductsGallery() {
    try {
      const response = await fetch(`${this.apiBase}/products`);
      const products = await response.json();
      this.renderProductsGallery(products);
    } catch (error) {
      console.error('Error loading products:', error);
      // Show error message to user
      const gallery = document.querySelector('#products-gallery');
      if (gallery) {
        gallery.innerHTML = `
          <div class="col-12 text-center">
            <div class="alert alert-warning" role="alert">
              <i class="fas fa-exclamation-triangle"></i>
              Unable to load products. Please try again later.
            </div>
          </div>
        `;
      }
    }
  }
 
  renderProductsGallery(products) {
    const gallery = document.querySelector('#products-gallery');
    if (!gallery) return;
 
    gallery.innerHTML = '';
 
    if (products.length === 0) {
      gallery.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-info" role="alert">
            <i class="fas fa-info-circle"></i>
            No products available at the moment.
          </div>
        </div>
      `;
      return;
    }
 
    products.forEach(product => {
      const firstImage = product.contents.find(c => c.type === 'image');
      if (firstImage) {
        const productCard = document.createElement('div');
        productCard.className = 'col-lg-4 col-md-6';
 
        // Handle both single image and array of images
        const imageData = Array.isArray(firstImage.data) ? firstImage.data[0] : firstImage.data;
 
        productCard.innerHTML = `
          <div class="card h-100" style="border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease; cursor: pointer;">
            <img src="http://localhost:5000/uploads/${imageData}"
                 class="card-img-top"
                 alt="${product.title}"
                 style="height: 400px; object-fit: cover; border-radius: 8px 8px 0 0;"
                 onerror="this.src='assets/img/product/Fire-Alarm-System-fire-Alarm-Control-Panel-addressable-Fire-Detection.jpg'">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-center" style="font-size: 1rem; font-weight: 600; color: #333;">${product.title}</h5>
            </div>
          </div>
        `;
 
        // Add click functionality to navigate to product details
        productCard.addEventListener('click', () => {
          window.location.href = `product-details.html?id=${product._id}`;
        });
 
        // Add hover effect
        productCard.addEventListener('mouseenter', () => {
          productCard.querySelector('.card').style.transform = 'translateY(-5px)';
        });
 
        productCard.addEventListener('mouseleave', () => {
          productCard.querySelector('.card').style.transform = 'translateY(0)';
        });
 
        gallery.appendChild(productCard);
      }
    });
  }
}
 
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DynamicProductsLoader();
});
 
// Add CSS for products gallery
if (window.location.pathname.includes('products.html')) {
  const style = document.createElement('style');
  style.textContent = `
    #products-gallery .card {
      cursor: pointer;
    }
    #products-gallery .card:hover {
      box-shadow: 0 8px 15px rgba(0,0,0,0.2) !important;
    }
    #products-gallery .col-lg-4,
    #products-gallery .col-md-6 {
      margin-bottom: 2rem;
    }
    @media (max-width: 768px) {
      #products-gallery .col-lg-4 {
        margin-bottom: 1.5rem;
      }
    }
    .alert {
      padding: 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
    }
    .alert i {
      margin-right: 0.5rem;
    }
  `;
  document.head.appendChild(style);
}
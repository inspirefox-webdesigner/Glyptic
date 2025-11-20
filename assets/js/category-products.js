// Dynamic Category-Based Product Loader for addressable-fire-alarm.html
const API_BASE_URL = 'http://localhost:5000';

// Category mapping
const categoryMapping = {
    'fire-alarm': 'Fire Alarm System',
    'other-products': 'Other Products',
    'fire-suppression': 'Fire Suppression System'
};

// Load products by category
async function loadCategoryProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const products = await response.json();
        
        // Group products by category
        const productsByCategory = {};
        products.forEach(product => {
            if (product.category) {
                if (!productsByCategory[product.category]) {
                    productsByCategory[product.category] = [];
                }
                productsByCategory[product.category].push(product);
            }
        });
        
        // Render categories and products
        renderCategories(productsByCategory);
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderCategories(productsByCategory) {
    const sidebar = document.querySelector('#v-pills-tab');
    const tabContent = document.querySelector('#v-pills-tabContent');
    
    if (!sidebar || !tabContent) return;
    
    // Clear existing content
    sidebar.innerHTML = '';
    tabContent.innerHTML = '';
    
    // Add Category Filter title
    const filterTitle = document.createElement('div');
    filterTitle.className = 'category-filter-title';
    filterTitle.innerHTML = '<h5>Category Filter</h5>';
    sidebar.appendChild(filterTitle);
    
    let tabIndex = 1;
    let isFirst = true;
    
    // Render each category
    Object.keys(productsByCategory).forEach(categoryKey => {
        const products = productsByCategory[categoryKey];
        const categoryLabel = categoryMapping[categoryKey] || categoryKey;
        
        // Create category section in sidebar
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'nav-category';
        
        // Create category title
        const categoryTitle = document.createElement('h6');
        categoryTitle.className = `nav-category-title ${isFirst ? 'active' : ''}`;
        categoryTitle.setAttribute('data-category', categoryKey);
        categoryTitle.innerHTML = `${categoryLabel} <i class="fas fa-chevron-down"></i>`;
        
        // Create category content with product buttons
        const categoryContent = document.createElement('div');
        categoryContent.className = 'nav-category-content';
        categoryContent.id = categoryKey;
        categoryContent.style.display = isFirst ? 'block' : 'none';
        
        // Add product buttons
        products.forEach((product, idx) => {
            const productBtn = document.createElement('button');
            productBtn.className = `nav-link ${isFirst && idx === 0 ? 'active' : ''}`;
            productBtn.id = `tab-${tabIndex}`;
            productBtn.setAttribute('data-bs-toggle', 'pill');
            productBtn.setAttribute('data-bs-target', `#content-${tabIndex}`);
            productBtn.setAttribute('type', 'button');
            productBtn.setAttribute('role', 'tab');
            productBtn.textContent = product.title;
            categoryContent.appendChild(productBtn);
            
            // Create tab content for each product
            const tabPane = document.createElement('div');
            tabPane.className = `tab-pane fade ${isFirst && idx === 0 ? 'show active' : ''}`;
            tabPane.id = `content-${tabIndex}`;
            tabPane.setAttribute('role', 'tabpanel');
            
            const coverImage = product.coverImage || 
                (product.contents && product.contents.find(c => c.type === 'coverImage')?.data) ||
                'assets/img/product/default-product.jpg';
            
            tabPane.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <a href="product-details.html?id=${product._id}" class="card">
                                <img src="${API_BASE_URL}/uploads/${coverImage}" 
                                     class="card-img-top" 
                                     alt="${product.title}"
                                     onerror="this.src='assets/img/product/default-product.jpg'" />
                                <div class="card-body">
                                    <h5 class="card-title">${product.title}</h5>
                                    <p class="card-text">${product.description || ''}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            tabContent.appendChild(tabPane);
            
            tabIndex++;
        });
        
        categoryDiv.appendChild(categoryTitle);
        categoryDiv.appendChild(categoryContent);
        sidebar.appendChild(categoryDiv);
        
        isFirst = false;
    });
    
    // Add category toggle functionality
    document.querySelectorAll('.nav-category-title').forEach(title => {
        title.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            const content = document.getElementById(categoryId);
            
            // Close all other categories
            document.querySelectorAll('.nav-category-content').forEach(c => {
                if (c.id !== categoryId) {
                    c.style.display = 'none';
                }
            });
            document.querySelectorAll('.nav-category-title').forEach(t => {
                if (t !== this) {
                    t.classList.remove('active');
                }
            });
            
            // Toggle current category
            if (content) {
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';
                this.classList.toggle('active');
            }
        });
    });
    
    // Add product tab click functionality
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-bs-target');
            
            // Remove active from all product tabs
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show selected tab content
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadCategoryProducts);

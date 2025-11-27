// Dynamic Products Loading and Filtering
document.addEventListener("DOMContentLoaded", function () {
  let allProducts = [];
  let filteredProducts = [];
  let currentFilter = { type: "category", value: "all" };

  // Initialize the page
  init();

  function init() {
    // Check for brand parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get("brand");

    loadProducts(brandParam);
    setupEventListeners();
  }

  // Load products from API
  async function loadProducts(initialBrand = null) {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      allProducts = await response.json();

      // If brand parameter exists, filter by brand
      if (initialBrand) {
        filteredProducts = allProducts.filter(
          (product) => product.brand === initialBrand
        );
        currentFilter = { type: "brand", value: initialBrand };
        // Open brands section if brand filter is active
        setTimeout(() => {
          const brandsContent = document.getElementById("brands-content");
          const brandsTitle = document.querySelector('[data-toggle="brands"]');
          const categoriesContent = document.getElementById("categories-content");
          const categoriesTitle = document.querySelector('[data-toggle="categories"]');
          if (brandsContent && brandsTitle) {
            brandsContent.style.display = "block";
            brandsTitle.classList.add("active");
          }
          if (categoriesContent && categoriesTitle) {
            categoriesContent.style.display = "none";
            categoriesTitle.classList.remove("active");
          }
        }, 100);
      } else {
        filteredProducts = [...allProducts];
      }

      renderProducts();
      setupFilters(initialBrand);
    } catch (error) {
      console.error("Error loading products:", error);
      showError("Failed to load products. Please try again later.");
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Filter title toggles
    document.querySelectorAll(".filter-title").forEach((title) => {
      title.addEventListener("click", function () {
        const toggle = this.getAttribute("data-toggle");
        toggleFilterSection(toggle);
      });
    });
  }

  // Toggle filter sections
  function toggleFilterSection(section) {
    const categoriesContent = document.getElementById("categories-content");
    const brandsContent = document.getElementById("brands-content");
    const categoriesTitle = document.querySelector(
      '[data-toggle="categories"]'
    );
    const brandsTitle = document.querySelector('[data-toggle="brands"]');

    if (section === "categories") {
      // Toggle categories visibility
      const isVisible = categoriesContent.style.display !== "none";
      categoriesContent.style.display = isVisible ? "none" : "block";
      categoriesTitle.classList.toggle("active");
    } else if (section === "brands") {
      // Toggle brands visibility
      const isVisible = brandsContent.style.display !== "none";
      brandsContent.style.display = isVisible ? "none" : "block";
      brandsTitle.classList.toggle("active");
    }
  }

  // Setup dynamic filters
  function setupFilters(activeBrand = null) {
    setupCategoryFilters();
    setupBrandFilters(activeBrand);
  }

  // Setup category filters
  function setupCategoryFilters() {
    const categoriesContainer = document.getElementById("categories-content");
    // Get all unique categories
    const categories = [
      ...new Set(
        allProducts
          .filter((product) => product.category)
          .map((product) => product.category)
      ),
    ];

    // Clear existing filters except "All Products"
    const allButton = categoriesContainer.querySelector(
      '[data-category="all"]'
    );
    categoriesContainer.innerHTML = "";
    categoriesContainer.appendChild(allButton);

    // Add category filters
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "filter-btn category-filter";
      button.setAttribute("data-category", category);
      button.textContent = getCategoryDisplayName(category);

      button.addEventListener("click", function () {
        filterByCategory(category);
        setActiveFilter(this, "category-filter");
      });

      categoriesContainer.appendChild(button);
    });

    // Setup "All Products" button
    allButton.addEventListener("click", function () {
      showAllProducts();
      setActiveFilter(this, "category-filter");
    });
  }

  // Setup brand filters
  function setupBrandFilters(activeBrand = null) {
    const brandsContainer = document.getElementById("brands-content");
    if (!brandsContainer) return; // Exit if brands container doesn't exist
    
    // Get all unique brands
    const brands = [
      ...new Set(
        allProducts
          .filter((product) => product.brand)
          .map((product) => product.brand)
      ),
    ];

    // Clear existing filters except "All Brands"
    const allButton = brandsContainer.querySelector('[data-brand="all"]');
    brandsContainer.innerHTML = "";
    brandsContainer.appendChild(allButton);

    // Add brand filters
    brands.forEach((brand) => {
      const button = document.createElement("button");
      button.className = "filter-btn brand-filter";
      button.setAttribute("data-brand", brand);
      button.textContent = brand;

      // Set active if this is the initial brand
      if (activeBrand && brand === activeBrand) {
        button.classList.add("active");
        allButton.classList.remove("active");
        // Open brands section
        const brandsContent = document.getElementById("brands-content");
        const brandsTitle = document.querySelector('[data-toggle="brands"]');
        if (brandsContent && brandsTitle) {
          brandsContent.style.display = "block";
          brandsTitle.classList.add("active");
        }
      }

      button.addEventListener("click", function () {
        filterByBrand(brand);
        setActiveFilter(this, "brand-filter");
      });

      brandsContainer.appendChild(button);
    });

    // Setup "All Brands" button
    allButton.addEventListener("click", function () {
      showAllProducts();
      setActiveFilter(this, "brand-filter");
    });
  }

  // Filter by category
  function filterByCategory(category) {
    filteredProducts = allProducts.filter(
      (product) => product.category === category
    );
    currentFilter = { type: "category", value: category };
    renderProducts();
  }

  // Filter by brand
  function filterByBrand(brand) {
    filteredProducts = allProducts.filter(
      (product) => product.brand === brand
    );
    currentFilter = { type: "brand", value: brand };
    renderProducts();
  }

  // Show all products
  function showAllProducts() {
    filteredProducts = [...allProducts];
    currentFilter = { type: "all", value: "all" };
    renderProducts();
  }

  // Set active filter button
  function setActiveFilter(activeButton, filterClass) {
    // Remove active class from all buttons of this type
    document.querySelectorAll(`.${filterClass}`).forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked button
    activeButton.classList.add("active");
  }

  // Render products
  function renderProducts() {
    const productsContainer = document.getElementById("products-gallery");

    if (filteredProducts.length === 0) {
      const filterMessage =
        currentFilter.type === "brand"
          ? `No products available for "${currentFilter.value}" brand`
          : currentFilter.type === "category"
          ? `No products available in this category`
          : "No products found";

      productsContainer.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <div class="alert alert-info" role="alert">
                            <h4 class="alert-heading"><i class="fas fa-info-circle"></i> ${filterMessage}</h4>
                            <p class="mb-0">Please try selecting a different filter or check back later for new products.</p>
                        </div>
                    </div>
                </div>
            `;
      return;
    }

    productsContainer.innerHTML = filteredProducts
      .map((product) => {
        const imageUrl = getProductImage(product);

        return `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <a href="product-details.html?id=${product._id}" class="product-card">
                        <div class="product-card-img-wrapper">
                            <img src="${imageUrl}" alt="${product.title}" onerror="this.src='assets/img/product/default-product.jpg'">
                        </div>
                        <div class="product-card-body">
                            <h5 class="product-card-title">${product.title}</h5>
                        </div>
                    </a>
                </div>
            `;
      })
      .join("");
  }

  // Get product image URL - ONLY cover image
  function getProductImage(product) {
    // Only use cover image
    if (product.coverImage) {
      return `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${product.coverImage}`;
    }

    // Default image if no cover image
    return "assets/img/product/default-product.jpg";
  }

  // Get category display name
  function getCategoryDisplayName(category) {
    const categoryMap = {
      "fire-alarm": "Fire Alarm System",
      "other-products": "Other Products",
      "fire-suppression": "Fire Suppression System",
    };

    return (
      categoryMap[category] ||
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  }

  // Show error message
  function showError(message) {
    const productsContainer = document.getElementById("products-gallery");
    productsContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Error!</h4>
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        `;
  }
});

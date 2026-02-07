// Dynamic Menu Generation for Products

// Predefined categories (Glyptic Special)
const predefinedCategories = [
  "fire-alarm",
  "digital-pa",
  "flame-smoke-camera",
  "dts-fo-lhs",
  "fire-suppression",
  "linear-heat-cable",
  "smoke-detector-tester",
];

// Predefined brands (Authorize Partners)
const predefinedBrands = [
  "Edwards",
  "Siemens",
  "Notifier",
  "Simplex",
  "TNA",
  "Farenhyt",
  "ESSER",
  "Honeywell",
  "Apollo",
  "Ansul",
  "Kidde",
  "Blazecut",
  "Kentec",
  "Wagner",
  "Bandweaver",
  "Securiton",
];

async function updateProductMenu() {
  try {
    // Fetch categories and brands from API
    const [categoriesRes, brandsRes] = await Promise.all([
      fetch(`${API_CONFIG.API_BASE}/products/categories`),
      fetch(`${API_CONFIG.API_BASE}/products/brands`),
    ]);

    const categories = await categoriesRes.json();
    const brands = await brandsRes.json();

    // Filter predefined items that still exist in API
    const existingPredefinedCategories = predefinedCategories.filter((cat) =>
      categories.includes(cat),
    );
    const existingPredefinedBrands = predefinedBrands.filter((brand) =>
      brands.includes(brand),
    );

    // Get new categories (not in predefined list)
    const newCategories = categories.filter(
      (cat) => !predefinedCategories.includes(cat),
    );

    // Get new brands (not in predefined list)
    const newBrands = brands.filter(
      (brand) => !predefinedBrands.includes(brand),
    );

    // Update desktop menu
    updateDesktopMenu(
      existingPredefinedCategories,
      existingPredefinedBrands,
      newCategories,
      newBrands,
    );

    // Update mobile menu
    updateMobileMenu(
      existingPredefinedCategories,
      existingPredefinedBrands,
      newCategories,
      newBrands,
    );
  } catch (error) {
    console.error("Error updating product menu:", error);
  }
}

function updateDesktopMenu(
  existingPredefinedCategories,
  existingPredefinedBrands,
  newCategories,
  newBrands,
) {
  const desktopMenu = document.querySelector(".main-menu > ul");
  if (!desktopMenu) return;

  const productsLi = Array.from(desktopMenu.children).find((li) => {
    const link = li.querySelector('a[href*="products.html"]');
    return link && !link.href.includes("?");
  });

  if (!productsLi) return;

  const mainSubmenu = productsLi.querySelector(".sub-menu");
  if (!mainSubmenu) return;

  // Find Glyptic Special
  const glypticLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Glyptic Special");
  });

  if (glypticLi) {
    const glypticSubmenu = glypticLi.querySelector(".sub-menu");
    if (glypticSubmenu) {
      // Remove predefined items that no longer exist
      const existingItems = glypticSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/category=([^&]+)/);
        if (match) {
          const cat = match[1];
          if (
            predefinedCategories.includes(cat) &&
            !existingPredefinedCategories.includes(cat)
          ) {
            link.parentElement.remove();
          }
        }
      });

      // Add new categories
      newCategories.forEach((category) => {
        const li = document.createElement("li");
        const label = category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
        glypticSubmenu.appendChild(li);
      });
    }
  }

  // Find Authorize Partners
  const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Authorize Partners");
  });

  if (authorizeLi) {
    const authorizeSubmenu = authorizeLi.querySelector(".sub-menu");
    if (authorizeSubmenu) {
      // Remove predefined brands that no longer exist
      const existingItems = authorizeSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/brand=([^&]+)/);
        if (match) {
          const brandName = match[1];
          if (
            predefinedBrands.includes(brandName) &&
            !existingPredefinedBrands.includes(brandName)
          ) {
            link.parentElement.remove();
          }
        }
      });

      // Add new brands
      newBrands.forEach((brand) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
        authorizeSubmenu.appendChild(li);
      });
    }
  }
}

function updateMobileMenu(
  existingPredefinedCategories,
  existingPredefinedBrands,
  newCategories,
  newBrands,
) {
  const mobileMenu = document.querySelector(".th-mobile-menu > ul");
  if (!mobileMenu) return;

  const productsLi = Array.from(mobileMenu.children).find((li) => {
    const link = li.querySelector('a[href*="products.html"]');
    return link && !link.href.includes("?");
  });

  if (!productsLi) return;

  const mainSubmenu = productsLi.querySelector(".sub-menu");
  if (!mainSubmenu) return;

  // Find Glyptic Special
  const glypticLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Glyptic Special");
  });

  if (glypticLi) {
    const glypticSubmenu = glypticLi.querySelector(".sub-menu");
    if (glypticSubmenu) {
      // Remove predefined items that no longer exist
      const existingItems = glypticSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/category=([^&]+)/);
        if (match) {
          const cat = match[1];
          if (
            predefinedCategories.includes(cat) &&
            !existingPredefinedCategories.includes(cat)
          ) {
            link.parentElement.remove();
          }
        }
      });

      // Add new categories
      newCategories.forEach((category) => {
        const li = document.createElement("li");
        const label = category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
        glypticSubmenu.appendChild(li);
      });
    }
  }

  // Find Authorize Partners
  const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Authorize Partners");
  });

  if (authorizeLi) {
    const authorizeSubmenu = authorizeLi.querySelector(".sub-menu");
    if (authorizeSubmenu) {
      // Remove predefined brands that no longer exist
      const existingItems = authorizeSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/brand=([^&]+)/);
        if (match) {
          const brandName = match[1];
          if (
            predefinedBrands.includes(brandName) &&
            !existingPredefinedBrands.includes(brandName)
          ) {
            link.parentElement.remove();
          }
        }
      });

      // Add new brands
      newBrands.forEach((brand) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
        authorizeSubmenu.appendChild(li);
      });
    }
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateProductMenu);
} else {
  updateProductMenu();
}

/// old code here
// Dynamic Menu Generation for Products

// Predefined categories (Glyptic Special)
// const predefinedCategories = [
//   "fire-alarm", "digital-pa", "flame-smoke-camera", "dts-fo-lhs",
//   "fire-suppression", "linear-heat-cable", "smoke-detector-tester"
// ];

// // Predefined brands (Authorize Partners)
// const predefinedBrands = [
//   "Edwards", "Siemens", "Notifier", "Simplex", "TNA", "Farenhyt",
//   "ESSER", "Honeywell", "Apollo", "Ansul", "Kidde", "Blazecut",
//   "Kentec", "Wagner", "Bandweaver", "Securiton"
// ];

// async function updateProductMenu() {
//   try {
//     // Fetch categories and brands from API
//     const [categoriesRes, brandsRes] = await Promise.all([
//       fetch(`${API_CONFIG.API_BASE}/products/categories`),
//       fetch(`${API_CONFIG.API_BASE}/products/brands`)
//     ]);

//     const categories = await categoriesRes.json();
//     const brands = await brandsRes.json();

//     // Get new categories (not in predefined list)
//     const newCategories = categories.filter(cat =>
//       !predefinedCategories.includes(cat)
//     );

//     // Get new brands (not in predefined list)
//     const newBrands = brands.filter(brand =>
//       !predefinedBrands.includes(brand)
//     );

//     // Update desktop menu
//     updateDesktopMenu(newCategories, newBrands);

//     // Update mobile menu
//     updateMobileMenu(newCategories, newBrands);

//   } catch (error) {
//     console.error('Error updating product menu:', error);
//   }
// }

// function updateDesktopMenu(newCategories, newBrands) {
//   // Find desktop Glyptic Special submenu
//   const desktopMenu = document.querySelector('.main-menu > ul');
//   if (!desktopMenu) return;

//   const productsLi = Array.from(desktopMenu.children).find(li => {
//     const link = li.querySelector('a[href*="products.html"]');
//     return link && !link.href.includes('?');
//   });

//   if (!productsLi) return;

//   const mainSubmenu = productsLi.querySelector('.sub-menu');
//   if (!mainSubmenu) return;

//   // Find Glyptic Special
//   const glypticLi = Array.from(mainSubmenu.children).find(li => {
//     const link = li.querySelector('a');
//     return link && link.textContent.includes('Glyptic Special');
//   });

//   if (glypticLi) {
//     const glypticSubmenu = glypticLi.querySelector('.sub-menu');
//     if (glypticSubmenu) {
//       newCategories.forEach(category => {
//         const li = document.createElement('li');
//         const label = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
//         li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
//         glypticSubmenu.appendChild(li);
//       });
//     }
//   }

//   // Find Authorize Partners
//   const authorizeLi = Array.from(mainSubmenu.children).find(li => {
//     const link = li.querySelector('a');
//     return link && link.textContent.includes('Authorize Partners');
//   });

//   if (authorizeLi) {
//     const authorizeSubmenu = authorizeLi.querySelector('.sub-menu');
//     if (authorizeSubmenu) {
//       newBrands.forEach(brand => {
//         const li = document.createElement('li');
//         li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
//         authorizeSubmenu.appendChild(li);
//       });
//     }
//   }
// }

// function updateMobileMenu(newCategories, newBrands) {
//   // Find mobile menu
//   const mobileMenu = document.querySelector('.th-mobile-menu > ul');
//   if (!mobileMenu) return;

//   const productsLi = Array.from(mobileMenu.children).find(li => {
//     const link = li.querySelector('a[href*="products.html"]');
//     return link && !link.href.includes('?');
//   });

//   if (!productsLi) return;

//   const mainSubmenu = productsLi.querySelector('.sub-menu');
//   if (!mainSubmenu) return;

//   // Find Glyptic Special
//   const glypticLi = Array.from(mainSubmenu.children).find(li => {
//     const link = li.querySelector('a');
//     return link && link.textContent.includes('Glyptic Special');
//   });

//   if (glypticLi) {
//     const glypticSubmenu = glypticLi.querySelector('.sub-menu');
//     if (glypticSubmenu) {
//       newCategories.forEach(category => {
//         const li = document.createElement('li');
//         const label = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
//         li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
//         glypticSubmenu.appendChild(li);
//       });
//     }
//   }

//   // Find Authorize Partners
//   const authorizeLi = Array.from(mainSubmenu.children).find(li => {
//     const link = li.querySelector('a');
//     return link && link.textContent.includes('Authorize Partners');
//   });

//   if (authorizeLi) {
//     const authorizeSubmenu = authorizeLi.querySelector('.sub-menu');
//     if (authorizeSubmenu) {
//       newBrands.forEach(brand => {
//         const li = document.createElement('li');
//         li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
//         authorizeSubmenu.appendChild(li);
//       });
//     }
//   }
// }

// // Initialize on page load
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', updateProductMenu);
// } else {
//   updateProductMenu();
// }

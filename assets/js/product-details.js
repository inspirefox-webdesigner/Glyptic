/**
 * Product Details Loader
 * Loads and displays product details from the backend API
 */

const API_BASE_URL = `${API_CONFIG.API_BASE}`;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    loadProductDetails(productId);
  } else {
    showError("Product ID not found");
  }
});

/**
 * Load product details from API
 */
async function loadProductDetails(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error("Product not found");
    }

    const product = await response.json();
    renderProductDetails(product);
  } catch (error) {
    console.error("Error loading product details:", error);
    showError("Failed to load product details");
  }
}

/**
 * Render product details on the page
 */
function renderProductDetails(product) {
  // Update page title and breadcrumb
  document.title = `${product.title} - Glyptic`;
  const breadcrumbTitle = document.querySelector(".breadcumb-title");
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = product.title;
  }

  // Update product title
  const productTitle = document.getElementById("product-title");
  if (productTitle) {
    productTitle.textContent = product.title;
  }

  // Update main product image and thumbnails
  updateProductImages(product);

  // Update tab content
  updateTabContent(product);
}

/**
 * Update product images (main image and thumbnails)
 */
function updateProductImages(product) {
  const mainImage = document.getElementById("main-product-image");
  const thumbnailContainer = document.getElementById("image-thumbnails");

  // Get all images from product contents
  const images = [];

  // Add cover image if exists
  if (product.coverImage) {
    images.push(product.coverImage);
  }

  // Add variation images if exist
  if (product.variationImages && product.variationImages.length > 0) {
    images.push(...product.variationImages);
  }

  // Add images from contents
  product.contents?.forEach((content) => {
    if (content.type === "image" && content.data) {
      if (Array.isArray(content.data)) {
        images.push(...content.data);
      } else {
        images.push(content.data);
      }
    }
  });

  // Set main image
  if (images.length > 0 && mainImage) {
    mainImage.src = `${API_BASE_URL.replace("/api", "")}/uploads/${images[0]}`;
    mainImage.alt = product.title;
  }

  // Create thumbnails
  if (thumbnailContainer && images.length > 1) {
    thumbnailContainer.innerHTML = images
      .map(
        (image, index) => `
            <img src="${API_BASE_URL.replace("/api", "")}/uploads/${image}" 
                 alt="${product.title} ${index + 1}"
                 class="thumbnail-image"
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; margin-right: 10px;"
                 onclick="changeMainImage('${API_BASE_URL.replace(
                   "/api",
                   ""
                 )}/uploads/${image}')">
        `
      )
      .join("");
  }
}

/**
 * Change main product image
 */
function changeMainImage(imageSrc) {
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) {
    mainImage.src = imageSrc;
  }

  // Update thumbnail borders
  document.querySelectorAll(".thumbnail-image").forEach((thumb) => {
    thumb.style.border =
      thumb.src === imageSrc ? "2px solid #FF4F38" : "2px solid transparent";
  });
}

/**
 * Update tab content based on product data
 */
function updateTabContent(product) {
  // Update specification tab
  updateSpecificationTab(product);

  // Update video tab
  updateVideoTab(product);

  // Update tech specifications tab
  updateTechSpecificationsTab(product);

  // Update manual download tab
  updateManualDownloadTab(product);
}

/**
 * Update specification tab content
 */
function updateSpecificationTab(product) {
  const specContent = document.getElementById("specification-content");
  if (!specContent) return;

  let html = "";

  // Get specification content
  const specContents =
    product.contents?.filter((c) => c.type === "specification") || [];

  if (specContents.length > 0) {
    specContents.forEach((content) => {
      if (content.subType === "image" && content.data) {
        html += `<img src="${API_BASE_URL.replace("/api", "")}/uploads/${
          content.data
        }" alt="Specification" style="max-width: 100%; height: auto; margin-bottom: 20px;">`;
      } else if (content.data) {
        html += `<div class="mb-3">${content.data}</div>`;
      }
    });
  } else {
    html = "<p>No specifications available for this product.</p>";
  }

  specContent.innerHTML = html;
}

/**
 * Update video tab content
 */
function updateVideoTab(product) {
  const videoContent = document.getElementById("video-content");
  if (!videoContent) return;

  let html = "";

  // Get video content
  const videoContents =
    product.contents?.filter((c) => c.type === "video") || [];

  if (videoContents.length > 0) {
    videoContents.forEach((content) => {
      if (content.data) {
        html += `
                    <video controls style="width: 100%; max-width: 600px; margin-bottom: 20px;">
                        <source src="${API_BASE_URL.replace("/api", "")}/${
          content.data
        }" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
      }
    });
  } else {
    html = "<p>No videos available for this product.</p>";
  }

  videoContent.innerHTML = html;
}

/**
 * Update tech specifications tab content
 */
function updateTechSpecificationsTab(product) {
  const techSpecContent = document.getElementById(
    "tech-specifications-content"
  );
  if (!techSpecContent) return;

  let html = "";

  // Get tech specifications and table content
  const techSpecContents =
    product.contents?.filter(
      (c) => c.type === "techSpecifications" || c.type === "table"
    ) || [];

  if (techSpecContents.length > 0) {
    techSpecContents.forEach((content) => {
      if (content.type === "table" && content.data) {
        html += generateTable(content.data);
      } else if (content.data) {
        html += `<div class="mb-3">${content.data}</div>`;
      }
    });
  } else {
    html = "<p>No technical specifications available for this product.</p>";
  }

  techSpecContent.innerHTML = html;
}

/**
 * Generate HTML table from table data
 */
function generateTable(tableData) {
  if (!tableData.headers || !tableData.rows) return "";

  let html = '<table class="table table-bordered table-striped mb-4">';

  // Add headers
  html += '<thead class="table-dark"><tr>';
  tableData.headers.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += "</tr></thead>";

  // Add rows
  html += "<tbody>";
  tableData.rows.forEach((row) => {
    html += "<tr>";
    row.forEach((cell) => {
      html += `<td>${cell}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";

  return html;
}

/**
 * Update manual download tab content
 */
function updateManualDownloadTab(product) {
  const manualContent = document.getElementById("manual-download-content");
  if (!manualContent) return;

  let html = "";

  // Get manual download content
  const manualContents =
    product.contents?.filter((c) => c.type === "manualDownload") || [];

  if (manualContents.length > 0) {
    manualContents.forEach((content) => {
      if (content.data) {
        if (content.data.startsWith("uploads/")) {
          // Uploaded PDF file
          const filename = content.data
            .replace("uploads/", "")
            .replace(/^\d+-\d+-/, "");
          html += `
                        <div class="manual-download-item mb-3">
                            <div class="d-flex align-items-center gap-3 p-3 border rounded">
                                <i class="fas fa-file-pdf text-danger" style="font-size: 2rem;"></i>
                                <div>
                                    <h5 class="mb-1">Product Manual</h5>
                                    <p class="mb-2 text-muted">${filename}</p>
                                    <a href="${API_BASE_URL.replace(
                                      "/api",
                                      ""
                                    )}/${content.data}" 
                                       class="btn btn-primary btn-sm" 
                                       target="_blank" 
                                       download>
                                        <i class="fas fa-download me-1"></i> Download PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
        } else {
          // External URL
          html += `
                        <div class="manual-download-item mb-3">
                            <div class="d-flex align-items-center gap-3 p-3 border rounded">
                                <i class="fas fa-external-link-alt text-primary" style="font-size: 2rem;"></i>
                                <div>
                                    <h5 class="mb-1">Product Manual</h5>
                                    <p class="mb-2 text-muted">External PDF Link</p>
                                    <a href="${content.data}" 
                                       class="btn btn-primary btn-sm" 
                                       target="_blank">
                                        <i class="fas fa-external-link-alt me-1"></i> View PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
        }
      }
    });
  } else {
    html = "<p>No manual downloads available for this product.</p>";
  }

  manualContent.innerHTML = html;
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.querySelector(".container");
  if (container) {
    container.innerHTML = `
            <div class="alert alert-danger text-center" style="margin: 50px 0;">
                <h4>Error</h4>
                <p>${message}</p>
                <a href="products.html" class="btn btn-primary">Back to Products</a>
            </div>
        `;
  }
}

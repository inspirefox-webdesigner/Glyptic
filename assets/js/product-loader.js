// Product loader for dynamic content
class ProductLoader {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.init();
  }
 
  async init() {
    // Load products if on addressable fire alarm page
    if (window.location.pathname.includes('addressable-fire-alarm.html')) {
      await this.loadProducts();
    }
 
    // Load single product if on product details page
    if (window.location.pathname.includes('product-details.html')) {
      await this.loadProductDetails();
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
 
  async loadProductDetails() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');
 
      if (!productId) {
        console.error('No product ID provided');
        return;
      }
 
      const response = await fetch(`${this.apiBase}/products/${productId}`);
      const product = await response.json();
      this.renderProductDetails(product);
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }
 
  renderProducts(products) {
    // Group products by category
    const categorizedProducts = {
      'fire-alarm': products.filter(p => p.category === 'fire-alarm'),
      'other-products': products.filter(p => p.category === 'other-products'),
      'fire-suppression': products.filter(p => p.category === 'fire-suppression')
    };
 
    // Clear all tabs first - remove static content
    for (let i = 1; i <= 9; i++) {
      const tab = document.getElementById(`content-${i}`);
      if (tab) {
        const container = tab.querySelector('.container .row');
        if (container) container.innerHTML = '';
      }
    }
 
    // Render fire alarm products (Tab 1)
    this.renderProductsInTab('content-1', categorizedProducts['fire-alarm']);
 
    // Render other products in their respective tabs
    this.renderProductsInTab('content-3', categorizedProducts['other-products']);
    this.renderProductsInTab('content-8', categorizedProducts['fire-suppression']);
  }
 
  renderProductsInTab(tabId, products) {
    const tabContent = document.getElementById(tabId);
    if (!tabContent) return;
 
    const container = tabContent.querySelector('.container .row');
    if (!container) return;
 
    // Clear existing content and show only dynamic products
    container.innerHTML = '';
 
    products.forEach(product => {
      const productCard = this.createProductCard(product);
      container.appendChild(productCard);
    });
  }
 
  createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
 
    // Get the first image from product contents (handle arrays)
    const firstImageContent = product.contents.find(content => content.type === 'image');
    let imageUrl = 'assets/img/product/Fire-Alarm-System-fire-Alarm-Control-Panel-addressable-Fire-Detection.jpg';
 
    if (firstImageContent) {
      const imageData = Array.isArray(firstImageContent.data) ? firstImageContent.data[0] : firstImageContent.data;
      if (imageData) {
        imageUrl = `${this.apiBase.replace('/api', '')}/uploads/${imageData}`;
      }
    }
 
    col.innerHTML = `
      <a href="product-details.html?id=${product._id}" class="card" style="text-decoration: none; color: inherit;">
        <img src="${imageUrl}"
             class="card-img-top"
             alt="${product.title}"
             style="border-radius: 8px; border: none; height: 250px; object-fit: cover;"
             onerror="this.src='assets/img/product/Fire-Alarm-System-fire-Alarm-Control-Panel-addressable-Fire-Detection.jpg'" />
        <div class="card-body">
          <p class="card-text" style="font-weight: 600; color: #333; margin: 0;">${product.title}</p>
        </div>
      </a>
    `;
 
    return col;
  }
 
  renderProductDetails(product) {
    // Update page title
    const breadcrumbTitle = document.querySelector('.breadcumb-title');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = product.title;
    }
 
    // Update product title in details section
    const productTitle = document.querySelector('.box-title');
    if (productTitle) {
      productTitle.textContent = product.title;
    }
 
    // Render carousel images
    this.renderProductImages(product);
 
    // Render product content
    this.renderProductContent(product);
 
    // Render specification and description tabs
    this.renderProductTabs(product);
  }
 
  renderProductImages(product) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailContainer = document.getElementById('image-thumbnails');
 
    if (!mainImage || !thumbnailContainer) return;
 
    // Get all images from product contents
    const imageContents = product.contents.filter(content => content.type === 'image');
    let allImages = [];
 
    // Process images (handle both single images and arrays)
    imageContents.forEach(content => {
      if (Array.isArray(content.data)) {
        allImages.push(...content.data);
      } else if (content.data) {
        allImages.push(content.data);
      }
    });
 
    if (allImages.length === 0) {
      // Show default image
      mainImage.src = 'assets/img/product/Fire-Alarm-System-fire-Alarm-Control-Panel-addressable-Fire-Detection.jpg';
      thumbnailContainer.innerHTML = '';
      return;
    }
 
    // Set first image as main image
    mainImage.src = `${this.apiBase.replace('/api', '')}/uploads/${allImages[0]}`;
    mainImage.alt = product.title;
 
    // Clear thumbnails
    thumbnailContainer.innerHTML = '';
 
    // Create thumbnails for all images
    allImages.forEach((imageName, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = `${this.apiBase.replace('/api', '')}/uploads/${imageName}`;
      thumbnail.alt = `${product.title} - Image ${index + 1}`;
      thumbnail.className = `thumbnail-image ${index === 0 ? 'active' : ''}`;
 
      // Add click event to change main image
      thumbnail.addEventListener('click', () => {
        mainImage.src = thumbnail.src;
 
        // Update active thumbnail
        document.querySelectorAll('.thumbnail-image').forEach(thumb => {
          thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
      });
 
      thumbnailContainer.appendChild(thumbnail);
    });
  }
 
  renderProductContent(product) {
    // Find the main product row
    const productRow = document.querySelector('.space .container .row');
    if (!productRow) return;
 
    // Get content blocks (excluding title, images, specification, video, techSpecifications)
    const contentBlocks = product.contents.filter(content => content.type === 'content');
 
    if (contentBlocks.length === 0) return;
 
    // Find the right column (beside image)
    const rightCol = productRow.querySelector('.col-md-6:last-child');
    if (!rightCol) return;
 
    // Move Contact Now button to end
    const contactBtn = rightCol.querySelector('.th-btn');
    if (contactBtn) {
      contactBtn.remove();
    }
 
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'product-content-wrapper';
    contentWrapper.style.marginTop = '2rem';
    contentWrapper.style.overflow = 'visible';
 
    // Add content blocks
    contentBlocks.forEach(content => {
      const element = this.createContentElement(content);
      contentWrapper.appendChild(element);
    });
 
    // Add Contact Now button at the end
    if (contactBtn) {
      contactBtn.style.marginTop = '2rem';
      contentWrapper.appendChild(contactBtn);
    }
 
    // Append to right column
    rightCol.appendChild(contentWrapper);
  }
 
  createContentElement(content) {
    let element;
 
    switch (content.type) {
      case 'content':
        element = document.createElement('div');
        element.innerHTML = this.processContentHTML(content.data);
        element.style.marginBottom = '1.5rem';
        element.style.textAlign = 'justify';
        element.style.lineHeight = '1.6';
        element.style.fontSize = '14px';
        break;
 
      case 'title':
        element = document.createElement('h4');
        element.textContent = content.data;
        element.style.marginBottom = '1rem';
        element.style.color = '#667eea';
        element.style.fontWeight = '600';
        break;
 
      default:
        element = document.createElement('div');
        element.textContent = content.data;
    }
 
    return element;
  }
 
  processContentHTML(html) {
    // Ensure proper styling for content
    html = html.replace(/<p([^>]*)>/gi, '<p$1 style="text-align: justify; margin-bottom: 0.8rem; font-size: 14px;">');
    html = html.replace(/<h1([^>]*)>/gi, '<h6$1 style="margin-top: 1rem; margin-bottom: 0.5rem; color: #333; font-size: 16px;">');
    html = html.replace(/<\/h1>/gi, '</h6>');
    html = html.replace(/<h2([^>]*)>/gi, '<h6$1 style="margin-top: 1rem; margin-bottom: 0.5rem; color: #333; font-size: 15px;">');
    html = html.replace(/<\/h2>/gi, '</h6>');
 
    return html;
  }
 
  renderProductTabs(product) {
    // Find specification content from contents array
    const specificationContent = document.getElementById('specification-content');
    if (specificationContent) {
      const specContents = product.contents
        .filter(content => content.type === 'specification')
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order
 
      if (specContents.length > 0) {
        let specHTML = '';
        specContents.forEach((specContent, index) => {
          if (specContent.data && specContent.data.trim()) {
            // Check if it's an image by subType or by file extension
            const isImage = specContent.subType === 'image' ||
              specContent.data.match(/\.(jpg|jpeg|png|gif|webp|jfif)$/i);
 
            if (isImage) {
              specHTML += `<div style="margin-bottom: 1.5rem; text-align: center;">
                <img src="${this.apiBase.replace('/api', '')}/uploads/${specContent.data}"
                     style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                     alt="Specification Image"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div style="display: none; padding: 1rem; background: #f8f9fa; border-radius: 8px; color: #6c757d;">
                  <i class="fas fa-image"></i> Image not available: ${specContent.data}
                </div>
              </div>`;
            } else {
              specHTML += this.processTabContentHTML(specContent.data);
            }
          }
        });
        specificationContent.innerHTML = specHTML || '<p style="color: #6c757d; font-style: italic;">No specification available for this product.</p>';
      } else {
        specificationContent.innerHTML = '<p style="color: #6c757d; font-style: italic;">No specification available for this product.</p>';
      }
    }

     // Find video content from contents array
    const videoContent = document.getElementById('video-content');
    if (videoContent) {
      const videoContentData = product.contents.find(content => content.type === 'video');
      if (videoContentData && videoContentData.data && videoContentData.data.trim()) {
        videoContent.innerHTML = this.processVideoContent(videoContentData.data);
      } else {
        videoContent.innerHTML = '<p style="color: #6c757d; font-style: italic;">No video available for this product.</p>';
      }
    }
 
    // Find tech specifications content from contents array
    const techSpecificationsContent = document.getElementById('tech-specifications-content');
    if (techSpecificationsContent) {
      const techSpecContents = product.contents
        .filter(content => content.type === 'techSpecifications' || content.type === 'table')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
 
      if (techSpecContents.length > 0) {
        let techSpecHTML = '';
        techSpecContents.forEach(content => {
          if (content.type === 'table' && content.data) {
            techSpecHTML += this.renderTable(content.data);
          } else if (content.type === 'techSpecifications' && content.data && content.data.trim()) {
            techSpecHTML += this.processTabContentHTML(content.data);
          }
        });
        techSpecificationsContent.innerHTML = techSpecHTML || '<p style="color: #6c757d; font-style: italic;">No tech specifications available for this product.</p>';
      } else {
        techSpecificationsContent.innerHTML = '<p style="color: #6c757d; font-style: italic;">No tech specifications available for this product.</p>';
      }
    }
 
    // Find manual download content from contents array
    const manualDownloadContent = document.getElementById('manual-download-content');
    if (manualDownloadContent) {
      const manualContent = product.contents.find(content => content.type === 'manualDownload');
      if (manualContent && manualContent.data && manualContent.data.trim()) {
        manualDownloadContent.innerHTML = this.processManualDownloadContent(manualContent.data);
      } else {
        manualDownloadContent.innerHTML = `
          <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px;">
            <i class="fas fa-file-pdf" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p style="color: #6c757d; font-style: italic; margin: 0;">No manual download available for this product.</p>
          </div>
        `;
      }
    }
  }
 
  processVideoContent(videoUrl) {
    if (!videoUrl || videoUrl.trim() === '') return '';
 
    // Uploaded video file processing
    if (videoUrl.startsWith('uploads/')) {
      return `
        <div class="video-container" style="width: 100%; margin-bottom: 1rem;">
          <video
            controls
            autoplay
            muted
            style="width: 100%; height: auto; border-radius: 8px;"
          >
            <source src="${this.apiBase.replace('/api', '')}/${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }
 
    // YouTube video processing
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      }
 
      if (videoId) {
        return `
          <div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin-bottom: 1rem;">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        `;
      }
    }
 
    // Vimeo video processing
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
      if (videoId) {
        return `
          <div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin-bottom: 1rem;">
            <iframe
              src="https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        `;
      }
    }
 
    // Direct video file processing
    if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return `
        <div class="video-container" style="width: 100%; margin-bottom: 1rem;">
          <video
            controls
            autoplay
            muted
            style="width: 100%; height: auto; border-radius: 8px;"
          >
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }
 
    // Fallback for other URLs
    return `
      <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 8px; margin-bottom: 1rem;">
        <p style="margin-bottom: 1rem; color: #6c757d;">Video Link:</p>
        <a href="${videoUrl}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">
          ${videoUrl}
        </a>
      </div>
    `;
  }
 
  processManualDownloadContent(pdfData) {
    if (!pdfData || pdfData.trim() === '') return '';
 
    // Determine if it's an uploaded file or URL
    const isUploadedFile = pdfData.startsWith('uploads/');
    let pdfUrl, downloadUrl;
 
    if (isUploadedFile) {
      const filename = pdfData.split('/').pop();
      pdfUrl = `${this.apiBase.replace('/api', '')}/${pdfData}`;
      downloadUrl = `${this.apiBase}/download/${filename}`;
    } else {
      pdfUrl = pdfData;
      downloadUrl = pdfData;
    }
 
    // Get filename for display
    let displayName = 'Manual';
    if (isUploadedFile) {
      displayName = pdfData.split('/').pop().replace(/^\d+-\d+-/, ''); // Remove timestamp prefix
    } else {
      displayName = pdfUrl.split('/').pop() || 'Manual';
    }
 
    return `
      <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px;">
        <div style="margin-bottom: 1rem;">
          <i class="fas fa-file-pdf" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
          <h5 style="color: #495057; margin-bottom: 0.5rem;">Product Manual</h5>
          <p style="color: #6c757d; margin-bottom: 1.5rem; font-size: 14px;">${displayName}</p>
        </div>
        <a
          href="${downloadUrl}"
          ${isUploadedFile ? 'download' : 'target="_blank"'}
          class="th-btn style2"
          style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;"
        >
          <i class="fas fa-download"></i>
          Download Manual
        </a>
      </div>
    `;
  }
 
  renderTable(tableData) {
    if (!tableData || !tableData.headers || !tableData.rows) {
      return '';
    }
 
    let tableHTML = `
      <div class="table-responsive" style="margin-bottom: 2rem;">
        <table class="table table-striped table-bordered" style="margin-bottom: 0; width: 100%;">
          <thead>
            <tr>
    `;
 
    // Render headers
    tableData.headers.forEach(header => {
      tableHTML += `<th style="background-color: #667eea; color: white; padding: 0.75rem; font-weight: 600; text-align: center;">${header || ''}</th>`;
    });
 
    tableHTML += `
            </tr>
          </thead>
          <tbody>
    `;
 
    // Render rows
    tableData.rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td style="padding: 0.75rem; color: #6c757d; border: 1px solid #dee2e6; vertical-align: middle;">${cell || ''}</td>`;
      });
      tableHTML += '</tr>';
    });
 
    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
 
    return tableHTML;
  }
 
  processTabContentHTML(html) {
    // Process HTML for tab content with better styling
    if (!html || html.trim() === '') return '';
 
    // Remove empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/gi, '');
    html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
 
    // Style paragraphs
    html = html.replace(/<p([^>]*)>/gi, '<p$1 style="margin-bottom: 1rem; line-height: 1.6; color: #6c757d;">');
 
    // Style headers
    html = html.replace(/<h1([^>]*)>/gi, '<h4$1 style="color: #667eea; margin-bottom: 1rem; font-weight: 600;">');
    html = html.replace(/<\/h1>/gi, '</h4>');
    html = html.replace(/<h2([^>]*)>/gi, '<h5$1 style="color: #667eea; margin-bottom: 0.8rem; font-weight: 600;">');
    html = html.replace(/<\/h2>/gi, '</h5>');
    html = html.replace(/<h3([^>]*)>/gi, '<h6$1 style="color: #667eea; margin-bottom: 0.6rem; font-weight: 600;">');
    html = html.replace(/<\/h3>/gi, '</h6>');
 
    // Style lists
    html = html.replace(/<ul([^>]*)>/gi, '<ul$1 style="margin-bottom: 1rem; padding-left: 1.5rem;">');
    html = html.replace(/<ol([^>]*)>/gi, '<ol$1 style="margin-bottom: 1rem; padding-left: 1.5rem;">');
    html = html.replace(/<li([^>]*)>/gi, '<li$1 style="margin-bottom: 0.5rem; color: #6c757d;">');
 
    // Style images
    html = html.replace(/<img([^>]*)>/gi, '<img$1 style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">');
 
    // Style tables
    html = html.replace(/<table([^>]*)>/gi, '<table$1 class="table table-striped table-bordered" style="margin-bottom: 1rem; width: 100%;">');
    html = html.replace(/<th([^>]*)>/gi, '<th$1 style="background-color: #667eea; color: white; padding: 0.75rem; font-weight: 600;">');
    html = html.replace(/<td([^>]*)>/gi, '<td$1 style="padding: 0.75rem; color: #6c757d; border: 1px solid #dee2e6;">');
 
    // Style strong/bold text
    html = html.replace(/<strong([^>]*)>/gi, '<strong$1 style="color: #495057; font-weight: 600;">');
    html = html.replace(/<b([^>]*)>/gi, '<b$1 style="color: #495057; font-weight: 600;">');
 
    return `<div style="margin-bottom: 1.5rem;">${html}</div>`;
  }
}
 
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductLoader();
});
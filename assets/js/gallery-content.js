// Gallery content loader
document.addEventListener('DOMContentLoaded', function () {
    loadGallery();
});

async function loadGallery() {
    try {
        const response = await fetch(`${API_CONFIG.API_BASE}/gallery`);
        const images = await response.json();

        const galleryContainer = document.getElementById('gallery-sec');
        if (!galleryContainer) return;

        const galleryGrid = galleryContainer.querySelector('.row');
        if (!galleryGrid) return;

        // Clear existing static content
        galleryGrid.innerHTML = '';

        if (images.length === 0) {
            galleryGrid.innerHTML = `
                <div class="col-12">
                    <div class="text-center">
                        <h3>No images available</h3>
                        <p>Check back later for new gallery images.</p>
                    </div>
                </div>
            `;
            return;
        }

        images.forEach(image => {
            const galleryItem = createGalleryItem(image);
            galleryGrid.appendChild(galleryItem);
        });

    } catch (error) {
        console.error('Error loading gallery:', error);
        const galleryContainer = document.getElementById('gallery-sec');
        if (galleryContainer) {
            const galleryGrid = galleryContainer.querySelector('.row');
            if (galleryGrid) {
                galleryGrid.innerHTML = `
                    <div class="col-12">
                        <div class="text-center">
                            <h3>Unable to load gallery</h3>
                            <p>Please try again later.</p>
                        </div>
                    </div>
                `;
            }
        }
    }
}

function createGalleryItem(image) {
    const col = document.createElement('div');
    col.className = 'col-4';

    const imageUrl = `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${image.filename}`;

    col.innerHTML = `
        <a href="${imageUrl}" data-fancybox="gallery" class="gallery-item">
            <img src="${imageUrl}" alt="${image.originalName}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
        </a>
    `;

    return col;
}
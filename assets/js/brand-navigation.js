// Brand Navigation Handler for index.html
const BRAND_MAPPING = {
    '1.jpg': 'Ansul',
    '2.jpg': 'Ware',
    '3.jpg': 'Est',
    '4.jpg': 'ESSER',
    '5.jpg': 'Farenhyt',
    '6.jpg': 'Fipron',
    '7.jpg': 'Glyptic'
};

// Initialize brand click handlers
document.addEventListener('DOMContentLoaded', function() {
    const brandSlider = document.getElementById('brandSlider1');
    
    if (brandSlider) {
        brandSlider.addEventListener('click', function(e) {
            const brandBox = e.target.closest('.brand-box');
            
            if (brandBox) {
                e.preventDefault();
                
                const img = brandBox.querySelector('img');
                if (img) {
                    const imgSrc = img.getAttribute('src');
                    const imgName = imgSrc.split('/').pop();
                    const brandName = BRAND_MAPPING[imgName];
                    
                    if (brandName) {
                        // Navigate to products page with brand filter
                        window.location.href = `products.html?brand=${encodeURIComponent(brandName)}`;
                    }
                }
            }
        });
    }
});

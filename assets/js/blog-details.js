// Blog Details Dynamic Content Loader
document.addEventListener('DOMContentLoaded', function () {
    loadBlogDetails();
});

function loadBlogDetails() {
    // Get blog ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const contentContainer = document.getElementById('blog-details-content');

    if (!blogId) {
        // Show default content if no ID provided
        showDefaultContent(contentContainer);
        return;
    }

    // Try to fetch from backend API first
    fetchBlogFromAPI(blogId, contentContainer);
}

async function fetchBlogFromAPI(blogId, container) {
    try {
        const response = await fetch(`${API_CONFIG.API_BASE}/blogs/${blogId}`);
        if (response.ok) {
            const blog = await response.json();
            displayBlogContent(blog, container);
        } else {
            throw new Error('Blog not found in API');
        }
    } catch (error) {
        console.log('API not available, showing error message');
        container.innerHTML = `
            <div class="text-center">
                <h3>Blog Not Found</h3>
                <p>The requested blog post could not be found. Please check the URL or return to the <a href="blog-2.html">blog listing page</a>.</p>
            </div>
        `;
    }
}

function displayBlogContent(blog, container) {
    // Build content from dynamic content blocks if available
    let contentHTML = '';
    if (blog.contents && Array.isArray(blog.contents)) {
        blog.contents.sort((a, b) => a.order - b.order).forEach(content => {
            switch (content.type) {
                case 'title':
                    contentHTML += `<h3>${content.data}</h3>`;
                    break;
                case 'image':
                    contentHTML += `<div class="blog-image mb-4"><img src="${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${content.data}" alt="Blog Image" style="width: 100%; max-width: 1000px; height: 500px; object-fit: cover;" class="img-fluid rounded-5"></div>`;
                    break;
                case 'content':
                    contentHTML += `<div class="blog-content-block">${content.data}</div>`;
                    break;
            }
        });
    } else {
        // Fallback to simple content
        contentHTML = blog.content || blog.description || '';
    }

    container.innerHTML = `
        <h2 class="blog-title">${blog.title}</h2>
        <div class="blog-text">
            ${contentHTML}
        </div>
    `;
}

function showSampleBlogContent(blogId, container) {
    // Sample blog data for demonstration
    const sampleBlogs = {
        '1': {
            title: 'Latest Fire Safety Technologies in 2024',
            content: `
                <p>The fire safety industry continues to evolve with cutting-edge technologies that enhance protection and response capabilities. In 2024, we're seeing remarkable advancements that are revolutionizing how we approach fire detection and suppression.</p>
                
                <h3>Smart Detection Systems</h3>
                <p>Modern fire detection systems now incorporate artificial intelligence and machine learning algorithms to reduce false alarms while improving response times. These systems can differentiate between actual fire threats and common false triggers like cooking smoke or steam.</p>
                
                <h3>IoT Integration</h3>
                <p>Internet of Things (IoT) connectivity allows fire safety systems to communicate with building management systems, providing real-time monitoring and predictive maintenance capabilities.</p>
                
                <h3>Advanced Suppression Technologies</h3>
                <p>New suppression agents and delivery methods are being developed to provide more effective fire suppression while minimizing environmental impact and property damage.</p>
                
                <p>At Glyptic, we stay at the forefront of these technological advances, ensuring our clients have access to the most effective and reliable fire safety solutions available.</p>
            `
        },
        '2': {
            title: 'Fire Safety Training: Best Practices for Industrial Settings',
            content: `
                <p>Proper fire safety training is crucial for maintaining a safe industrial environment. Regular training sessions ensure that all personnel know how to respond effectively in case of a fire emergency.</p>
                
                <h3>Key Training Components</h3>
                <ul>
                    <li>Fire prevention techniques</li>
                    <li>Emergency evacuation procedures</li>
                    <li>Proper use of fire extinguishers</li>
                    <li>Communication protocols during emergencies</li>
                </ul>
                
                <h3>Regular Drills and Updates</h3>
                <p>Conducting regular fire drills helps identify potential issues with evacuation routes and ensures all staff members are familiar with emergency procedures.</p>
                
                <p>Glyptic offers comprehensive fire safety training programs tailored to your specific industrial needs.</p>
            `
        }
    };

    const blog = sampleBlogs[blogId] || sampleBlogs['1'];
    displayBlogContent(blog, container);
}

function showDefaultContent(container) {
    container.innerHTML = `
        <h2 class="blog-title">Welcome to Glyptic Blog</h2>
        <div class="blog-text">
            <p>Welcome to the Glyptic blog section. Here you'll find the latest news, insights, and updates about fire safety technologies, industry trends, and our services.</p>
            
            <h3>What You'll Find Here</h3>
            <ul>
                <li>Latest fire safety technology updates</li>
                <li>Industry news and insights</li>
                <li>Training tips and best practices</li>
                <li>Company announcements</li>
                <li>Case studies and success stories</li>
            </ul>
            
            <p>Stay tuned for regular updates and valuable content that will help you stay informed about the fire safety industry.</p>
            
            <p>To view a specific blog post, add <code>?id=1</code> or <code>?id=2</code> to the URL to see sample content.</p>
        </div>
    `;
}
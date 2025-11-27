// Blog content loader
document.addEventListener("DOMContentLoaded", function () {
  loadBlogs();
});

async function loadBlogs() {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE}/blogs`);
    const blogs = await response.json();

    const container = document.getElementById("blogContainer");

    if (blogs.length === 0) {
      container.innerHTML = `
                <div class="col-12 text-center">
                    <p>No blogs available at the moment.</p>
                </div>
            `;
      return;
    }

    let blogHTML = "";
    blogs.forEach((blog) => {
      const firstImage = blog.contents.find(
        (content) => content.type === "image"
      );
      const excerpt = blog.contents.find(
        (content) => content.type === "content"
      );

      blogHTML += `
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="blog-box h-100 d-flex flex-column">
                        <div class="blog-img" style="cursor: pointer;" onclick="window.location.href='blog-detail.html?id=${
                          blog._id
                        }'">
                            <img src="${
                              firstImage
                                ? `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${firstImage.data}`
                                : "assets/img/blog/default-blog.jpg"
                            }" alt="${
        blog.title
      }" style="width: 100%; height: 250px; object-fit: cover;">
                        </div>
                        <div class="blog-content flex-grow-1 d-flex flex-column">
                            <div class="blog-meta">
                                <a href="#"><i class="far fa-calendar"></i>${new Date(
                                  blog.createdAt
                                ).toLocaleDateString()}</a>
                            </div>
                            <h3 class="box-title flex-grow-1"><a href="blog-detail.html?id=${
                              blog._id
                            }">${blog.title}</a></h3>
                            <p class="blog-text">${
                              excerpt
                                ? excerpt.data
                                    .replace(/<[^>]*>/g, "")
                                    .substring(0, 100) + "..."
                                : "Read more about this blog post..."
                            }</p>
                            <a href="blog-detail.html?id=${
                              blog._id
                            }" class="th-btn mt-auto">Read More<i class="fas fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
            `;
    });

    container.innerHTML = blogHTML;

    // Add CSS for equal height cards
    const style = document.createElement("style");
    style.textContent = `
            .blog-box {
                height: 100%;
                transition: transform 0.3s ease;
            }
            .blog-box:hover {
                transform: translateY(-5px);
            }
            .blog-img {
                overflow: hidden;
                border-radius: 8px 8px 0 0;
            }
            .blog-img img {
                transition: transform 0.3s ease;
            }
            .blog-img:hover img {
                transform: scale(1.05);
            }
        `;
    document.head.appendChild(style);
    container.innerHTML = blogHTML;
  } catch (error) {
    console.error("Error loading blogs:", error);
    document.getElementById("blogContainer").innerHTML = `
            <div class="col-12 text-center">
                <p>Error loading blogs. Please try again later.</p>
            </div>
        `;
  }
}

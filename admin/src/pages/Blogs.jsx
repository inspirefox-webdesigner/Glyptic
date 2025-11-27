import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";
import API_BASE_URL from '../config/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setToast({ show: true, message: "Error fetching blogs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_BASE_URL}/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setToast({
          show: true,
          message: "Blog deleted successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting blog:", error);
        setToast({ show: true, message: "Error deleting blog", type: "error" });
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="page-header">
        <h1 className="page-title">Blogs</h1>
        <Link to="/blogs/new" className="btn btn-primary">
          Add New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No Blogs Found</h3>
            <p>Create your first blog to get started!</p>
            <Link to="/blogs/new" className="btn btn-primary">
              Create First Blog
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: "100%", margin: "20px 0" }}>
          <div className="card-body" style={{ padding: "25px" }}>
            <div className="table-responsive" style={{ width: "100%" }}>
              <table
                className="table table-striped"
                style={{ width: "100%", color: "#000000" }}
              >
                <thead>
                  <tr style={{ color: "#000000", backgroundColor: "#f8f9fa" }}>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      No.
                    </th>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Image
                    </th>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Content
                    </th>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, index) => {
                    const firstImage = blog.contents.find(
                      (c) => c.type === "image"
                    );
                    const contentText = blog.contents
                      .filter((c) => c.type === "content")
                      .map((c) => c.data.replace(/<[^>]*>/g, ""))
                      .join(" ");

                    return (
                      <tr key={blog._id} style={{ color: "#000000" }}>
                        <td
                          style={{
                            color: "#000000",
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          <h1
                            style={{
                              fontSize: "1.2rem",
                              margin: 0,
                              color: "#000000",
                              fontWeight: "600",
                            }}
                          >
                            {blog.title.length > 30
                              ? `${blog.title.substring(0, 30)}...`
                              : blog.title}
                          </h1>
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          {firstImage ? (
                            <img
                              src={`${API_BASE_URL.replace('/api','')}/uploads/${firstImage.data}`}
                              alt="Blog"
                              style={{
                                width: "60px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            <span style={{ color: "#000000" }}>No Image</span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "300px",
                              color: "#000000",
                              lineHeight: "1.4",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {contentText.length > 80
                              ? `${contentText.substring(0, 80)}...`
                              : contentText || "No content"}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <Link
                              to={`/blogs/edit/${blog._id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ marginBottom: "5px" }}
                            >
                              ✏️ Edit
                            </Link>
                            <button
                              onClick={() => deleteBlog(blog._id)}
                              className="btn btn-danger btn-sm"
                              style={{ marginBottom: "5px" }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;

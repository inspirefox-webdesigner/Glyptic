import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      "fire-alarm": "Fire Alarm System",
      "other-products": "Other Products",
      "fire-suppression": "Fire Suppression System",
    };
    return categories[category] || category;
  };

  if (loading)
    return <div className="loading-spinner">Loading Products...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <Link to="/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No Products Found</h3>
            <p>Create your first product to get started!</p>
            <Link to="/products/new" className="btn btn-primary">
              Create First Product
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
                      Category
                    </th>
                    <th
                      style={{
                        color: "#000000",
                        padding: "15px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Brand
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
                  {products.map((product, index) => {
                    const contentText = product.contents
                      .filter((c) => c.type === "content")
                      .map((c) => c.data.replace(/<[^>]*>/g, ""))
                      .join(" ");

                    return (
                      <tr key={product._id} style={{ color: "#000000" }}>
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
                            {product.title.length > 30
                              ? `${product.title.substring(0, 30)}...`
                              : product.title}
                          </h1>
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                            color: "#000000",
                          }}
                        >
                          {product.category ? getCategoryName(product.category) : "-"}
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                            color: "#000000",
                          }}
                        >
                          {product.brand || "-"}
                        </td>
                        <td
                          style={{
                            padding: "15px 10px",
                            verticalAlign: "middle",
                          }}
                        >
                          {(() => {
                            const coverImageContent = product.contents.find(
                              (c) => c.type === "coverImage"
                            );
                            const coverImageSrc =
                              coverImageContent?.data || product.coverImage;
                            return coverImageSrc ? (
                              <img
                                src={`http://localhost:5000/uploads/${coverImageSrc}`}
                                alt="Product Cover"
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <span style={{ color: "#000000" }}>
                                No Cover Image
                              </span>
                            );
                          })()}
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
                              to={`/products/edit/${product._id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ marginBottom: "5px" }}
                            >
                              ✏️ Edit
                            </Link>
                            <button
                              onClick={() => deleteProduct(product._id)}
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

export default Products;

import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Toast from "../components/Toast";
import "./ProductOrdering.css";
import { Link } from "react-router-dom";

const ProductOrdering = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedType, setSelectedType] = useState("category");
  const [selectedValue, setSelectedValue] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedValue) {
      fetchProducts();
    }
  }, [selectedValue, selectedType]);

  const fetchOptions = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products/categories`),
        axios.get(`${API_BASE_URL}/products/brands`),
      ]);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const filtered = response.data.filter((p) =>
        selectedType === "category"
          ? p.category === selectedValue
          : p.brand === selectedValue,
      );
      setProducts(filtered.sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveProduct = (index, direction) => {
    const newProducts = [...products];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newProducts.length) return;

    [newProducts[index], newProducts[targetIndex]] = [
      newProducts[targetIndex],
      newProducts[index],
    ];

    setProducts(newProducts);
  };

  const savePositions = async () => {
    setLoading(true);
    try {
      const updates = products.map((product, index) => ({
        id: product._id,
        position: index,
      }));

      await axios.put(`${API_BASE_URL}/products/positions/update`, {
        products: updates,
      });

      setToast({
        show: true,
        message: "Product positions updated successfully!",
        type: "success",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating positions:", error);
      setToast({
        show: true,
        message: "Error updating positions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="page-header">
        <h1 className="page-title">Arrange Products</h1>
        <Link to="/products" className="btn btn-secondary">
          Back to Products
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="ordering-controls">
            <div className="form-group">
              <p className="form-label">Select Type</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="category"
                    checked={selectedType === "category"}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedValue("");
                      setProducts([]);
                    }}
                  />
                  Category
                </label>
                <label>
                  <input
                    type="radio"
                    value="brand"
                    checked={selectedType === "brand"}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedValue("");
                      setProducts([]);
                    }}
                  />
                  Brand
                </label>
              </div>
            </div>

            <div className="form-group">
              <p className="form-label">
                Select {selectedType === "category" ? "Category" : "Brand"}
              </p>
              <select
                className="form-control"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                <option value="">
                  -- Select {selectedType === "category" ? "Category" : "Brand"}{" "}
                  --
                </option>
                {(selectedType === "category" ? categories : brands).map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {loading && <div className="loading">Loading products...</div>}

          {!loading && products.length > 0 && (
            <div className="products-list">
              <h3>
                Products in {selectedType === "category" ? "Category" : "Brand"}
                : {selectedValue}
              </h3>
              <p className="help-text">
                Use the arrows to arrange products in the order you want them to
                appear on the frontend.
              </p>

              <div className="product-items">
                {products.map((product, index) => (
                  <div key={product._id} className="product-order-item">
                    <div className="product-info">
                      <span className="position-number">{index + 1}</span>
                      <span className="product-title">{product.title}</span>
                    </div>
                    <div className="product-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveProduct(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveProduct(index, "down")}
                        disabled={index === products.length - 1}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="save-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={savePositions}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Order"}
                </button>
              </div>
            </div>
          )}

          {!loading && selectedValue && products.length === 0 && (
            <div className="no-products">
              No products found for this{" "}
              {selectedType === "category" ? "category" : "brand"}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrdering;

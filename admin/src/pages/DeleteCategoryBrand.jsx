import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Toast from "../components/Toast";
import "./ProductOrdering.css";
import { Link } from "react-router-dom";

const DeleteCategoryBrand = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedType, setSelectedType] = useState("category");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchOptions();
  }, []);

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

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      setToast({
        show: true,
        message: "Please select at least one item to delete",
        type: "error",
      });
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedItems.length} ${selectedType}(s) and all their associated products? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/products/bulk-delete`, {
        data: { type: selectedType, items: selectedItems },
      });

      setToast({
        show: true,
        message: `Successfully deleted ${selectedItems.length} ${selectedType}(s) and their products!`,
        type: "success",
      });
      
      setSelectedItems([]);
      fetchOptions();
    } catch (error) {
      console.error("Error deleting:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Error deleting items",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentList = selectedType === "category" ? categories : brands;

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="page-header">
        <h1 className="page-title">Delete Category/Brand</h1>
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
                      setSelectedItems([]);
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
                      setSelectedItems([]);
                    }}
                  />
                  Brand
                </label>
              </div>
            </div>
          </div>

          {currentList.length > 0 ? (
            <div className="products-list">
              <h3>
                Select {selectedType === "category" ? "Categories" : "Brands"} to Delete
              </h3>
              <p className="help-text">
                Warning: Deleting a {selectedType} will also delete all products associated with it from both admin and frontend.
              </p>

              <div className="product-items">
                {currentList.map((item, index) => (
                  <div key={item} className="product-order-item">
                    <div className="product-info">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                      <span className="position-number">{index + 1}</span>
                      <span className="product-title">{item}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="save-actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading || selectedItems.length === 0}
                >
                  {loading ? "Deleting..." : `Delete Selected (${selectedItems.length})`}
                </button>
              </div>
            </div>
          ) : (
            <div className="no-products">
              No {selectedType === "category" ? "categories" : "brands"} found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryBrand;

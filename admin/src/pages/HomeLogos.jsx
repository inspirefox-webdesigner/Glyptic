import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Toast from "../components/Toast";
import "./HomeLogos.css";

const HomeLogos = () => {
  const [logos, setLogos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    type: "brand",
    value: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchLogos();
    fetchOptions();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/home-logos`);
      setLogos(response.data);
    } catch (error) {
      console.error("Error fetching logos:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      if (formData.image) data.append("image", formData.image);
      data.append("type", formData.type);
      data.append("value", formData.value);

      if (editingId) {
        await axios.put(`${API_BASE_URL}/home-logos/${editingId}`, data);
        setToast({ show: true, message: "Logo updated successfully!", type: "success" });
      } else {
        await axios.post(`${API_BASE_URL}/home-logos`, data);
        setToast({ show: true, message: "Logo added successfully!", type: "success" });
      }

      resetForm();
      fetchLogos();
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || "Error saving logo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (logo) => {
    setEditingId(logo._id);
    setFormData({
      image: null,
      type: logo.type,
      value: logo.value,
    });
    setImagePreview(`${API_BASE_URL.replace('/api', '')}${logo.imageUrl}`);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/home-logos/${id}`);
      setToast({ show: true, message: "Logo deleted successfully!", type: "success" });
      fetchLogos();
    } catch (error) {
      setToast({ show: true, message: "Error deleting logo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ image: null, type: "brand", value: "" });
    setImagePreview("");
    setEditingId(null);
    setShowForm(false);
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
        <h1 className="page-title">Home Logos</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Logo"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-body">
            <h2>{editingId ? "Edit Logo" : "Add New Logo"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingId}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="brand"
                      checked={formData.type === "brand"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value, value: "" })}
                    />
                    Brand
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="category"
                      checked={formData.type === "category"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value, value: "" })}
                    />
                    Category
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Select {formData.type === "brand" ? "Brand" : "Category"}
                </label>
                <select
                  className="form-control"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                >
                  <option value="">-- Select --</option>
                  {(formData.type === "brand" ? brands : categories).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Logo" : "Add Logo"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h2>Logos List</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : logos.length === 0 ? (
            <div className="no-data">No logos added yet</div>
          ) : (
            <div className="logos-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logos.map((logo) => (
                    <tr key={logo._id}>
                      <td>
                        <img 
                          src={`${API_BASE_URL.replace('/api', '')}${logo.imageUrl}`} 
                          alt={logo.value} 
                          className="logo-thumb"
                          onError={(e) => {
                            console.error('Image load error:', e.target.src);
                            e.target.style.display = 'none';
                          }}
                        />
                      </td>
                      <td>{logo.type}</td>
                      <td>{logo.value}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(logo)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(logo._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeLogos;

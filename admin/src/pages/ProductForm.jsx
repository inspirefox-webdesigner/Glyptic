// new code Here
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "./ProductForm.css";
import Toast from "../components/Toast";
import API_BASE_URL from "../config/api";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [brand, setBrand] = useState("");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [coverImage, setCoverImage] = useState("");
  const [variationImages, setVariationImages] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicBrands, setDynamicBrands] = useState([]);

  const predefinedCategories = [
    { value: "fire-alarm", label: "Fire Alarm System" },
    { value: "other-products", label: "Other Products" },
    { value: "fire-suppression", label: "Fire Suppression System" },
    { value: "digital-pa", label: "Digital PA System" },
    { value: "flame-smoke-camera", label: "Flame And Smoke Detection Camera" },
    { value: "dts-fo-lhs", label: "DTS FO LHS System" },
    { value: "linear-heat-cable", label: "Linear Heat Sensing Cable" },
    { value: "smoke-detector-tester", label: "Smoke Detector Tester" }
  ];

  // Predefined brands from the "Authorize Partners" menu
  const predefinedBrands = [
    { value: "Edwards", label: "Edwards" },
    { value: "Siemens", label: "Siemens" },
    { value: "Notifier", label: "Notifier" },
    { value: "Simplex", label: "Simplex" },
    { value: "TNA", label: "TNA" },
    { value: "Farenhyt", label: "Farenhyt" },
    { value: "ESSER", label: "ESSER" },
    { value: "Honeywell", label: "Honeywell" },
    { value: "Apollo", label: "Apollo" },
    { value: "Ansul", label: "Ansul" },
    { value: "Kidde", label: "Kidde" },
    { value: "Blazecut", label: "Blazecut" },
    { value: "Kentec", label: "Kentec" },
    { value: "Wagner", label: "Wagner" },
    { value: "Bandweaver", label: "Bandweaver" },
    { value: "Securiton", label: "Securiton" },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
    fetchDynamicOptions();
  }, [id, isEdit]);

  const fetchDynamicOptions = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products/categories`),
        axios.get(`${API_BASE_URL}/products/brands`),
      ]);
      setDynamicCategories(categoriesRes.data || []);
      setDynamicBrands(brandsRes.data || []);
    } catch (error) {
      console.error("Error fetching dynamic options:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      const product = response.data;
      setTitle(product.title);
      setCategory(product.category || "");
      setBrand(product.brand || "");
      setContents(product.contents);
      setCoverImage(product.coverImage || "");
      setVariationImages(product.variationImages || []);

      // Check if custom category/brand
      if (product.category) {
        const isCustom = !predefinedCategories.some(
          (cat) => cat.value === product.category
        );
        setIsCustomCategory(isCustom);
      }
      if (product.brand) {
        const isCustomBrandValue = !predefinedBrands.some(
          (brandItem) => brandItem.value === product.brand
        );
        setIsCustomBrand(isCustomBrandValue);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        title,
        category: category || "",
        brand: brand || "",
        contents,
        coverImage,
        variationImages,
      };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/products/${id}`, productData);
      } else {
        await axios.post(`${API_BASE_URL}/products`, productData);
      }

      setToast({
        show: true,
        message: isEdit
          ? "Product updated successfully!"
          : "Product created successfully!",
        type: "success",
      });
      await fetchDynamicOptions();
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error saving product. Please try again.";
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const addContent = (type) => {
    const newContent = {
      type,
      data:
        type === "title"
          ? ""
          : type === "image"
          ? ""
          : type === "video"
          ? ""
          : type === "coverImage"
          ? ""
          : type === "variationImages"
          ? []
          : "",
      order: contents.length,
    };
    setContents([...contents, newContent]);
  };

  const updateContent = (index, field, value) => {
    const updatedContents = [...contents];
    updatedContents[index][field] = value;
    setContents(updatedContents);
  };

  const removeContent = (index) => {
    const updatedContents = contents.filter((_, i) => i !== index);
    setContents(
      updatedContents.map((content, i) => ({ ...content, order: i }))
    );
  };

  const moveContent = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contents.length) return;

    const updatedContents = [...contents];
    [updatedContents[index], updatedContents[newIndex]] = [
      updatedContents[newIndex],
      updatedContents[index],
    ];
    updatedContents[index].order = index;
    updatedContents[newIndex].order = newIndex;
    setContents(updatedContents);
  };

  const handleFileUpload = async (file, index) => {
    if (!file) {
      setToast({ show: true, message: "Please select a file", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const filename = response.data.filename;
      updateContent(index, "data", filename);
      // Ensure subType is preserved for specification images
      if (
        contents[index].type === "specification" &&
        contents[index].subType === "image"
      ) {
        updateContent(index, "subType", "image");
      }
      setUploadedFiles((prev) => ({ ...prev, [index]: filename }));
      setToast({
        show: true,
        message: "File uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Error uploading file. Please try again.";
      setToast({ show: true, message: errorMessage, type: "error" });
    }
  };

  const handleMultipleFileUpload = async (files, index) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.filename;
    });

    try {
      const filenames = await Promise.all(uploadPromises);
      const currentData = contents[index].data;
      const existingImages = Array.isArray(currentData)
        ? currentData
        : currentData
        ? [currentData]
        : [];
      updateContent(index, "data", [...existingImages, ...filenames]);
      setToast({
        show: true,
        message: `${filenames.length} images uploaded successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      setToast({
        show: true,
        message: "Error uploading images",
        type: "error",
      });
    }
  };

  const removeImage = (contentIndex, imageIndex) => {
    const currentData = contents[contentIndex].data;
    const images = Array.isArray(currentData) ? currentData : [currentData];
    const updatedImages = images.filter((_, i) => i !== imageIndex);
    updateContent(
      contentIndex,
      "data",
      updatedImages.length === 1 ? updatedImages[0] : updatedImages
    );
  };

  const handleCoverImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImage(response.data.filename);
      setToast({
        show: true,
        message: "Cover image uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        show: true,
        message: "Error uploading cover image",
        type: "error",
      });
    }
  };

  const handleVariationImagesUpload = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.filename;
    });
    try {
      const filenames = await Promise.all(uploadPromises);
      setVariationImages((prev) => [...prev, ...filenames]);
      setToast({
        show: true,
        message: `${filenames.length} variation images uploaded successfully!`,
        type: "success",
      });
    } catch (error) {
      setToast({
        show: true,
        message: "Error uploading variation images",
        type: "error",
      });
    }
  };

  const removeVariationImage = (index) => {
    setVariationImages((prev) => prev.filter((_, i) => i !== index));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
  ];

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
            </div>

            {/* Category Section */}
            {
              <div className="form-group">
                <label className="form-label">Category</label>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="categoryType"
                      checked={!isCustomCategory}
                      onChange={() => {
                        setIsCustomCategory(false);
                        setCategory("fire-alarm");
                      }}
                    />
                    Select from existing categories
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="categoryType"
                      checked={isCustomCategory}
                      onChange={() => {
                        setIsCustomCategory(true);
                        setCategory("");
                      }}
                    />
                    Add new category
                  </label>
                </div>

                {!isCustomCategory ? (
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {predefinedCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                    {dynamicCategories
                      .filter(
                        (cat) =>
                          !predefinedCategories.some((p) => p.value === cat)
                      )
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new category name"
                    required
                  />
                )}
              </div>
            }

            {/* Brand Section */}
            {
              <div className="form-group">
                <label className="form-label">Brand</label>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="brandType"
                      checked={!isCustomBrand}
                      onChange={() => {
                        setIsCustomBrand(false);
                        setBrand("Edwards");
                      }}
                    />
                    Select from existing brands
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="brandType"
                      checked={isCustomBrand}
                      onChange={() => {
                        setIsCustomBrand(true);
                        setBrand("");
                      }}
                    />
                    Add new brand
                  </label>
                </div>

                {!isCustomBrand ? (
                  <select
                    className="form-control"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  >
                    {predefinedBrands.map((brandItem) => (
                      <option key={brandItem.value} value={brandItem.value}>
                        {brandItem.label}
                      </option>
                    ))}
                    {dynamicBrands
                      .filter(
                        (b) => !predefinedBrands.some((p) => p.value === b)
                      )
                      .map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new brand name"
                    required
                  />
                )}
              </div>
            }

            <div className="form-group">
              <label className="form-label">Content</label>
              <div className="content-builder">
                {contents.map((content, index) => (
                  <div key={index} className="content-item">
                    <div className="content-item-header">
                      <span className="content-type-badge">
                        {content.type === "specification"
                          ? `${content.type} (${content.subType || "text"})`
                          : content.type === "image"
                          ? "Product Image"
                          : content.type === "coverImage"
                          ? "Cover Image"
                          : content.type === "variationImages"
                          ? "Variation Images"
                          : content.type === "table"
                          ? "Tech Specification Table"
                          : content.type}
                      </span>
                      <div className="content-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => moveContent(index, "up")}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => moveContent(index, "down")}
                          disabled={index === contents.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeContent(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {content.type === "title" && (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter title"
                        value={content.data}
                        onChange={(e) =>
                          updateContent(index, "data", e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                      />
                    )}

                    {content.type === "image" && (
                      <div>
                        <input
                          type="file"
                          className="form-control mb-2"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              handleMultipleFileUpload(files, index);
                            }
                          }}
                        />
                        {content.data && (
                          <div className="image-preview-grid">
                            {(Array.isArray(content.data)
                              ? content.data
                              : [content.data]
                            ).map((filename, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="image-preview-item"
                              >
                                <img
                                  src={`${API_BASE_URL.replace(
                                    "/api",
                                    ""
                                  )}/uploads/${filename}`}
                                  alt={`Preview ${imgIndex + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "none",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger remove-image-btn"
                                  onClick={() => removeImage(index, imgIndex)}
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    padding: "2px 6px",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {content.type === "content" && (
                      <div key={`quill-${index}`}>
                        <ReactQuill
                          theme="snow"
                          value={content.data || ""}
                          onChange={(value) =>
                            updateContent(index, "data", value)
                          }
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ backgroundColor: "white" }}
                        />
                      </div>
                    )}

                    {content.type === "specification" && (
                      <div>
                        {content.subType === "text" ? (
                          <ReactQuill
                            theme="snow"
                            value={content.data || ""}
                            onChange={(value) =>
                              updateContent(index, "data", value)
                            }
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ backgroundColor: "white" }}
                            placeholder="Enter specification text..."
                          />
                        ) : (
                          <div>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleFileUpload(file, index);
                                }
                              }}
                            />
                            {content.data && (
                              <div className="mt-2 p-2 bg-light rounded">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-image text-primary"></i>
                                  <span className="text-muted">
                                    {" "}
                                    Image: {content.data}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === "video" && (
                      <div>
                        <div className="mb-3">
                          <div className="d-flex gap-2 mb-2">
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                content.videoType === "upload" ||
                                !content.videoType
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => {
                                updateContent(index, "videoType", "upload");
                                updateContent(index, "data", "");
                              }}
                            >
                              Upload Video
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm url-btn  ${
                                content.videoType === "url"
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => {
                                updateContent(index, "videoType", "url");
                                updateContent(index, "data", "");
                              }}
                            >
                              Video URL
                            </button>
                          </div>
                        </div>

                        {(content.videoType === "upload" ||
                          !content.videoType) && (
                          <input
                            type="file"
                            className="form-control mb-2"
                            accept="video/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                  const response = await axios.post(
                                    `${API_BASE_URL}/upload`,
                                    formData
                                  );
                                  updateContent(
                                    index,
                                    "data",
                                    "uploads/" + response.data.filename
                                  );
                                  setToast({
                                    show: true,
                                    message: "Video uploaded successfully!",
                                    type: "success",
                                  });
                                } catch (error) {
                                  setToast({
                                    show: true,
                                    message: "Error uploading video",
                                    type: "error",
                                  });
                                }
                              }
                            }}
                          />
                        )}

                        {content.videoType === "url" && (
                          <input
                            type="url"
                            className="form-control mb-2"
                            placeholder="Enter YouTube URL or any video URL"
                            value={content.data || ""}
                            onChange={(e) =>
                              updateContent(index, "data", e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                          />
                        )}

                        {content.data && (
                          <div className="mt-2">
                            {content.data.startsWith("uploads/") ? (
                              <video
                                controls
                                style={{ width: "100%", maxWidth: "300px" }}
                              >
                                <source
                                  src={`${API_BASE_URL.replace("/api", "")}/${
                                    content.data
                                  }`}
                                />
                              </video>
                            ) : (
                              <div className="p-2 bg-light rounded">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-video text-primary"></i>
                                  <span className="text-muted">
                                    Video URL: {content.data}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === "techSpecifications" && (
                      <div>
                        <ReactQuill
                          theme="snow"
                          value={content.data || ""}
                          onChange={(value) =>
                            updateContent(index, "data", value)
                          }
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link"],
                              [{ align: [] }],
                              ["blockquote"],
                              ["clean"],
                            ],
                          }}
                          formats={[
                            "header",
                            "bold",
                            "italic",
                            "underline",
                            "list",
                            "bullet",
                            "link",
                            "align",
                            "blockquote",
                          ]}
                          style={{
                            backgroundColor: "white",
                            marginBottom: "1rem",
                          }}
                          placeholder="Enter technical specifications..."
                        />
                      </div>
                    )}

                    {content.type === "table" && (
                      <div>
                        <div className="mb-3">
                          <div className="d-flex gap-2 mb-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                const tableData = content.data || {
                                  rows: [[""]],
                                  headers: [""],
                                };
                                tableData.headers.push("");
                                tableData.rows = tableData.rows.map((row) => [
                                  ...row,
                                  "",
                                ]);
                                updateContent(index, "data", tableData);
                              }}
                            >
                              Add Column
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              style={{
                                marginLeft: "1rem",
                                marginBottom: "1rem",
                              }}
                              onClick={() => {
                                const tableData = content.data || {
                                  rows: [[""]],
                                  headers: [""],
                                };
                                const newRow = new Array(
                                  tableData.headers.length
                                ).fill("");
                                tableData.rows.push(newRow);
                                updateContent(index, "data", tableData);
                              }}
                            >
                              Add Row
                            </button>
                          </div>

                          {content.data && (
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    {content.data.headers.map(
                                      (header, headerIndex) => (
                                        <th key={headerIndex}>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={header}
                                            placeholder={`Header ${
                                              headerIndex + 1
                                            }`}
                                            onChange={(e) => {
                                              const tableData = {
                                                ...content.data,
                                              };
                                              tableData.headers[headerIndex] =
                                                e.target.value;
                                              updateContent(
                                                index,
                                                "data",
                                                tableData
                                              );
                                            }}
                                            onKeyDown={handleKeyDown}
                                          />
                                        </th>
                                      )
                                    )}
                                    <th width="50">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                          if (content.data.headers.length > 1) {
                                            const tableData = {
                                              ...content.data,
                                            };
                                            tableData.headers.pop();
                                            tableData.rows = tableData.rows.map(
                                              (row) => row.slice(0, -1)
                                            );
                                            updateContent(
                                              index,
                                              "data",
                                              tableData
                                            );
                                          }
                                        }}
                                      >
                                        -
                                      </button>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {content.data.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={cell}
                                            onChange={(e) => {
                                              const tableData = {
                                                ...content.data,
                                              };
                                              tableData.rows[rowIndex][
                                                cellIndex
                                              ] = e.target.value;
                                              updateContent(
                                                index,
                                                "data",
                                                tableData
                                              );
                                            }}
                                            onKeyDown={handleKeyDown}
                                          />
                                        </td>
                                      ))}
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() => {
                                            if (content.data.rows.length > 1) {
                                              const tableData = {
                                                ...content.data,
                                              };
                                              tableData.rows.splice(
                                                rowIndex,
                                                1
                                              );
                                              updateContent(
                                                index,
                                                "data",
                                                tableData
                                              );
                                            }
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {!content.data && (
                            <div className="text-center p-3 border rounded">
                              <p className="mb-2">
                                Click "Add Column" or "Add Row" to start
                                creating your table
                              </p>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  updateContent(index, "data", {
                                    headers: ["Column 1", "Column 2"],
                                    rows: [["", ""]],
                                  });
                                }}
                              >
                                Create Table
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {content.type === "coverImage" && (
                      <div>
                        <input
                          type="file"
                          className="form-control mb-2"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append("file", file);
                              try {
                                const response = await axios.post(
                                  `${API_BASE_URL}/upload`,
                                  formData
                                );
                                updateContent(
                                  index,
                                  "data",
                                  response.data.filename
                                );
                                setCoverImage(response.data.filename);
                                setToast({
                                  show: true,
                                  message: "Cover image uploaded successfully!",
                                  type: "success",
                                });
                              } catch (error) {
                                setToast({
                                  show: true,
                                  message: "Error uploading cover image",
                                  type: "error",
                                });
                              }
                            }
                          }}
                        />
                        {content.data && (
                          <div
                            className="image-preview-item"
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={`${API_BASE_URL.replace(
                                "/api",
                                ""
                              )}/uploads/${content.data}`}
                              alt="Cover Image"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                updateContent(index, "data", "");
                                setCoverImage("");
                              }}
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                padding: "2px 6px",
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === "variationImages" && (
                      <div>
                        <input
                          type="file"
                          className="form-control mb-2"
                          multiple
                          accept="image/*"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              const uploadPromises = files.map(async (file) => {
                                const formData = new FormData();
                                formData.append("file", file);
                                const response = await axios.post(
                                  `${API_BASE_URL}/upload`,
                                  formData
                                );
                                return response.data.filename;
                              });
                              try {
                                const filenames = await Promise.all(
                                  uploadPromises
                                );
                                const currentData = Array.isArray(content.data)
                                  ? content.data
                                  : [];
                                const newData = [...currentData, ...filenames];
                                updateContent(index, "data", newData);
                                setVariationImages((prev) => [
                                  ...prev,
                                  ...filenames,
                                ]);
                                setToast({
                                  show: true,
                                  message: `${filenames.length} variation images uploaded successfully!`,
                                  type: "success",
                                });
                              } catch (error) {
                                setToast({
                                  show: true,
                                  message: "Error uploading variation images",
                                  type: "error",
                                });
                              }
                            }
                          }}
                        />
                        {content.data &&
                          Array.isArray(content.data) &&
                          content.data.length > 0 && (
                            <div
                              className="image-preview-grid"
                              style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              {content.data.map((filename, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="image-preview-item"
                                  style={{ position: "relative" }}
                                >
                                  <img
                                    src={`${API_BASE_URL.replace(
                                      "/api",
                                      ""
                                    )}/uploads/${filename}`}
                                    alt={`Variation ${imgIndex + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                      const updatedImages = content.data.filter(
                                        (_, i) => i !== imgIndex
                                      );
                                      updateContent(
                                        index,
                                        "data",
                                        updatedImages
                                      );
                                      setVariationImages((prev) =>
                                        prev.filter((_, i) => i !== imgIndex)
                                      );
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      padding: "2px 6px",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {content.type === "manualDownload" && (
                      <div>
                        <div className="mb-2">
                          <label className="form-label">PDF URL</label>
                          <input
                            type="url"
                            className="form-control mb-2"
                            value={
                              content.data &&
                              !content.data.startsWith("uploads/")
                                ? content.data
                                : ""
                            }
                            onChange={(e) =>
                              updateContent(index, "data", e.target.value)
                            }
                            placeholder="Enter PDF URL (e.g., https://example.com/manual.pdf)"
                          />
                          <div className="text-center my-3">
                            <span className="badge bg-secondary">OR</span>
                          </div>
                          <label className="form-label">Upload PDF File</label>
                          <input
                            type="file"
                            className="form-control"
                            accept=".pdf,application/pdf"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Validate file type
                                if (file.type !== "application/pdf") {
                                  setToast({
                                    show: true,
                                    message: "Please select a PDF file only",
                                    type: "error",
                                  });
                                  e.target.value = "";
                                  return;
                                }

                                // Validate file size (max 10MB)
                                if (file.size > 10 * 1024 * 1024) {
                                  setToast({
                                    show: true,
                                    message:
                                      "PDF file size should be less than 10MB",
                                    type: "error",
                                  });
                                  e.target.value = "";
                                  return;
                                }

                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                  const response = await axios.post(
                                    `${API_BASE_URL}/upload`,
                                    formData
                                  );
                                  updateContent(
                                    index,
                                    "data",
                                    "uploads/" + response.data.filename
                                  );
                                  setToast({
                                    show: true,
                                    message: "PDF uploaded successfully!",
                                    type: "success",
                                  });
                                } catch (error) {
                                  setToast({
                                    show: true,
                                    message: "Error uploading PDF",
                                    type: "error",
                                  });
                                }
                              }
                            }}
                          />
                          {content.data && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <div className="d-flex align-items-center gap-2">
                                <i
                                  className="fas fa-file-pdf text-danger"
                                  style={{ fontSize: "1.5rem" }}
                                ></i>
                                <div>
                                  <strong>PDF Manual:</strong>
                                  <br />
                                  <small className="text-muted">
                                    {content.data.startsWith("uploads/")
                                      ? content.data
                                          .replace("uploads/", "")
                                          .replace(/^\d+-\d+-/, "")
                                      : content.data}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="add-content-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("title")}
                  >
                    Add second Title
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("coverImage")}
                  >
                    Cover Image
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("variationImages")}
                  >
                    Variation Images
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("content")}
                  >
                    Add Content
                  </button>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const newContent = {
                          type: "specification",
                          subType: "text",
                          data: "",
                          order: contents.length,
                        };
                        setContents([...contents, newContent]);
                      }}
                    >
                      Add Spec Text
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => {
                        const newContent = {
                          type: "specification",
                          subType: "image",
                          data: "",
                          order: contents.length,
                        };
                        setContents([...contents, newContent]);
                      }}
                    >
                      Add Spec Image
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("video")}
                  >
                    Add Video
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("techSpecifications")}
                  >
                    Add Tech Specifications
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("table")}
                  >
                    Add Teach Specifications Table
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent("manualDownload")}
                  >
                    <i className="fas fa-file-pdf me-1"></i>
                    Add Manual Download
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Product"
                    : "Create Product"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/products")}
                  style={{ marginLeft: "1rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ProductForm;

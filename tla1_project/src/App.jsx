import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // Input Form States
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catAmount, setCatAmount] = useState('');
  
  // Search & Edit States
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  // LocalStorage Persistent State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('enterprise_categories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('enterprise_categories', JSON.stringify(categories));
  }, [categories]);

  // Handle Save (Add / Update)
  const handleSaveCategory = (e) => {
    e.preventDefault();
    const trimmedName = catName.trim();
    const trimmedDesc = catDesc.trim();
    const parsedAmount = parseFloat(catAmount) || 0;

    // Guard Clause Validation
    if (!trimmedName || !trimmedDesc) {
      alert("Please complete both category name and description fields.");
      return;
    }

    // Baseline formatting logic (Slice to 25 chars)
    let formattedName = trimmedName.toUpperCase();
    if (formattedName.length > 25) formattedName = formattedName.slice(0, 25) + "...";

    let formattedDesc = trimmedDesc;
    if (formattedDesc.length > 25) formattedDesc = formattedDesc.slice(0, 25) + "...";

    if (editingId) {
      // Update existing record
      setCategories(categories.map(cat => 
        cat.id === editingId 
          ? { ...cat, name: formattedName, desc: formattedDesc, amount: parsedAmount } 
          : cat
      ));
      setEditingId(null);
    } else {
      // Create new record
      const newCategory = {
        id: Date.now(),
        name: formattedName,
        desc: formattedDesc,
        amount: parsedAmount
      };
      setCategories([...categories, newCategory]);
    }

    // Reset Form
    setCatName('');
    setCatDesc('');
    setCatAmount('');
  };

  // Trigger Edit Mode
  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.desc);
    setCatAmount(cat.amount || '');
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setCatName('');
    setCatDesc('');
    setCatAmount('');
  };

  // Dynamic Filtering
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total Income Calculation using .reduce()
  const totalTargetIncome = categories.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-light min-vh-100 py-5">
      <main className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Total Income Summary Card */}
            <div className="card shadow-sm border-0 mb-4 bg-white">
              <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="text-muted fw-semibold text-uppercase small">Total Target Income</span>
                  <h2 className="h3 text-navy fw-bold mb-0">
                    ₱{totalTargetIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <span className="badge bg-navy fs-6 px-3 py-2">
                  {categories.length} Registered {categories.length === 1 ? 'Category' : 'Categories'}
                </span>
              </div>
            </div>

            {/* Registration Card */}
            <div className="card shadow-sm border-0 mb-4 bg-white">
              <div className="card-header bg-navy text-white py-3">
                <h1 className="h5 mb-0 fw-bold">
                  {editingId ? "✏️ Edit Income Category" : "Income Category Registration"}
                </h1>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSaveCategory}>
                  <div className="mb-3">
                    <label htmlFor="txtCatName" className="form-label fw-semibold">Category Name</label>
                    <input
                      type="text"
                      id="txtCatName"
                      className="form-control"
                      placeholder="e.g., Consulting"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="txtCatDesc" className="form-label fw-semibold">Description</label>
                    <input
                      type="text"
                      id="txtCatDesc"
                      className="form-control"
                      placeholder="e.g., Enterprise technical support contract"
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                    />
                  </div>

                  {/* Feature: Estimated Amount (₱) Field */}
                  <div className="mb-3">
                    <label htmlFor="txtCatAmount" className="form-label fw-semibold">Estimated Target Amount (₱)</label>
                    <input
                      type="number"
                      id="txtCatAmount"
                      className="form-control"
                      placeholder="e.g., 50000"
                      min="0"
                      step="any"
                      value={catAmount}
                      onChange={(e) => setCatAmount(e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" id="btnAdd" className="btn btn-navy px-4 fw-semibold">
                      {editingId ? "Update Category" : "Save Category"}
                    </button>
                    {editingId && (
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Ledger Table Card */}
            <div className="card shadow-sm border-0 bg-white">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom">
                <h2 className="h6 mb-0 text-navy fw-bold text-uppercase">Registered Categories</h2>
                <input
                  type="text"
                  className="form-control form-control-sm w-auto"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="w-30">Category Name</th>
                      <th scope="col">Description</th>
                      <th scope="col" className="w-20">Amount (₱)</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          {categories.length === 0 ? "No categories registered yet." : "No matching categories found."}
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold text-dark">{item.name}</td>
                          <td className="text-secondary">{item.desc}</td>
                          <td className="fw-semibold text-navy">
                            ₱{Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
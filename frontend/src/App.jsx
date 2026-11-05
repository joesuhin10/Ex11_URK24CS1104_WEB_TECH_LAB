import { useEffect, useState } from "react";
import api, { usesDatabase } from "./api";
import "./App.css";

const emptyForm = { toyName: "", category: "", price: "", stock: "", status: "Available" };
const categories = ["Action Figures", "Building Toys", "Soft Toys", "Vehicles", "Board Games", "Educational Toys"];
const statuses = ["Available", "Low Stock", "Out of Stock"];

function validate(form) {
  const errors = {};
  if (!/^[A-Za-z0-9 '&-]+$/.test(form.toyName.trim())) errors.toyName = "Enter a toy name using letters, numbers and spaces.";
  if (!form.category) errors.category = "Select a category.";
  if (!/^\d{1,6}$/.test(form.price) || Number(form.price) < 1) errors.price = "Enter a price of at least 1.";
  if (!/^\d{1,4}$/.test(form.stock)) errors.stock = "Enter the stock as a whole number.";
  return errors;
}

function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setRecords(await api.list());
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      const text = editId ? await api.update(editId, form) : await api.create(form);
      setMessage({ type: "success", text });
      resetForm();
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const startEdit = (record) => {
    const { toyName, category, price, stock, status } = record;
    setForm({ toyName, category, price, stock, status });
    setEditId(record._id);
    setErrors({});
    setMessage(null);
    document.getElementById("add").scrollIntoView();
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete ${record.toyName} from the store?`)) return;
    try {
      const text = await api.remove(record._id);
      setMessage({ type: "success", text });
      if (editId === record._id) resetForm();
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <>
      <header>
        <a className="brand" href="#home">Toy<span>Nest</span></a>
        <nav>
          <a href="#add">Add Toy</a>
          <a href="#toys">Toy Catalogue</a>
        </nav>
      </header>

      <section className="banner" id="home">
        <h1>Welcome to the ToyNest Toy Store</h1>
        <p>Fun, safe and colourful toys for every little adventurer.</p>
      </section>

      <main>
        <section className="card" id="add">
          <h2>{editId ? "Edit Toy" : "Add New Toy"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="fields">
              <div>
                <label htmlFor="toyName">Toy Name</label>
                <input id="toyName" name="toyName" value={form.toyName} onChange={updateField} placeholder="Enter toy name" />
                {errors.toyName && <small>{errors.toyName}</small>}
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={updateField}>
                  <option value="">Select category</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
                {errors.category && <small>{errors.category}</small>}
              </div>
              <div>
                <label htmlFor="price">Price (₹)</label>
                <input id="price" name="price" type="text" inputMode="numeric" maxLength={6} value={form.price} onChange={updateField} placeholder="Enter price in rupees" />
                {errors.price && <small>{errors.price}</small>}
              </div>
              <div>
                <label htmlFor="stock">Stock Quantity</label>
                <input id="stock" name="stock" type="text" inputMode="numeric" maxLength={4} value={form.stock} onChange={updateField} placeholder="Number of items in stock" />
                {errors.stock && <small>{errors.stock}</small>}
              </div>
              <div>
                <label htmlFor="status">Availability</label>
                <select id="status" name="status" value={form.status} onChange={updateField}>
                  {statuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="actions">
              <button type="submit">{editId ? "Update Toy" : "Add Toy"}</button>
              {editId && <button type="button" className="plain" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
          {message && <p className={`message ${message.type}`} role="status">{message.text}</p>}
        </section>

        <section className="card" id="toys">
          <h2>Toy Catalogue ({records.length})</h2>
          {!loading && records.length === 0 && <p className="empty">No toys added yet.</p>}
          {records.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Toy</th><th>Category</th><th>Price</th><th>Stock</th><th>Availability</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.toyName}</td>
                      <td>{record.category}</td>
                      <td>₹{record.price}</td>
                      <td>{record.stock}</td>
                      <td><span className={`status ${record.status.toLowerCase().replace(/ /g, "-")}`}>{record.status}</span></td>
                      <td className="row-actions">
                        <button className="small" onClick={() => startEdit(record)}>Edit</button>
                        <button className="small danger" onClick={() => handleDelete(record)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!usesDatabase && <p className="note">Demo copy: records on this page are saved only in your browser.</p>}
        </section>
      </main>

      <footer>&copy; 2026 ToyNest Online Toy Store. All rights reserved.</footer>
    </>
  );
}

export default App;

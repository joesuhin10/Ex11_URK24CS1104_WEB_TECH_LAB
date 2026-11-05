// Talks to the Express and MongoDB backend when the app runs locally.
// GitHub Pages has no backend, so the hosted copy saves records in the browser instead.
export const usesDatabase = ["localhost", "127.0.0.1"].includes(location.hostname);

const STORAGE_KEY = "toynest-toys";

const samples = [
  { _id: "1", toyName: "Remote Control Car", category: "Vehicles", price: "1499", stock: "25", status: "Available" },
  { _id: "2", toyName: "Building Blocks Set", category: "Building Toys", price: "999", stock: "4", status: "Low Stock" },
  { _id: "3", toyName: "Teddy Bear", category: "Soft Toys", price: "699", stock: "0", status: "Out of Stock" },
];

function loadSaved() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : samples;
}

function save(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const browserStore = {
  async list() {
    return [...loadSaved()].sort((a, b) => a.toyName.localeCompare(b.toyName));
  },
  async create(data) {
    save([...loadSaved(), { ...data, _id: String(Date.now()) }]);
    return "Toy added successfully";
  },
  async update(id, data) {
    save(loadSaved().map((r) => (r._id === id ? { ...data, _id: id } : r)));
    return "Toy updated successfully";
  },
  async remove(id) {
    save(loadSaved().filter((r) => r._id !== id));
    return "Toy deleted successfully";
  },
};

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

const databaseStore = {
  list: () => send("/api/toys", "GET"),
  create: async (data) => (await send("/api/toys", "POST", data)).message,
  update: async (id, data) => (await send(`/api/toys/${id}`, "PUT", data)).message,
  remove: async (id) => (await send(`/api/toys/${id}`, "DELETE")).message,
};

export default usesDatabase ? databaseStore : browserStore;

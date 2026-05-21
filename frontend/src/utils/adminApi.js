export const API = "http://localhost:3000/api";

// Dùng chung key 'token' với AuthContext của T1_Hotel
export const token = () => localStorage.getItem("token");
export const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

export async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers(), ...opts });
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return null;
    }
    if (!res.ok) {
      const errText = await res.text();
      console.error(`API Error [${res.status}] ${path}:`, errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`API Fetch failed [${path}]:`, err.message);
    return null;
  }
}

export const fmt = (n) =>
  n?.toLocaleString("en-US", { minimumFractionDigits: 0 }) ?? "0";
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }) : "";
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtDate } from "../../utils/adminApi";
import {
  Search, Plus, Edit2, Trash2, Eye, ArrowLeft
} from "lucide-react";
import { MOCK, Confirm, Badge } from "./shared";

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/khach-hang");
    setCustomers(r?.data || MOCK.customers.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return c.ho_ten?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.sdt?.includes(q);
  });

  const del = async (c) => {
    const r = await apiFetch(`/admin/khach-hang/${c._id}`, { method: "DELETE" });
    if (r !== null) {
      setCustomers(prev => prev.filter(x => x._id !== c._id));
      showToast("Customer deleted!");
    } else {
      showToast("Failed to delete customer", "error");
    }
    setConfirm(null);
  };

  const saveAdd = async () => {
    if (!form.ho_ten || !form.sdt) { showToast("Full name and phone are required", "error"); return; }
    setSaving(true);
    const r = await apiFetch("/admin/khach-hang", { method: "POST", body: JSON.stringify(form) });
    setSaving(false);
    if (r?.data) { showToast("Customer created!"); await load(); setView("list"); }
    else showToast("Failed to create customer", "error");
  };

  const saveEdit = async () => {
    setSaving(true);
    const r = await apiFetch(`/admin/khach-hang/${form._id}`, { method: "PATCH", body: JSON.stringify(form) });
    setSaving(false);
    if (r?.data) { showToast("Customer updated!"); await load(); setView("list"); }
    else showToast("Failed to update customer", "error");
  };

  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Customer Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="avatar-section">
          <div className="avatar-big">{selected.ten_hien_thi || selected.ho_ten?.slice(0,2).toUpperCase()}</div>
        </div>
        <div className="detail-grid-2">
          <div><span className="detail-label">ID</span><p><strong>{selected.ma_khachhang}</strong></p></div>
          <div><span className="detail-label">Display Name</span><p>{selected.ten_hien_thi}</p></div>
          <div><span className="detail-label">Guest Name</span><p>{selected.ho_ten}</p></div>
          <div><span className="detail-label">Phone</span><p>{selected.sdt}</p></div>
          <div><span className="detail-label">Email</span><p>{selected.email}</p></div>
          <div><span className="detail-label">Date of Birth</span><p>{selected.ngay_sinh ? new Date(selected.ngay_sinh).toLocaleDateString("en-GB") : "-"}</p></div>
          <div><span className="detail-label">Nationality</span><p>{selected.quoc_tich}</p></div>
          <div><span className="detail-label">Gender</span><p>{selected.gioi_tinh}</p></div>
        </div>
        {selected.ghi_chu && <p style={{ marginTop:8, color:"#666", fontStyle:"italic" }}>{selected.ghi_chu}</p>}
      </div>
    </div>
  );

  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Customer" : "Edit Customer"}</h1>
        </div>
        {view === "add" && (
          <button className="btn-primary" onClick={saveAdd} disabled={saving}>
            {saving ? "Saving…" : "Create Customer"}
          </button>
        )}
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Personal Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Full Name *</label><input className="inp" value={form.ho_ten||""} onChange={e=>setForm(p=>({...p,ho_ten:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Phone Number *</label><input className="inp" value={form.sdt||""} onChange={e=>setForm(p=>({...p,sdt:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Email</label><input className="inp" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Date of Birth</label><input className="inp" type="date" value={form.ngay_sinh?.split("T")[0]||""} onChange={e=>setForm(p=>({...p,ngay_sinh:e.target.value}))}/></div>
          <div className="form-group"><label>Gender</label><select className="inp" value={form.gioi_tinh||""} onChange={e=>setForm(p=>({...p,gioi_tinh:e.target.value}))}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="form-group"><label>Nationality</label><input className="inp" value={form.quoc_tich||""} onChange={e=>setForm(p=>({...p,quoc_tich:e.target.value}))} placeholder="Enter here"/></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Identification</h4>
        <div className="form-grid">
          <div className="form-group"><label>ID card / Passport</label><input className="inp" value={form.so_cmnd_passport||""} onChange={e=>setForm(p=>({...p,so_cmnd_passport:e.target.value}))} placeholder="Enter ID number"/></div>
          <div className="form-group"><label>Address</label><input className="inp" value={form.dia_chi||""} onChange={e=>setForm(p=>({...p,dia_chi:e.target.value}))} placeholder="Enter here"/></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Additional Information</h4>
        <div className="form-group"><label>Note</label><textarea className="inp" rows={3} value={form.ghi_chu||""} onChange={e=>setForm(p=>({...p,ghi_chu:e.target.value}))} placeholder="Special requests, VIP notes…"/></div>
        {view === "edit" && (
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <button className="btn-cancel" onClick={() => setView("list")}>Cancel</button>
            <button className="btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({}); setView("add"); }}><Plus size={16}/> Add Customer</button>
      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="toolbar" style={{ marginBottom:0 }}>
          <h3 style={{ margin:0, fontWeight:600 }}>Customers List</h3>
          <div style={{ display:"flex", gap:8 }}>
            <div className="search-box"><Search size={16} color="#aaa"/><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <div className="table-wrap" style={{ marginTop:12 }}>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Phone</th><th>Email</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.ma_khachhang}</strong></td>
                  <td>{c.ho_ten}</td>
                  <td>{c.sdt}</td>
                  <td>{c.email}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="icon-btn" onClick={() => { setSelected(c); setView("detail"); }}><Eye size={15}/></button>
                      <button className="icon-btn" onClick={() => { setForm({...c}); setView("edit"); }}><Edit2 size={15}/></button>
                      <button className="icon-btn danger" onClick={() => setConfirm({ msg: `Delete customer ${c.ho_ten}?`, cb: () => del(c) })}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={confirm.cb} onNo={() => setConfirm(null)}/>}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default CustomersPage;
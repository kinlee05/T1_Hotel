import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtDate, fmt } from "../../utils/adminApi";
import {
  Search, Plus, Edit2, Trash2, Eye, X, Check, ChevronDown,
  ArrowLeft, RotateCcw, BedDouble, Wrench, Filter, TrendingUp, TrendingDown
} from "lucide-react";
import { MOCK, STATUS_MAP, Modal, Confirm, Badge } from "./shared";

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/nhan-vien");
    setEmployees(r?.data || MOCK.employees.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return e.ho_ten?.toLowerCase().includes(q) || e.vai_tro?.toLowerCase().includes(q) || e.sdt?.includes(q);
  });

  // DELETE
  const del = async (e) => {
    const r = await apiFetch(`/admin/nhan-vien/${e._id}`, { method: "DELETE" });
    if (r !== null) {
      setEmployees(prev => prev.filter(x => x._id !== e._id));
      showToast("Employee deleted!");
    } else {
      showToast("Failed to delete employee", "error");
    }
    setConfirm(null);
  };

  // CREATE
  const saveAdd = async () => {
    if (!form.ho_ten || !form.email || !password) {
      showToast("Name, email and password are required", "error");
      return;
    }
    if (password !== confirmPwd) {
      showToast("Passwords do not match", "error");
      return;
    }
    setSaving(true);
    const r = await apiFetch("/admin/nhan-vien", {
      method: "POST",
      body: JSON.stringify({ ...form, mat_khau: password }),
    });
    setSaving(false);
    if (r?.data) {
      showToast("Employee created!");
      await load();
      setView("list");
    } else {
      showToast("Failed to create employee", "error");
    }
  };

  // UPDATE
  const saveEdit = async () => {
    setSaving(true);
    const r = await apiFetch(`/admin/nhan-vien/${form._id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r?.data) {
      showToast("Employee updated!");
      await load();
      setView("list");
    } else {
      showToast("Failed to update employee", "error");
    }
  };

  // RESET PASSWORD
  const resetPassword = async (nv) => {
    const mat_khau_moi = prompt("Enter new password:");
    if (!mat_khau_moi) return;
    const r = await apiFetch(`/admin/nhan-vien/${nv._id}/reset-mat-khau`, {
      method: "PATCH",
      body: JSON.stringify({ mat_khau_moi }),
    });
    if (r) showToast("Password reset successfully!");
    else showToast("Failed to reset password", "error");
  };

  // ── Detail View ──
  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Employees Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div style={{ display:"flex", gap:24 }}>
          <div className="avatar-big emp">{selected.ho_ten?.split(" ").map(w=>w[0]).slice(-2).join("").toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <h4 className="section-title">Personal Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">ID</span><p>{selected.ma_nhanvien}</p></div>
              <div><span className="detail-label">Phone</span><p>{selected.sdt}</p></div>
              <div><span className="detail-label">Full Name</span><p>{selected.ho_ten}</p></div>
              <div><span className="detail-label">Email</span><p>{selected.email}</p></div>
              <div><span className="detail-label">Role</span><p><Badge status={selected.vai_tro}/></p></div>
              <div><span className="detail-label">Status</span><p><Badge status={selected.trang_thai}/></p></div>
            </div>
            <h4 className="section-title" style={{ marginTop:16 }}>Account Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">Username</span><p>{selected.ten_dang_nhap}</p></div>
              <div><span className="detail-label">Last Login</span><p>{selected.lan_dang_nhap_cuoi ? new Date(selected.lan_dang_nhap_cuoi).toLocaleDateString("en-GB") : "-"}</p></div>
              <div><span className="detail-label">Account Status</span><p><Badge status={selected.trang_thai}/></p></div>
              <div><button className="btn-danger-sm" onClick={() => resetPassword(selected)}>Reset Password</button></div>
            </div>
            <h4 className="section-title" style={{ marginTop:16 }}>Work Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">Join Date</span><p>{selected.ngay_vao_lam ? new Date(selected.ngay_vao_lam).toLocaleDateString("en-GB") : "-"}</p></div>
              <div><span className="detail-label">Shift</span><p>{selected.ca_lam}</p></div>
              <div><span className="detail-label">Department</span><p>{selected.phong_ban}</p></div>
              <div><span className="detail-label">Salary</span><p>${fmt(selected.luong)} / month</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Add / Edit Form ──
  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Employee" : "Edit Employees"}</h1>
        </div>
        {view === "add"
          ? <button className="btn-primary" onClick={saveAdd} disabled={saving}>
              {saving ? "Saving…" : "Create Employee"}
            </button>
          : <button className="btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save Change"}
            </button>
        }
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Personal Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Employee ID</label><input className="inp" value={form.ma_nhanvien||""} onChange={e=>setForm(p=>({...p,ma_nhanvien:e.target.value}))} placeholder="Enter ID"/></div>
          <div className="form-group"><label>Phone</label><input className="inp" value={form.sdt||""} onChange={e=>setForm(p=>({...p,sdt:e.target.value}))} placeholder="Enter phone number"/></div>
          <div className="form-group"><label>Full Name *</label><input className="inp" value={form.ho_ten||""} onChange={e=>setForm(p=>({...p,ho_ten:e.target.value}))} placeholder="Enter full name"/></div>
          <div className="form-group"><label>Email *</label><input className="inp" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Enter email"/></div>
          <div className="form-group"><label>Role</label><select className="inp" value={form.vai_tro||"Manager"} onChange={e=>setForm(p=>({...p,vai_tro:e.target.value}))}><option>Manager</option><option>Receptionist</option><option>Housekeeping</option><option>Accountant</option><option>IT</option></select></div>
          <div className="form-group"><label>Status</label><select className="inp" value={form.trang_thai||"active"} onChange={e=>setForm(p=>({...p,trang_thai:e.target.value}))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Account Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Username</label><input className="inp" value={form.ten_dang_nhap||""} onChange={e=>setForm(p=>({...p,ten_dang_nhap:e.target.value}))} placeholder="Enter username"/></div>
          {view === "add" && <>
            <div className="form-group"><label>Password *</label><input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></div>
            <div className="form-group"><label>Confirm Password *</label><input className="inp" type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder="Re-enter password"/></div>
          </>}
          {view === "edit" && (
            <div className="form-group" style={{ display:"flex", alignItems:"flex-end" }}>
              <button className="btn-danger-sm" style={{ marginBottom:1 }} onClick={() => resetPassword(form)}>Reset Password</button>
            </div>
          )}
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Work Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Join Date</label><input className="inp" type="date" value={form.ngay_vao_lam?.split("T")[0]||""} onChange={e=>setForm(p=>({...p,ngay_vao_lam:e.target.value}))}/></div>
          <div className="form-group"><label>Shift</label><select className="inp" value={form.ca_lam||"Morning"} onChange={e=>setForm(p=>({...p,ca_lam:e.target.value}))}><option>Morning</option><option>Afternoon</option><option>Night</option></select></div>
          <div className="form-group"><label>Department</label><input className="inp" value={form.phong_ban||""} onChange={e=>setForm(p=>({...p,phong_ban:e.target.value}))} placeholder="Enter department"/></div>
          <div className="form-group"><label>Salary ($/month)</label><input className="inp" type="number" value={form.luong||""} onChange={e=>setForm(p=>({...p,luong:Number(e.target.value)}))} placeholder="Enter salary"/></div>
        </div>
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

  // ── List View ──
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>

      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="toolbar" style={{ marginBottom:0 }}>
          <h3 style={{ margin:0, fontWeight:600 }}>Employees List</h3>
          <div className="search-box"><Search size={16} color="#aaa"/><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        </div>
        <div className="table-wrap" style={{ marginTop:12 }}>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.ma_nhanvien}</strong></td>
                  <td>{e.ho_ten}</td>
                  <td>{e.sdt}</td>
                  <td><Badge status={e.vai_tro}/></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="icon-btn" onClick={() => { setSelected(e); setView("detail"); }}><Eye size={15}/></button>
                      <button className="icon-btn" onClick={() => { setForm({ ...e }); setView("edit"); }}><Edit2 size={15}/></button>
                      <button className="icon-btn danger" onClick={() => setConfirm({ msg: `Delete employee ${e.ho_ten}?`, cb: () => del(e) })}><Trash2 size={15}/></button>
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

export default EmployeesPage;
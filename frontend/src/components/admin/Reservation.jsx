import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtDate, fmt } from "../../utils/adminApi";
import {
  Search, Plus, Edit2, Trash2, Eye, X, Check, ChevronDown,
  ArrowLeft, RotateCcw, BedDouble, Wrench, Filter, TrendingUp, TrendingDown
} from "lucide-react";
import { MOCK, STATUS_MAP, Modal, Confirm, Badge } from "./shared";

function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  // phuong_thuc được chọn ngay trong form đặt phòng, không cần modal riêng

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/dat-phong");
    setReservations(r?.data || MOCK.reservations.data);
  }, []);

  // Load customers & rooms for the Add form dropdowns
  const loadDropdowns = useCallback(async () => {
    const [c, p] = await Promise.all([
      apiFetch("/admin/khach-hang?limit=200"),
      apiFetch("/admin/phong?limit=200"),
    ]);
    setCustomers(c?.data || []);
    setRooms((p?.data || []).filter(r => r.trang_thai === "available"));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = reservations.filter(r => {
    const q = search.toLowerCase();
    return r.ma_datphong?.toLowerCase().includes(q) ||
      r.id_khachhang?.ho_ten?.toLowerCase().includes(q) ||
      r.id_phong?.so_phong?.includes(q);
  }).filter(r => filter === "all" || r.trang_thai === filter);

  // STATUS ACTIONS
  const changeStatus = async (res, action) => {
    const endpointMap = {
      confirm:  `/admin/dat-phong/${res._id}/xac-nhan`,
      cancel:   `/admin/dat-phong/${res._id}/huy`,
      checkin:  `/admin/dat-phong/${res._id}/checkin`,
      checkout: `/admin/dat-phong/${res._id}/checkout`,
    };
    const statusMap = {
      confirm:  "confirmed",
      cancel:   "cancelled",
      checkin:  "checked_in",
      checkout: "checked_out",
    };
    const r = await apiFetch(endpointMap[action], { method: "PATCH" });
    if (r !== null) {
      setReservations(prev => prev.map(rv => rv._id === res._id ? { ...rv, trang_thai: statusMap[action] } : rv));
      showToast(`Booking ${statusMap[action]}!`);
    } else {
      showToast("Action failed", "error");
    }
  };

  // CREATE — thanh toán ngay khi đặt
  const saveAdd = async () => {
    if (!form.id_khachhang || !form.id_phong || !form.ngay_checkin || !form.ngay_checkout) {
      showToast("Customer, room and dates are required", "error");
      return;
    }
    setSaving(true);
    const r = await apiFetch("/admin/dat-phong", {
      method: "POST",
      body: JSON.stringify({ ...form, phuong_thuc: form.phuong_thuc || "cash" }),
    });
    setSaving(false);
    if (r?.data) {
      showToast("Booking created & payment recorded!");
      await load();
      setView("list");
    } else {
      showToast("Failed to create reservation", "error");
    }
  };

  // UPDATE
  const saveEdit = async () => {
    setSaving(true);
    const payload = {
      ngay_checkin: form.ngay_checkin,
      ngay_checkout: form.ngay_checkout,
      yeu_cau_dac_biet: form.yeu_cau_dac_biet,
      trang_thai: form.trang_thai,
    };
    const r = await apiFetch(`/admin/dat-phong/${form._id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (r?.data) {
      showToast("Reservation updated!");
      await load();
      setView("list");
    } else {
      showToast("Failed to update reservation", "error");
    }
  };

  // ── Detail View ──
  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Reservation Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="detail-grid-2">
          <div><span className="detail-label">Booking ID</span><p><strong>{selected.ma_datphong}</strong></p></div>
          <div><span className="detail-label">Status</span><p><Badge status={selected.trang_thai}/></p></div>
          <div><span className="detail-label">Guest Name</span><p>{selected.id_khachhang?.ho_ten}</p></div>
          <div><span className="detail-label">Phone</span><p>{selected.id_khachhang?.sdt}</p></div>
          <div><span className="detail-label">Email</span><p>{selected.id_khachhang?.email}</p></div>
          <div><span className="detail-label">Room</span><p>R{selected.id_phong?.so_phong} - {selected.id_phong?.loai_phong} Room</p></div>
          <div><span className="detail-label">Check-in</span><p>{new Date(selected.ngay_checkin).toLocaleDateString("en-GB")}</p></div>
          <div><span className="detail-label">Check-out</span><p>{new Date(selected.ngay_checkout).toLocaleDateString("en-GB")}</p></div>
          <div><span className="detail-label">Total Price</span><p><strong>${fmt(selected.tong_tien)}</strong></p></div>
        </div>
        {selected.yeu_cau_dac_biet && (
          <div className="form-group" style={{ marginTop:12 }}>
            <span className="detail-label">Special Request</span>
            <div className="special-req">{selected.yeu_cau_dac_biet}</div>
          </div>
        )}
        <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
          {selected.trang_thai === "pending" && (
            <button className="act-btn green" onClick={() => { changeStatus(selected, "confirm"); setSelected(s => ({...s, trang_thai:"confirmed"})); }}>✓ Confirm</button>
          )}
          {selected.trang_thai === "confirmed" && (
            <button className="act-btn green" onClick={() => { changeStatus(selected, "checkin"); setSelected(s => ({...s, trang_thai:"checked_in"})); }}>Check-in</button>
          )}
          {selected.trang_thai === "checked_in" && (
            <button className="act-btn green" onClick={() => { changeStatus(selected, "checkout"); setSelected(s => ({...s, trang_thai:"checked_out"})); }}>Check-out</button>
          )}
          {["pending","confirmed"].includes(selected.trang_thai) && (
            <button className="act-btn red" onClick={() => { changeStatus(selected, "cancel"); setSelected(s => ({...s, trang_thai:"cancelled"})); }}>✕ Cancel</button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Edit Form ──
  if (view === "edit" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("detail")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Edit Reservation</h1>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Guest Name</label>
            <input className="inp" value={form.id_khachhang?.ho_ten || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="inp" value={form.id_khachhang?.sdt || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="inp" value={form.id_khachhang?.email || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Room</label>
            <input className="inp" value={`R${form.id_phong?.so_phong} - ${form.id_phong?.loai_phong} Room`} readOnly/>
          </div>
          <div className="form-group">
            <label>Check-in</label>
            <input className="inp" type="date" value={form.ngay_checkin?.split("T")[0] || ""} onChange={e => setForm(p => ({ ...p, ngay_checkin: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label>Check-out</label>
            <input className="inp" type="date" value={form.ngay_checkout?.split("T")[0] || ""} onChange={e => setForm(p => ({ ...p, ngay_checkout: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="inp" value={form.trang_thai || "pending"} onChange={e => setForm(p => ({ ...p, trang_thai: e.target.value }))}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked-in</option>
              <option value="checked_out">Checked-out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop:8 }}>
          <label>Special Request</label>
          <textarea className="inp" rows={3} value={form.yeu_cau_dac_biet || ""} onChange={e => setForm(p => ({ ...p, yeu_cau_dac_biet: e.target.value }))}/>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
          <button className="btn-cancel" onClick={() => setView("detail")}>Cancel</button>
          <button className="btn-primary" onClick={saveEdit} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Add Form ──
  if (view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>New Reservation</h1>
        </div>
        <button className="btn-primary" onClick={saveAdd} disabled={saving}>
          {saving ? "Saving…" : "Create Reservation"}
        </button>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Customer *</label>
            <select className="inp" value={form.id_khachhang||""} onChange={e=>setForm(p=>({...p,id_khachhang:e.target.value}))}>
              <option value="">Select customer</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.ho_ten} — {c.sdt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Room (available only) *</label>
            <select className="inp" value={form.id_phong||""} onChange={e=>setForm(p=>({...p,id_phong:e.target.value}))}>
              <option value="">Select room</option>
              {rooms.map(r => <option key={r._id} value={r._id}>R{r.so_phong} — {r.loai_phong} (${r.gia_moi_dem}/night)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Check-in *</label>
            <input className="inp" type="date" value={form.ngay_checkin||""} onChange={e=>setForm(p=>({...p,ngay_checkin:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label>Check-out *</label>
            <input className="inp" type="date" value={form.ngay_checkout||""} onChange={e=>setForm(p=>({...p,ngay_checkout:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label>Payment Method *</label>
            <select className="inp" value={form.phuong_thuc||"cash"} onChange={e=>setForm(p=>({...p,phuong_thuc:e.target.value}))}>
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="transfer">🏦 Bank Transfer</option>
            </select>
          </div>
        </div>
        {/* Preview tổng tiền */}
        {form.id_phong && form.ngay_checkin && form.ngay_checkout && (() => {
          const room = rooms.find(r => r._id === form.id_phong);
          const nights = room ? Math.ceil((new Date(form.ngay_checkout) - new Date(form.ngay_checkin)) / 86400000) : 0;
          const total = nights > 0 && room ? nights * room.gia_moi_dem : 0;
          return total > 0 ? (
            <div style={{ background:"#1a1a1a", border:"1px solid #c9a84c44", borderRadius:8, padding:"10px 14px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#aaa", fontSize:13 }}>{nights} night{nights>1?"s":""} × ${room.gia_moi_dem}/night</span>
              <strong style={{ color:"#c9a84c", fontSize:16 }}>Total: ${total.toLocaleString()}</strong>
            </div>
          ) : null;
        })()}
        <div className="form-group" style={{ marginTop:8 }}>
          <label>Special Request</label>
          <textarea className="inp" rows={3} value={form.yeu_cau_dac_biet||""} onChange={e=>setForm(p=>({...p,yeu_cau_dac_biet:e.target.value}))} placeholder="Special requests, early check-in…"/>
        </div>
      </div>
    </div>
  );

  // ── List View ──
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reservation</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({}); loadDropdowns(); setView("add"); }}>
          <Plus size={16}/> Add Reservation
        </button>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} color="#aaa"/>
          <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="filter-sel" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked-in</option>
          <option value="checked_out">Checked-out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Room</th><th>Check-in & Check-out</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.ma_datphong}</strong></td>
                  <td>{r.id_khachhang?.ho_ten}</td>
                  <td>R{r.id_phong?.so_phong}</td>
                  <td>{fmtDate(r.ngay_checkin)} → {fmtDate(r.ngay_checkout)}</td>
                  <td><Badge status={r.trang_thai}/></td>
                  <td>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <button className="icon-btn" onClick={() => { setSelected(r); setView("detail"); }}><Eye size={15}/></button>
                      <button className="icon-btn" onClick={() => { setSelected(r); setForm({ ...r }); setView("edit"); }}><Edit2 size={15}/></button>
                      {r.trang_thai === "pending" && <button className="act-btn green" onClick={() => changeStatus(r, "confirm")}>Confirm</button>}
                      {r.trang_thai === "confirmed" && <button className="act-btn green" onClick={() => changeStatus(r, "checkin")}>Check-in</button>}
                      {r.trang_thai === "checked_in" && <button className="act-btn green" onClick={() => changeStatus(r, "checkout")}>Check-out</button>}
                      {["pending","confirmed"].includes(r.trang_thai) && <button className="act-btn red" onClick={() => changeStatus(r, "cancel")}>Cancel</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default ReservationPage;
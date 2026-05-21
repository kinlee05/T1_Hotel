import { useState, useEffect } from "react";
import { apiFetch, fmt, fmtDate } from "../../utils/adminApi";
import {
  Search, Plus, Edit2, Trash2, Eye, X, Check, ChevronDown,
  ArrowLeft, RotateCcw, BedDouble, Wrench, Filter, TrendingUp, TrendingDown
} from "lucide-react";
import { MOCK, STATUS_MAP, Modal, Confirm, Badge } from "./shared";

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list"); // list | detail | edit | add
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    const r = await apiFetch(`/admin/phong?search=${search}&trang_thai=${filter === "all" ? "" : filter}`);
    setRooms((r?.data) || MOCK.rooms.data);
  }, [search, filter]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const openDetail = async (room) => {
    const r = await apiFetch(`/admin/phong/${room._id}`);
    setSelected(r ? { ...r.phong, lich_su: r.lich_su_dat_phong } : { ...room, lich_su: [] });
    setView("detail");
  };

  const openEdit = (room) => {
    setForm({ ...room });
    setSelected(room);
    setView("edit");
  };

  const openAdd = () => {
    setForm({ so_phong: "", loai_phong: "Standard", tang: 1, gia_moi_dem: "", so_giuong: 1, dien_tich: "", suc_chua: 2, tien_nghi: "", mo_ta: "", trang_thai: "available" });
    setView("add");
  };

  const saveEdit = async () => {
    const r = await apiFetch(`/admin/phong/${form._id}`, { method: "PUT", body: JSON.stringify(form) });
    if (r) { showToast("Room updated!"); load(); setView("list"); }
    else {
      // mock update
      setRooms(prev => prev.map(rm => rm._id === form._id ? { ...rm, ...form } : rm));
      showToast("Room updated (mock)!"); setView("list");
    }
  };

  const saveAdd = async () => {
    const r = await apiFetch("/admin/phong", { method: "POST", body: JSON.stringify(form) });
    if (r) { showToast("Room created!"); load(); setView("list"); }
    else {
      setRooms(prev => [...prev, { ...form, _id: `r${Date.now()}` }]);
      showToast("Room created (mock)!"); setView("list");
    }
  };

  const deleteRoom = async (room) => {
    const r = await apiFetch(`/admin/phong/${room._id}`, { method: "DELETE" });
    if (r || true) {
      setRooms(prev => prev.filter(rm => rm._id !== room._id));
      showToast("Room deleted!", "success");
    }
    setConfirm(null);
  };

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    return r.so_phong?.toLowerCase().includes(q) || r.loai_phong?.toLowerCase().includes(q);
  }).filter(r => filter === "all" || r.trang_thai === filter);

  // ── Detail View ──
  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Room {selected.so_phong}</h1>
          <Badge status={selected.trang_thai}/>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => openEdit(selected)}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="detail-grid">
          <div>
            <p><span className="detail-label">Price:</span> <strong>${selected.gia_moi_dem} / night</strong></p>
            <p><span className="detail-label">Beds:</span> {selected.so_giuong} beds</p>
            <p><span className="detail-label">Size:</span> {selected.dien_tich}m²</p>
            <p><span className="detail-label">Capacity:</span> {selected.suc_chua} guests</p>
            <p><span className="detail-label">Amenities:</span> {selected.tien_nghi}</p>
            <p><span className="detail-label">Description:</span> {selected.mo_ta}</p>
          </div>
          <div className="room-img-placeholder">
            <BedDouble size={64} color="#c8a84b" opacity={0.4}/>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h3 className="card-title">Booking History</h3>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Check-in & Check-out</th><th>Status</th></tr></thead>
            <tbody>
              {selected.lich_su?.length > 0 ? selected.lich_su.map(b => (
                <tr key={b.ma_datphong || b._id}>
                  <td>{b.ma_datphong}</td>
                  <td>{b.id_khachhang?.ho_ten}</td>
                  <td>{fmtDate(b.ngay_checkin)} - {fmtDate(b.ngay_checkout)}</td>
                  <td><Badge status={b.trang_thai}/></td>
                </tr>
              )) : <tr><td colSpan={4} style={{ textAlign:"center", color:"#aaa" }}>No booking history</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── Edit / Add Form ──
  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Room" : `Edit Room ${selected?.so_phong}`}</h1>
        </div>
        {view === "add" && <button className="btn-primary" onClick={saveAdd}>Create Room</button>}
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Room Information</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Room Number</label>
            <input className="inp" value={form.so_phong || ""} onChange={e => setForm(p => ({ ...p, so_phong: e.target.value }))} placeholder="e.g. 101"/>
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select className="inp" value={form.loai_phong || "Standard"} onChange={e => setForm(p => ({ ...p, loai_phong: e.target.value }))}>
              <option>Standard</option><option>Deluxe</option><option>Suite</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price per Night ($)</label>
            <input className="inp" type="number" value={form.gia_moi_dem || ""} onChange={e => setForm(p => ({ ...p, gia_moi_dem: Number(e.target.value) }))} placeholder="120"/>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input className="inp" type="number" value={form.suc_chua || ""} onChange={e => setForm(p => ({ ...p, suc_chua: Number(e.target.value) }))} placeholder="2"/>
          </div>
          <div className="form-group">
            <label>Floor</label>
            <input className="inp" type="number" value={form.tang || ""} onChange={e => setForm(p => ({ ...p, tang: Number(e.target.value) }))} placeholder="1"/>
          </div>
          <div className="form-group">
            <label>Beds</label>
            <input className="inp" type="number" value={form.so_giuong || ""} onChange={e => setForm(p => ({ ...p, so_giuong: Number(e.target.value) }))} placeholder="2"/>
          </div>
          <div className="form-group">
            <label>Size (m²)</label>
            <input className="inp" type="number" value={form.dien_tich || ""} onChange={e => setForm(p => ({ ...p, dien_tich: Number(e.target.value) }))} placeholder="35"/>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="inp" value={form.trang_thai || "available"} onChange={e => setForm(p => ({ ...p, trang_thai: e.target.value }))}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amenities</label>
            <input className="inp" value={form.tien_nghi || ""} onChange={e => setForm(p => ({ ...p, tien_nghi: e.target.value }))} placeholder="Wifi, TV, Air Conditioner"/>
          </div>
        </div>
        <div className="form-group" style={{ marginTop:8 }}>
          <label>Description</label>
          <textarea className="inp" rows={3} value={form.mo_ta || ""} onChange={e => setForm(p => ({ ...p, mo_ta: e.target.value }))} placeholder="Room description…"/>
        </div>
        {view === "edit" && (
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <button className="btn-cancel" onClick={() => setView("list")}>Cancel</button>
            <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
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
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> Add Room</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} color="#aaa"/>
          <input placeholder="Search rooms…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="filter-sel" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="room-grid">
        {filtered.map(room => (
          <div className="room-card" key={room._id} onClick={() => openDetail(room)} style={{ cursor:"pointer" }}>
            <div className="room-card-header">
              <BedDouble size={20} color="#666"/>
              <span className="room-number">Room {room.so_phong}</span>
            </div>
            <p className="room-type">{room.loai_phong} • Floor {room.tang}</p>
            <Badge status={room.trang_thai}/>
            <div className="room-actions">
              <button className="act-btn" onClick={() => openDetail(room)}><Eye size={14}/> View</button>
              <button className="act-btn" onClick={() => openEdit(room)}><Edit2 size={14}/> Edit</button>
              <button className="act-btn danger" onClick={() => setConfirm({ msg: `Delete Room ${room.so_phong}?`, cb: () => deleteRoom(room) })}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {confirm && <Confirm msg={confirm.msg} onYes={confirm.cb} onNo={() => setConfirm(null)}/>}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

// ─── RESERVATION ─────────────────────────────────────────────

export default ManageRoomsPage;
import { useState, useEffect } from "react";
import { apiFetch, fmt, fmtDate, MONTHS } from "../../utils/adminApi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { MOCK, STATUS_MAP, Badge } from "./shared";
import { LayoutDashboard, BedDouble, CalendarDays, DollarSign, TrendingUp, TrendingDown, Wrench, Home, Users, UserCog } from "lucide-react";

function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/admin/dashboard").then(r => setData(r || MOCK.dashboard));
  }, []);

  if (!data) return <div className="loading">Loading…</div>;

  const chartData = data.doanh_thu_theo_thang.map(d => ({
    name: MONTHS[d._id.thang - 1],
    value: d.tong
  }));

  const statusMap = {};
  data.dat_phong.theo_trang_thai.forEach(s => { statusMap[s._id] = s.so_luong; });

  return (
    <div className="page fade-in">
      <h1 className="page-title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="stat-grid">
        {[
          { label: "Total Rooms", val: data.phong.tong, icon: <Home size={28}/> },
          { label: "Available Rooms", val: data.phong.trong, icon: <BedDouble size={28}/> },
          { label: "Total Bookings", val: data.dat_phong.tong, icon: <CalendarDays size={28}/> },
          { label: "Total Revenue", val: `$${fmt(data.tong_doanh_thu)}`, icon: <DollarSign size={28}/> },
        ].map(c => (
          <div className="stat-card" key={c.label}>
            <div>
              <p className="stat-label">{c.label}</p>
              <p className="stat-val">{c.val}</p>
            </div>
            <div className="stat-icon">{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Revenue Chart */}
        <div className="card chart-card">
          <h3 className="card-title">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c8a84b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8"/>
              <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v => [`$${fmt(v)}`, "Revenue"]}/>
              <Area type="monotone" dataKey="value" stroke="#c8a84b" strokeWidth={2} fill="url(#revGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Cards */}
        <div className="status-col">
          <div className="card">
            <h3 className="card-title">Room status</h3>
            <div className="legend-list">
              <div className="legend-item"><span className="dot green"/><span>Available ({data.phong.trong})</span></div>
              <div className="legend-item"><span className="dot blue"/><span>Occupied ({data.phong.dang_o})</span></div>
              <div className="legend-item"><span className="dot red"/><span>Maintenance ({data.phong.bao_duong})</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Booking status</h3>
            <div className="legend-list">
              <div className="legend-item"><span className="dot yellow"/><span>Pending ({statusMap.pending || 0})</span></div>
              <div className="legend-item"><span className="dot lime"/><span>Confirmed ({statusMap.confirmed || 0})</span></div>
              <div className="legend-item"><span className="dot green"/><span>Checked-in ({statusMap.checked_in || 0})</span></div>
              <div className="legend-item"><span className="dot red"/><span>Cancelled ({statusMap.cancelled || 0})</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Recent Booking</h3>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Booking ID</th><th>Guest Name</th><th>Room Type</th><th>Room Number</th><th>Check-in</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.dat_phong_gan_day.map(b => (
                <tr key={b.ma_datphong}>
                  <td><strong>{b.ma_datphong}</strong></td>
                  <td>{b.id_khachhang?.ho_ten}</td>
                  <td>{b.id_phong?.loai_phong}</td>
                  <td>R{b.id_phong?.so_phong}</td>
                  <td>{fmtDate(b.ngay_checkin)}</td>
                  <td><Badge status={b.trang_thai}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MANAGE ROOMS ─────────────────────────────────────────────

export default DashboardPage;
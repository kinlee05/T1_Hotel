import { useState, useEffect } from "react";
import { apiFetch, fmt, MONTHS } from "../../utils/adminApi";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { MOCK } from "./shared";

const PIE_COLORS = ["#4e9af1", "#4caf82", "#f5a623"];

function RevenuePage() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [roomType, setRoomType] = useState("All");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (roomType !== "All") params.set("loai_phong", roomType);
    const r = await apiFetch(`/admin/revenue?${params}`);
    setData(r || MOCK.revenue);
  }, [from, to, roomType]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="loading">Loading…</div>;

  const chartData = data.revenue_overview.map(d => ({ name: d.label, value: d.value }));
  const pieData = data.revenue_by_room_type.map(d => ({ name: d._id, value: d.tong }));

  return (
    <div className="page fade-in">
      <h1 className="page-title">Revenue Management</h1>

      {/* Filters */}
      <div className="rev-filters">
        <div className="form-group"><label>From</label><input className="inp" type="date" value={from} onChange={e => setFrom(e.target.value)}/></div>
        <div className="form-group"><label>To</label><input className="inp" type="date" value={to} onChange={e => setTo(e.target.value)}/></div>
        <div className="form-group"><label>Room Type</label>
          <select className="inp" value={roomType} onChange={e => setRoomType(e.target.value)}>
            <option>All</option><option>Standard</option><option>Deluxe</option><option>Suite</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <div className="stat-card">
          <div>
            <p className="stat-label">This month Revenue</p>
            <p className="stat-val">${fmt(data.this_month_revenue)}</p>
            <p className={`trend ${data.percent_vs_last_month >= 0 ? "up" : "down"}`}>
              {data.percent_vs_last_month >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
              {Math.abs(data.percent_vs_last_month)}% vs last month
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Occupancy Rate</p><p className="stat-val">{data.occupancy_rate}%</p></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Average Room Price</p><p className="stat-val">${fmt(data.avg_room_price)}</p></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Revenue per room</p><p className="stat-val">${fmt(data.revenue_per_room)}</p></div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Line Chart */}
        <div className="card chart-card">
          <h3 className="card-title">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top:10, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c8a84b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8"/>
              <XAxis dataKey="name" tick={{ fontSize:12 }}/>
              <YAxis tick={{ fontSize:12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v => [`$${fmt(v)}`, "Revenue"]}/>
              <Area type="monotone" dataKey="value" stroke="#c8a84b" strokeWidth={2} fill="url(#revGrad2)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="card">
          <h3 className="card-title">Revenue by Room Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Pie>
              <Legend formatter={(v) => <span style={{ fontSize:13 }}>{v}</span>}/>
              <Tooltip formatter={v => `$${fmt(v)}`}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────

export default RevenuePage;
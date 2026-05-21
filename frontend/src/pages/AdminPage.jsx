import { useState } from "react";
import {
  LayoutDashboard, Home, CalendarDays, Users, UserCog, DollarSign, LogOut, Menu
} from "lucide-react";
import DashboardPage  from "../components/admin/Dashboard";
import ManageRoomsPage from "../components/admin/Rooms";
import ReservationPage from "../components/admin/Reservation";
import CustomersPage   from "../components/admin/Customers";
import EmployeesPage   from "../components/admin/Employees";
import RevenuePage     from "../components/admin/Revenue";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rooms", label: "Manage Rooms", icon: Home },
  { id: "reservation", label: "Reservation", icon: CalendarDays },
  { id: "customers", label: "Customers", icon: Users },
  { id: "employees", label: "Employees", icon: UserCog },
  { id: "revenue", label: "Revenue", icon: DollarSign },
];

function Sidebar({ active, setActive, collapsed, onLogout }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-mark">
          <span>TH</span>
          {!collapsed && <span className="logo-hotel">HOTEL</span>}
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
            title={collapsed ? label : ""}
          >
            <Icon size={20}/>
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
      <button className="nav-item logout" onClick={onLogout}>
        <LogOut size={20}/>
        {!collapsed && <span>Log out</span>}
      </button>
    </aside>
  );
}

// AdminPage nhận onLogout từ App.jsx (đã verify auth qua AuthContext)
export default function AdminPage({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const PAGES = {
    dashboard: DashboardPage,
    rooms: ManageRoomsPage,
    reservation: ReservationPage,
    customers: CustomersPage,
    employees: EmployeesPage,
    revenue: RevenuePage,
  };
  const Page = PAGES[page] || DashboardPage;

  return (
    <div className="admin-scope"><div className="app-shell">
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} onLogout={onLogout}/>
      <div className="main-col">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setCollapsed(c => !c)}><Menu size={20}/></button>
          <div style={{ flex:1 }}/>
          <div className="topbar-right">
            <div className="admin-pill">
              <div className="admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>
        <main className="content-area">
          <Page/>
        </main>
      </div>
    </div></div>
  );
}

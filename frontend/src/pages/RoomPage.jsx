/**
 * src/pages/RoomPage.jsx
 * Danh sách phòng — gọi /api/public/phong (không cần đăng nhập).
 */
import { useState, useEffect } from 'react';
import api from '../api';
import { S } from '../styles/theme';
import GoldBtn from '../components/shared/GoldBtn';

function StarRating({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#C9A84C' : '#3a3530', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

export default function RoomsPage({ setPage, setSelectedRoom, searchParams = {} }) {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Filter state (khởi tạo từ searchParams được truyền từ HomePage)
  const [filter, setFilter]     = useState(searchParams.roomType || 'all');
  const [checkIn, setCheckIn]   = useState(searchParams.checkIn  || '');
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || '');
  const [guests, setGuests]     = useState(searchParams.guests   || 1);

  // ── Gọi API mỗi khi filter thay đổi ──────────────────────────────────────
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { limit: 20 };
        if (filter !== 'all') params.loai_phong = filter;
        if (guests > 1)       params.so_khach   = guests;
        if (checkIn)          params.ngay_checkin  = checkIn;
        if (checkOut)         params.ngay_checkout = checkOut;

        const { data } = await api.get('/public/phong', { params });
        setRooms(data.data || []);
      } catch (err) {
        setError('Không thể tải danh sách phòng. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filter, checkIn, checkOut, guests]);

  const types = ['all', 'Standard', 'Deluxe', 'Suite'];
  const inp = {
    padding: '8px 12px', border: '1.5px solid #d0c8bc', borderRadius: 8,
    fontSize: 13, background: '#fff', color: '#1a1208', fontFamily: 'inherit', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
      {/* Header + Filters */}
      <div style={{ background: '#f5f0e8', padding: '48px 60px 24px', borderBottom: '1px solid #e0d8cc' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#1a1208', marginBottom: 20 }}>
          Explore &amp; Book Your Stay
        </h1>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: '#9a8e80', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Nhận phòng</div>
            <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]}
              onChange={e => setCheckIn(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#9a8e80', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Trả phòng</div>
            <input type="date" value={checkOut} min={checkIn}
              onChange={e => setCheckOut(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#9a8e80', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Số khách</div>
            <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={inp}>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} khách</option>)}
            </select>
          </div>
          {(checkIn || checkOut) && (
            <button onClick={() => { setCheckIn(''); setCheckOut(''); setGuests(1); }}
              style={{ ...inp, cursor: 'pointer', color: '#C9A84C', border: '1.5px solid #C9A84C' }}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Type tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '7px 20px', borderRadius: 20,
              border: filter === t ? '1.5px solid #C9A84C' : '1.5px solid #d0c8bc',
              background: filter === t ? '#C9A84C' : '#fff',
              color: filter === t ? '#fff' : '#5a5040',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t === 'all' ? 'All Rooms' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div style={{ padding: '28px 60px 60px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9a8e80' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <p>Đang tải danh sách phòng...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9a8e80' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
            <p>Không tìm thấy phòng phù hợp với tiêu chí tìm kiếm.</p>
            {(checkIn || checkOut) && <p style={{ marginTop: 8, fontSize: 13 }}>Thử thay đổi ngày hoặc loại phòng.</p>}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} setPage={setPage} setSelectedRoom={setSelectedRoom}
              checkIn={checkIn} checkOut={checkOut} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, setPage, setSelectedRoom, checkIn, checkOut }) {
  const [hovered, setHovered] = useState(false);

  const nights = (checkIn && checkOut)
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : null;

  // Map amenities string → array
  const amenities = room.tien_nghi
    ? room.tien_nghi.split(',').map(s => s.trim()).slice(0, 5)
    : [];

  const handleSelect = () => {
    // Đính kèm ngày tìm kiếm vào room object để RoomDetailPage dùng
    setSelectedRoom({ ...room, checkIn, checkOut });
    setPage('room-detail');
  };

  return (
    <div
      style={{
        background: '#fff', borderRadius: 12, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '300px 1fr',
        border: hovered ? '1.5px solid #C9A84C' : '1.5px solid #e8e0d4',
        transition: 'all 0.25s',
        boxShadow: hovered ? '0 8px 32px rgba(201,168,76,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ảnh */}
      <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={handleSelect}>
        <img
          src={room.hinh_anh || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80`}
          alt={`Phòng ${room.so_phong}`}
          style={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,8,6,0.72)', color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(201,168,76,0.4)' }}>
          {room.loai_phong}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(10,8,6,0.72)', color: '#d0c8bc', fontSize: 11, padding: '4px 10px', borderRadius: 4 }}>
          Tầng {room.tang}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#1a1208', margin: '0 0 8px' }}>
            Phòng {room.so_phong} — {room.loai_phong}
          </h2>

          <p style={{ fontSize: 13, color: '#6b5e50', lineHeight: 1.65, marginBottom: 14, maxWidth: 480 }}>
            {room.mo_ta || `Phòng rộng ${room.dien_tich}m², thoáng mát, đầy đủ tiện nghi hiện đại.`}
          </p>

          {/* Specs */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 14, fontSize: 13, color: '#6b5e50' }}>
            <span>🛏 {room.so_giuong} giường</span>
            <span>👤 Tối đa {room.suc_chua} khách</span>
            <span>📐 {room.dien_tich}m²</span>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {amenities.map(a => (
                <span key={a} style={{ fontSize: 11, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '3px 9px', borderRadius: 20 }}>
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ede6da', paddingTop: 16 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#1a1208' }}>
              ${room.gia_moi_dem}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#9a8e80' }}>/đêm</span>
            </div>
            {nights && (
              <div style={{ fontSize: 12, color: '#9a8e80', marginTop: 2 }}>
                {nights} đêm = <strong style={{ color: '#C9A84C' }}>${room.gia_moi_dem * nights}</strong>
              </div>
            )}
          </div>
          <button onClick={handleSelect} style={{
            padding: '10px 28px',
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)',
            border: 'none', color: '#1a0e00', borderRadius: 6,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Xem & Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
}
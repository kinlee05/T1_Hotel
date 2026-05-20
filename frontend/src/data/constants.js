export const ROOMS = [
  { id: 1, name: "Deluxe King Room", type: "Deluxe", price: 2800000, originalPrice: 3500000, area: 35, beds: 1, guests: 2, floor: 5, view: "Hướng biển", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", amenities: ["Wi-Fi", "Mini Bar", "Jacuzzi", "Smart TV"], available: true, rating: 4.8, reviews: 124 },
  { id: 2, name: "Superior Twin Room", type: "Superior", price: 1900000, originalPrice: 2200000, area: 28, beds: 2, guests: 2, floor: 3, view: "Hướng vườn", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", amenities: ["Wi-Fi", "Mini Bar", "Smart TV"], available: true, rating: 4.5, reviews: 89 },
  { id: 3, name: "Presidential Suite", type: "Suite", price: 8500000, originalPrice: 10000000, area: 120, beds: 1, guests: 4, floor: 12, view: "Panorama 360°", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", amenities: ["Wi-Fi", "Kitchen", "Jacuzzi", "Butler", "Smart TV", "Sauna"], available: true, rating: 4.9, reviews: 56 },
  { id: 4, name: "Ocean View Suite", type: "Suite", price: 5500000, originalPrice: 6500000, area: 75, beds: 1, guests: 3, floor: 10, view: "Hướng biển", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", amenities: ["Wi-Fi", "Jacuzzi", "Mini Bar", "Smart TV", "Lounge"], available: false, rating: 4.7, reviews: 73 },
  { id: 5, name: "Standard Double Room", type: "Standard", price: 1200000, originalPrice: 1400000, area: 22, beds: 1, guests: 2, floor: 2, view: "Hướng sân", img: "https://images.unsplash.com/photo-1631049035634-e7df706dcca1?w=600&q=80", amenities: ["Wi-Fi", "Smart TV"], available: true, rating: 4.2, reviews: 201 },
  { id: 6, name: "Family Suite", type: "Suite", price: 6200000, originalPrice: 7500000, area: 95, beds: 3, guests: 6, floor: 8, view: "Hướng biển", img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", amenities: ["Wi-Fi", "Kitchen", "Smart TV", "Kids Area", "Mini Bar"], available: true, rating: 4.6, reviews: 45 },
];

export const SERVICES = [
  { id: "breakfast", label: "Bữa sáng buffet", price: 250000, icon: "☕", per: "người/ngày" },
  { id: "airport", label: "Xe đưa đón sân bay", price: 450000, icon: "🚐", per: "lượt" },
  { id: "spa", label: "Gói Spa thư giãn", price: 800000, icon: "💆", per: "người" },
  { id: "dinner", label: "Bữa tối lãng mạn", price: 650000, icon: "🍷", per: "2 người" },
];

export const PROMO_CODES = { "LUXURY20": 20, "SUMMER10": 10, "VIP30": 30 };

export const DEMO_USER = {
  name: "Nguyễn Văn An",
  email: "nguyenvanan@email.com",
  phone: "0901234567",
  dob: "1990-05-15",
  gender: "Nam",
  address: "123 Lê Lợi, Q.1, TP.HCM",
  tier: "Gold Member",
  points: 3200,
};

export const DEMO_ORDERS = [
  { id: "ORD-2024-001", room: "Presidential Suite", checkIn: "2024-12-20", checkOut: "2024-12-25", guests: 2, total: 42500000, status: "completed", services: ["breakfast", "spa"], payment: "Thẻ ngân hàng", createdAt: "2024-12-15" },
  { id: "ORD-2024-002", room: "Ocean View Suite", checkIn: "2025-01-10", checkOut: "2025-01-13", guests: 2, total: 16500000, status: "confirmed", services: ["breakfast", "airport"], payment: "QR Code", createdAt: "2025-01-05" },
  { id: "ORD-2024-003", room: "Deluxe King Room", checkIn: "2025-02-14", checkOut: "2025-02-16", guests: 2, total: 6650000, status: "pending", services: ["dinner"], payment: "Chờ thanh toán", createdAt: "2025-02-10" },
];

export const DEMO_REVIEWS = [
  { id: 1, orderId: "ORD-2024-001", room: "Presidential Suite", rating: 5, comment: "Dịch vụ tuyệt vời, phòng rộng rãi và sạch sẽ. Nhân viên rất nhiệt tình!", date: "2024-12-26", reply: "Cảm ơn quý khách đã tin tưởng lựa chọn chúng tôi!" },
  { id: 2, orderId: "ORD-2024-002", room: "Ocean View Suite", rating: 4, comment: "View biển cực đẹp, bữa sáng ngon. Sẽ quay lại lần sau!", date: "2025-01-14", reply: null },
];
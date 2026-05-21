export const S = {
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  dark: "#0A0A0A",
  darkCard: "#141414",
  darkBg: "#0D0D0D",
  text: "#F5F0E8",
  muted: "#8A8070",
  border: "rgba(201,168,76,0.25)",
  success: "#2ECC71",
  danger: "#E74C3C",
  warning: "#F39C12",
};

export const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export const calcNights = (a, b) => {
  if (!a || !b) return 1;
  const d = (new Date(b) - new Date(a)) / 86400000;
  return d > 0 ? d : 1;
};

export const fmtD = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "");
import { S } from "../../styles/theme";

export default function Stars({ rating, size = 14 }) {
  return (
    <span style={{ color: S.gold, fontSize: size }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: S.muted, fontSize: size - 2, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}
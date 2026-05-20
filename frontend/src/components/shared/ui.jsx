import { S } from "../../styles/theme";

export function InputBlock({ label, children }) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          color: S.muted,
          letterSpacing: 2,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function Hr() {
  return <div style={{ height: 1, background: S.border, margin: "20px 0" }} />;
}
import React from "react";

export default function TextQuadrant({ title, value, onChange }) {
  return (
    <div style={{ fontFamily: "'Inter', Arial, sans-serif", height: "100%" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 4
      }}>
        <h2 style={{
          color: "#D40511",
          fontWeight: 700,
          margin: 0,
          fontSize: 22,
          lineHeight: "36px"
        }}>{title}</h2>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          border: "1px solid #D40511",
          borderRadius: 6,
          padding: 8,
          fontSize: 15,
          background: "#f8f9fa",
          resize: "none",
          height: "140px"
        }}
      />
    </div>
  );
}

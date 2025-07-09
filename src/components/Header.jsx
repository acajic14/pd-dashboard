import React from "react";

export default function Header({ title, pageLabel }) {
  // Format date as dd.mm.yyyy
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Use dd.mm.yyyy format (with leading zeros)
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  };

  return (
    <div style={{
      background: "#FFCC00",
      padding: "18px 32px 10px 32px",
      borderRadius: "10px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      fontFamily: "'Inter', Arial, sans-serif"
    }}>
      <div>
        <h1 style={{ color: "#D40511", fontSize: 32, margin: 0, fontWeight: 700 }}>{title}</h1>
        <div style={{
          color: "#D40511",
          fontSize: 16,
          fontStyle: "italic",
          marginTop: 2,
          fontWeight: 400
        }}>
          Excellence. Simply delivered.
        </div>
      </div>
      <div style={{
        color: "#D40511",
        fontWeight: 600,
        fontSize: 18,
        marginTop: 8
      }}>
        {formatDate(new Date())}
      </div>
    </div>
  );
}

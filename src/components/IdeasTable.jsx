import React from "react";

export default function IdeasTable({ dashboardData, updateDashboardData }) {
  // Get current data from dashboardData with fallbacks
  const rows = dashboardData.ideasActions || [
    { idea: "Improve process", todo: "Review SOP", who: "Ana", when: "10.07", status: "In Progress" }
  ];

  function handleAdd() {
    const newRows = [...rows, { idea: "", todo: "", who: "", when: "", status: "In Progress" }];
    updateDashboardData({ ideasActions: newRows });
  }

  function handleChange(i, field, value) {
    const updated = rows.map((row, index) => index === i ? { ...row, [field]: value } : row);
    updateDashboardData({ ideasActions: updated });
  }

  function handleDelete(i) {
    const newRows = rows.filter((_, idx) => idx !== i);
    updateDashboardData({ ideasActions: newRows });
  }

  // Simplified date handling - store exactly what user types
  const handleDateChange = (i, value) => {
    // Allow typing and validate dd.mm format
    const cleanValue = value.replace(/[^\d.]/g, ''); // Only allow digits and dots
    
    // Auto-format as user types
    if (cleanValue.length === 2 && !cleanValue.includes('.')) {
      handleChange(i, "when", cleanValue + '.');
    } else if (cleanValue.length <= 5) {
      handleChange(i, "when", cleanValue);
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "#FFCC00"; // DHL Yellow
      case "Completed":
        return "#28a745"; // Green
      default:
        return "#333"; // Default dark color
    }
  };

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
          fontSize: 22,
          margin: 0,
          lineHeight: "36px"
        }}>💡 Ideas & Actions</h2>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontSize: 13, tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#FFCC00" }}>
            <th style={{ padding: "8px", textAlign: "left", fontWeight: 600, width: "30%" }}>Idea</th>
            <th style={{ padding: "8px", textAlign: "left", fontWeight: 600, width: "30%" }}>To Do</th>
            <th style={{ padding: "8px", textAlign: "left", fontWeight: 600, width: "16%" }}>Who</th>
            <th style={{ padding: "8px", textAlign: "left", fontWeight: 600, width: "12%" }}>Till When</th>
            <th style={{ padding: "8px", textAlign: "left", fontWeight: 600, width: "17%" }}>Status</th>
            <th style={{ padding: "8px", textAlign: "center", fontWeight: 600, width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "3px", verticalAlign: "top" }}>
                <textarea
                  value={row.idea}
                  onChange={e => handleChange(i, "idea", e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    padding: "3px",
                    borderRadius: "3px",
                    resize: "vertical",
                    fontSize: 10, // Reduced from 12px to 10px
                    fontFamily: "'Inter', Arial, sans-serif",
                    minHeight: "30px",
                    lineHeight: "1.2", // Reduced from 1.3 to 1.2
                    boxSizing: "border-box"
                  }}
                  rows={2}
                  placeholder="Enter idea details..."
                />
              </td>
              <td style={{ padding: "3px", verticalAlign: "top" }}>
                <textarea
                  value={row.todo}
                  onChange={e => handleChange(i, "todo", e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    padding: "3px",
                    borderRadius: "3px",
                    resize: "vertical",
                    fontSize: 10, // Reduced from 12px to 10px
                    fontFamily: "'Inter', Arial, sans-serif",
                    minHeight: "30px",
                    lineHeight: "1.2", // Reduced from 1.3 to 1.2
                    boxSizing: "border-box"
                  }}
                  rows={2}
                  placeholder="Action steps required..."
                />
              </td>
              <td style={{ padding: "3px", verticalAlign: "top" }}>
                <input 
                  value={row.who} 
                  onChange={e => handleChange(i, "who", e.target.value)} 
                  style={{ 
                    width: "100%", 
                    border: "1px solid #ddd", 
                    padding: "3px", 
                    borderRadius: "3px",
                    boxSizing: "border-box",
                    fontSize: 11,
                    minHeight: "24px"
                  }} 
                  placeholder="Name"
                />
              </td>
              <td style={{ padding: "3px", verticalAlign: "top" }}>
                <input 
                  type="text"
                  value={row.when}
                  onChange={e => handleDateChange(i, e.target.value)}
                  style={{ 
                    width: "100%", 
                    border: "1px solid #ddd", 
                    padding: "3px", 
                    borderRadius: "3px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    fontSize: 11,
                    minHeight: "24px"
                  }}
                  placeholder="dd.mm"
                  maxLength={5}
                />
              </td>
              <td style={{ padding: "3px", verticalAlign: "top" }}>
                <select 
                  value={row.status} 
                  onChange={e => handleChange(i, "status", e.target.value)}
                  style={{ 
                    width: "100%", 
                    border: "1px solid #ddd", 
                    padding: "3px", 
                    borderRadius: "3px",
                    backgroundColor: getStatusColor(row.status),
                    color: row.status === "In Progress" ? "#333" : "#fff",
                    fontWeight: 600,
                    boxSizing: "border-box",
                    fontSize: 11,
                    minHeight: "30px"
                  }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td style={{ padding: "3px", textAlign: "center", verticalAlign: "top" }}>
                <button 
                  onClick={() => handleDelete(i)} 
                  style={{ 
                    color: "#fff", 
                    background: "#D40511", 
                    border: "none", 
                    borderRadius: 4, 
                    padding: "3px 5px",
                    cursor: "pointer",
                    fontSize: "10px",
                    minHeight: "22px"
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={handleAdd} 
        style={{
          marginTop: 8, 
          background: "#D40511", 
          color: "#fff", 
          border: "none", 
          borderRadius: 4, 
          padding: "6px 12px", 
          fontSize: 13,
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Add Row
      </button>
    </div>
  );
}

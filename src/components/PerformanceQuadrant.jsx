import React, { useState, useImperativeHandle, forwardRef } from "react";
import KpiCard from "./KpiCard";

// Available layouts: label, rows, cols, max KPIs
const LAYOUTS = [
  { label: "1 × 1", rows: 1, cols: 1 },
  { label: "1 × 2", rows: 1, cols: 2 },
  { label: "1 × 3", rows: 1, cols: 3 },
  { label: "1 × 4", rows: 1, cols: 4 },
  { label: "2 × 1", rows: 2, cols: 1 },
  { label: "2 × 2", rows: 2, cols: 2 },
  { label: "2 × 3", rows: 2, cols: 3 },
  { label: "2 × 4", rows: 2, cols: 4 }
];

const DEFAULT_LAYOUT = LAYOUTS[7]; // 2 × 4

const PerformanceQuadrant = forwardRef(function PerformanceQuadrant({
  editable,
  onToggleEdit,
  dashboardData,
  updateDashboardData
}, ref) {
  const [showMenu, setShowMenu] = useState(false);

  // Get current data from dashboardData with fallbacks
  const kpis = dashboardData.kpis || [
    { name: "On-Time Delivery", value: 98, target: 95, period: "permanent", higherIsBetter: true },
    { name: "Error Rate", value: 1.2, target: 2, period: "permanent", higherIsBetter: false }
  ];
  const layout = dashboardData.performanceLayout || DEFAULT_LAYOUT;

  useImperativeHandle(ref, () => ({
    handleAddKpi
  }));

  function handleEditKpi(index, updated) {
    const newKpis = kpis.map((kpi, i) => i === index ? { ...kpi, ...updated } : kpi);
    updateDashboardData({ kpis: newKpis });
  }

  function handleAddKpi() {
    const maxKpis = layout.rows * layout.cols;
    if (kpis.length < maxKpis) {
      const newKpis = [
        ...kpis,
        { name: "New KPI", value: 0, target: 0, period: "permanent", higherIsBetter: true }
      ];
      updateDashboardData({ kpis: newKpis });
    }
    setShowMenu(false);
  }

  function handleDeleteKpi(index) {
    if (kpis.length > 1) {
      const newKpis = kpis.filter((_, i) => i !== index);
      updateDashboardData({ kpis: newKpis });
    }
  }

  function handleMoveKpi(index, direction) {
    const newKpis = [...kpis];
    const [removed] = newKpis.splice(index, 1);
    newKpis.splice(index + direction, 0, removed);
    updateDashboardData({ kpis: newKpis });
  }

  function handleLayoutChange(newLayout) {
    const maxKpis = newLayout.rows * newLayout.cols;
    let updatedKpis = kpis;
    
    // If reducing max KPIs, trim the array
    if (kpis.length > maxKpis) {
      updatedKpis = kpis.slice(0, maxKpis);
    }
    
    updateDashboardData({ 
      performanceLayout: newLayout,
      kpis: updatedKpis
    });
  }

  // Render the selected number of rows/cols
  const maxKpis = layout.rows * layout.cols;
  const kpiRows = [];
  for (let r = 0; r < layout.rows; r++) {
    kpiRows.push(kpis.slice(r * layout.cols, (r + 1) * layout.cols));
  }

  // Calculate card width based on number of columns
  const getCardWidth = (colsInLayout) => {
    switch (colsInLayout) {
      case 1: return "70%";
      case 2: return "45%";
      case 3: return "30%";
      case 4: return "22%";
      default: return "20%";
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', Arial, sans-serif", position: "relative", height: "100%" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4
      }}>
        <h2 style={{
          color: "#D40511",
          fontWeight: 700,
          margin: 0,
          fontSize: 22,
          lineHeight: "36px"
        }}>📈 Performance</h2>
        <button
          onClick={() => setShowMenu(m => !m)}
          style={{
            background: "#eee",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            cursor: "pointer"
          }}
          title="KPI Controls & Layout"
        >
          <span role="img" aria-label="settings">⚙️</span>
        </button>
        {showMenu && (
          <div style={{
            position: "absolute",
            top: 44,
            right: 0,
            zIndex: 100,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            boxShadow: "0 2px 8px #ddd",
            padding: 12,
            minWidth: 200
          }}>
            <div style={{ marginBottom: 12, fontWeight: 600, color: "#D40511", fontSize: 14 }}>KPI Layout</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
              {LAYOUTS.map(opt => (
                <label key={opt.label} style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="radio"
                    checked={layout.rows === opt.rows && layout.cols === opt.cols}
                    onChange={() => handleLayoutChange(opt)}
                    style={{ marginRight: 6 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button
              onClick={handleAddKpi}
              style={{
                background: "#D40511",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 14px",
                width: "100%",
                marginBottom: 8
              }}
              disabled={kpis.length >= maxKpis}
            >Add KPI ({kpis.length}/{maxKpis})</button>
            <button
              onClick={() => { onToggleEdit(); setShowMenu(false); }}
              style={{
                background: editable ? "#eee" : "#D40511",
                color: editable ? "#D40511" : "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 14px",
                width: "100%"
              }}
            >{editable ? "Lock Editing" : "Unlock Editing"}</button>
          </div>
        )}
      </div>
      {/* Render the chosen layout with centered, grouped KPIs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "center" }}>
        {kpiRows.map((row, rowIdx) => (
          <div key={rowIdx} style={{
            display: "flex",
            gap: 16,
            minHeight: 80,
            justifyContent: "center",
            width: "100%"
          }}>
            {row.map((kpi, i) => {
              const achieved = kpi.higherIsBetter
                ? kpi.value >= kpi.target
                : kpi.value <= kpi.target;
              const diff = kpi.higherIsBetter
                ? kpi.value - kpi.target
                : kpi.target - kpi.value;
              const diffPercent = kpi.target !== 0
                ? ((diff / kpi.target) * 100).toFixed(1)
                : "0.0";
              return (
                <div key={i + rowIdx * layout.cols} style={{ width: getCardWidth(layout.cols) }}>
                  <KpiCard
                    name={kpi.name}
                    value={kpi.value}
                    target={kpi.target}
                    period={kpi.period}
                    higherIsBetter={kpi.higherIsBetter}
                    achieved={achieved}
                    diffPercent={diffPercent}
                    editable={editable}
                    onEdit={updated => handleEditKpi(i + rowIdx * layout.cols, updated)}
                    onDelete={() => handleDeleteKpi(i + rowIdx * layout.cols)}
                    onMoveUp={() => (i + rowIdx * layout.cols) > 0 && handleMoveKpi(i + rowIdx * layout.cols, -1)}
                    onMoveDown={() => (i + rowIdx * layout.cols) < kpis.length - 1 && handleMoveKpi(i + rowIdx * layout.cols, 1)}
                    isFirst={(i + rowIdx * layout.cols) === 0}
                    isLast={(i + rowIdx * layout.cols) === kpis.length - 1}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

export default PerformanceQuadrant;

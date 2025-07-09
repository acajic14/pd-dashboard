import React, { useState } from "react";

export default function KpiCard({
  name,
  value,
  target,
  period,
  higherIsBetter,
  achieved,
  diffPercent,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  editable,
  isFirst,
  isLast
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name, value, target, period, higherIsBetter });

  function handleSave() {
    onEdit(draft);
    setEditing(false);
  }

  return (
    <div
      style={{
        borderLeft: `4px solid ${achieved ? "green" : "red"}`,
        background: "#f8f9fa",
        padding: 14,
        borderRadius: 8,
        margin: "8px 0",
        textAlign: "center",
        minWidth: 120,
        position: "relative",
        fontFamily: "'Inter', Arial, sans-serif"
      }}
      tabIndex={0}
      aria-label={`Edit KPI ${name}`}
    >
      {editing ? (
        <div>
          <input
            value={draft.name}
            onChange={e => setDraft({ ...draft, name: e.target.value })}
            style={{ fontWeight: 700, fontSize: 16, width: "90%" }}
          />
          <div style={{ margin: "6px 0" }}>
            <input
              type="number"
              value={draft.value}
              onChange={e => setDraft({ ...draft, value: Number(e.target.value) })}
              style={{ fontSize: 16, width: "44%", margin: 3 }}
            />
            <span style={{ fontSize: 13 }}> / </span>
            <input
              type="number"
              value={draft.target}
              onChange={e => setDraft({ ...draft, target: Number(e.target.value) })}
              style={{ fontSize: 16, width: "44%", margin: 3 }}
            />
          </div>
          <select
            value={draft.period}
            onChange={e => setDraft({ ...draft, period: e.target.value })}
            style={{ width: "90%", marginTop: 2 }}
          >
            <option value="permanent">Permanent</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
            <option value="mtd">Month to Date (MTD)</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>
          <select
            value={draft.higherIsBetter ? "higher" : "lower"}
            onChange={e => setDraft({ ...draft, higherIsBetter: e.target.value === "higher" })}
            style={{ width: "90%", marginTop: 4 }}
          >
            <option value="higher">Higher is better</option>
            <option value="lower">Lower is better</option>
          </select>
          <div style={{ marginTop: 7 }}>
            <button onClick={handleSave} style={{ background: "#D40511", color: "#fff", border: "none", borderRadius: 4, padding: "3px 10px", marginRight: 4 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ background: "#eee", color: "#D40511", border: "none", borderRadius: 4, padding: "3px 10px" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div onClick={() => editable && setEditing(true)} style={{ cursor: editable ? "pointer" : "default" }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: achieved ? "green" : "red" }}>{value}</div>
          <div style={{ fontSize: 11, color: "#666" }}>
            Target: {target} <span style={{ fontStyle: "italic" }}>({period})</span>
          </div>
          <div style={{ fontSize: 13, color: achieved ? "green" : "red", marginTop: 2 }}>
            {diffPercent > 0 ? "+" : ""}
            {diffPercent}%
          </div>
        </div>
      )}
      {editable && !editing && (
        <div style={{ position: "absolute", top: 4, right: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <button
            onClick={onDelete}
            style={{
              background: "rgba(0,0,0,0.05)",
              color: "#888",
              border: "none",
              borderRadius: "50%",
              width: 18,
              height: 18,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 12,
              marginBottom: 2
            }}
            title="Delete KPI"
          >×</button>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            style={{
              background: "rgba(0,0,0,0.05)",
              color: isFirst ? "#ccc" : "#888",
              border: "none",
              borderRadius: "50%",
              width: 18,
              height: 18,
              cursor: isFirst ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 12
            }}
            title="Move Up"
          >↑</button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            style={{
              background: "rgba(0,0,0,0.05)",
              color: isLast ? "#ccc" : "#888",
              border: "none",
              borderRadius: "50%",
              width: 18,
              height: 18,
              cursor: isLast ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 12
            }}
            title="Move Down"
          >↓</button>
        </div>
      )}
    </div>
  );
}

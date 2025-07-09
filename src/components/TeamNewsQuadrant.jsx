import React, { useState } from "react";

export default function TeamNewsQuadrant() {
  const [teamText, setTeamText] = useState("");
  const [showFormat, setShowFormat] = useState(false);
  const teamTextareaRef = React.useRef();

  // Helper functions for text formatting
  const insertBulletPoint = () => {
    const textarea = teamTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = teamText.substring(start, end);
    const beforeText = teamText.substring(0, start);
    const afterText = teamText.substring(end);
    
    const isNewLine = start === 0 || teamText[start - 1] === '\n';
    const prefix = isNewLine ? '• ' : '\n• ';
    
    const newText = beforeText + prefix + selectedText + afterText;
    setTeamText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertParagraph = () => {
    const textarea = teamTextareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = teamText.substring(0, start);
    const afterText = teamText.substring(start);
    
    const newText = beforeText + '\n\n' + afterText;
    setTeamText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  return (
    <div style={{ fontFamily: "'Inter', Arial, sans-serif", height: "100%" }}>
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
        }}>👥 Team News</h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowFormat(f => !f)}
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
            title="Text Formatting"
          >
            <span role="img" aria-label="settings">⚙️</span>
          </button>
          {showFormat && (
            <div style={{
              position: "absolute",
              top: 44,
              right: 0,
              zIndex: 100,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              boxShadow: "0 2px 8px #ddd",
              padding: 8,
              minWidth: 140
            }}>
              <button
                onClick={() => { insertBulletPoint(); setShowFormat(false); }}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #D40511",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  color: "#D40511",
                  fontWeight: 600,
                  width: "100%",
                  marginBottom: 4
                }}
              >
                • Add Bullet Point
              </button>
              <button
                onClick={() => { insertParagraph(); setShowFormat(false); }}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #D40511",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  color: "#D40511",
                  fontWeight: 600,
                  width: "100%"
                }}
              >
                ¶ Add Paragraph
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Team News Text Field */}
      <div style={{ flex: 1 }}>
        <textarea
          ref={teamTextareaRef}
          value={teamText}
          onChange={e => setTeamText(e.target.value)}
          placeholder="Enter team news, updates, achievements, or announcements..."
          style={{
            width: "calc(100% - 16px)",
            border: "1px solid #D40511",
            borderRadius: 6,
            padding: 8,
            fontSize: 14,
            background: "#f8f9fa",
            resize: "vertical",
            height: "280px",
            lineHeight: "1.5",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap"
          }}
        />
      </div>
    </div>
  );
}

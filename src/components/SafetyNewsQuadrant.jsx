import React, { useState } from "react";

export default function SafetyNewsQuadrant({ dashboardData, updateDashboardData }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showSafetyFormat, setShowSafetyFormat] = useState(false);
  const [showNewsFormat, setShowNewsFormat] = useState(false);

  // Get current data from dashboardData with fallbacks
  const showSafety = dashboardData.showSafety !== undefined ? dashboardData.showSafety : true;
  const showNews = dashboardData.showNews !== undefined ? dashboardData.showNews : true;
  const safetyText = dashboardData.safetyText || "";
  const newsText = dashboardData.newsText || "";

  const safetyTextareaRef = React.useRef();
  const newsTextareaRef = React.useRef();

  // Helper functions for text formatting
  const insertBulletPoint = (text, setText, textareaRef) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    
    const isNewLine = start === 0 || text[start - 1] === '\n';
    const prefix = isNewLine ? '• ' : '\n• ';
    
    const newText = beforeText + prefix + selectedText + afterText;
    setText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertParagraph = (text, setText, textareaRef) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = text.substring(0, start);
    const afterText = text.substring(start);
    
    const newText = beforeText + '\n\n' + afterText;
    setText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const FormatMenu = ({ show, onBullet, onParagraph, onClose }) => (
    show && (
      <div style={{
        position: "absolute",
        top: 30,
        right: 0,
        zIndex: 100,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 8px #ddd",
        padding: 8,
        minWidth: 120
      }}>
        <button
          onClick={() => { onBullet(); onClose(); }}
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
          onClick={() => { onParagraph(); onClose(); }}
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
    )
  );

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
        }}>🛡️ Safety & News</h2>
        <button
          onClick={() => setShowOptions(o => !o)}
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
          title="Display Options"
        >
          <span role="img" aria-label="settings">⚙️</span>
        </button>
        {showOptions && (
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
            minWidth: 180
          }}>
            <div style={{ marginBottom: 10, fontWeight: 600, color: "#D40511", fontSize: 14 }}>Display Sections</div>
            <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showSafety}
                onChange={e => updateDashboardData({ showSafety: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              🛡️ Safety Section
            </label>
            <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showNews}
                onChange={e => updateDashboardData({ showNews: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              📰 News Section
            </label>
          </div>
        )}
      </div>

      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 12, 
          flex: 1,
          overflow: "visible" // Changed from hidden to visible for screenshots
        }}
      >
        {/* Safety Section */}
        {showSafety && (
          <div style={{ flex: showNews ? 1 : 2 }}>
            {/* Fixed Safety Header - Aligned with text area */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 0,
              padding: "6px 8px",
              background: "#f8f9fa",
              border: "1px solid #D40511",
              borderRadius: "6px 6px 0 0",
              width: "calc(100% - 16px)",
              boxSizing: "border-box"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 16, marginRight: 8 }}>🛡️</span>
                <span style={{
                  color: "#D40511",
                  fontWeight: 600,
                  fontSize: 14
                }}>Safety</span>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowSafetyFormat(f => !f)}
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #D40511",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "#D40511"
                  }}
                  title="Text Formatting"
                >
                  ⚙️
                </button>
                <FormatMenu
                  show={showSafetyFormat}
                  onBullet={() => insertBulletPoint(safetyText, (newText) => updateDashboardData({ safetyText: newText }), safetyTextareaRef)}
                  onParagraph={() => insertParagraph(safetyText, (newText) => updateDashboardData({ safetyText: newText }), safetyTextareaRef)}
                  onClose={() => setShowSafetyFormat(false)}
                />
              </div>
            </div>
            <textarea
              ref={safetyTextareaRef}
              value={safetyText}
              onChange={e => updateDashboardData({ safetyText: e.target.value })}
              placeholder="Enter safety information, alerts, or reminders..."
              style={{
                width: "calc(100% - 16px)",
                border: "1px solid #D40511",
                borderRadius: "0 0 6px 6px",
                borderTop: "none",
                padding: 8,
                fontSize: 12, // Reduced font size
                background: "#f8f9fa",
                resize: "vertical",
                minHeight: showNews ? "100px" : "200px", // Minimum heights
                lineHeight: "1.3",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                overflow: "visible" // Important for screenshots
              }}
            />
          </div>
        )}

        {/* News Section */}
        {showNews && (
          <div style={{ flex: showSafety ? 1 : 2 }}>
            {/* Fixed News Header - Aligned with text area */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 0,
              padding: "6px 8px",
              background: "#f8f9fa",
              border: "1px solid #D40511",
              borderRadius: "6px 6px 0 0",
              width: "calc(100% - 16px)",
              boxSizing: "border-box"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 16, marginRight: 8 }}>📰</span>
                <span style={{
                  color: "#D40511",
                  fontWeight: 600,
                  fontSize: 14
                }}>News</span>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNewsFormat(f => !f)}
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #D40511",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "#D40511"
                  }}
                  title="Text Formatting"
                >
                  ⚙️
                </button>
                <FormatMenu
                  show={showNewsFormat}
                  onBullet={() => insertBulletPoint(newsText, (newText) => updateDashboardData({ newsText: newText }), newsTextareaRef)}
                  onParagraph={() => insertParagraph(newsText, (newText) => updateDashboardData({ newsText: newText }), newsTextareaRef)}
                  onClose={() => setShowNewsFormat(false)}
                />
              </div>
            </div>
            <textarea
              ref={newsTextareaRef}
              value={newsText}
              onChange={e => updateDashboardData({ newsText: e.target.value })}
              placeholder="Enter company news, updates, or announcements..."
              style={{
                width: "calc(100% - 16px)",
                border: "1px solid #D40511",
                borderRadius: "0 0 6px 6px",
                borderTop: "none",
                padding: 8,
                fontSize: 12, // Reduced font size
                background: "#f8f9fa",
                resize: "vertical",
                minHeight: showNews && showSafety ? "100px" : "200px", // Minimum heights
                lineHeight: "1.3",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                overflow: "visible" // Important for screenshots
              }}
            />
          </div>
        )}

        {/* Show message if neither section is selected */}
        {!showSafety && !showNews && (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontStyle: "italic",
            fontSize: 14
          }}>
            Select at least one section to display content
          </div>
        )}
      </div>
    </div>
  );
}

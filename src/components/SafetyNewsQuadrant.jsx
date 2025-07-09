import React, { useState } from "react";

export default function SafetyNewsQuadrant() {
  const [showSafety, setShowSafety] = useState(true);
  const [showNews, setShowNews] = useState(true);
  const [safetyText, setSafetyText] = useState("🛡️ SAFETY:\n\n");
  const [newsText, setNewsText] = useState("📰 NEWS:\n\n");
  const [showOptions, setShowOptions] = useState(false);
  const [showSafetyFormat, setShowSafetyFormat] = useState(false);
  const [showNewsFormat, setShowNewsFormat] = useState(false);

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

  const safetyTextareaRef = React.useRef();
  const newsTextareaRef = React.useRef();

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
                onChange={e => setShowSafety(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              🛡️ Safety Section
            </label>
            <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showNews}
                onChange={e => setShowNews(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              📰 News Section
            </label>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {/* Safety Section */}
        {showSafety && (
          <div style={{ flex: showNews ? 1 : 2, position: "relative" }}>
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
              <button
                onClick={() => setShowSafetyFormat(f => !f)}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #D40511",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  cursor: "pointer",
                  color: "#D40511"
                }}
                title="Text Formatting"
              >
                ⚙️
              </button>
              <FormatMenu
                show={showSafetyFormat}
                onBullet={() => insertBulletPoint(safetyText, setSafetyText, safetyTextareaRef)}
                onParagraph={() => insertParagraph(safetyText, setSafetyText, safetyTextareaRef)}
                onClose={() => setShowSafetyFormat(false)}
              />
            </div>
            <textarea
              ref={safetyTextareaRef}
              value={safetyText}
              onChange={e => setSafetyText(e.target.value)}
              style={{
                width: "calc(100% - 16px)",
                border: "1px solid #D40511",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
                background: "#f8f9fa",
                resize: "vertical",
                height: showNews ? "140px" : "280px",
                lineHeight: "1.5",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap"
              }}
            />
          </div>
        )}

        {/* News Section */}
        {showNews && (
          <div style={{ flex: showSafety ? 1 : 2, position: "relative" }}>
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
              <button
                onClick={() => setShowNewsFormat(f => !f)}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #D40511",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  cursor: "pointer",
                  color: "#D40511"
                }}
                title="Text Formatting"
              >
                ⚙️
              </button>
              <FormatMenu
                show={showNewsFormat}
                onBullet={() => insertBulletPoint(newsText, setNewsText, newsTextareaRef)}
                onParagraph={() => insertParagraph(newsText, setNewsText, newsTextareaRef)}
                onClose={() => setShowNewsFormat(false)}
              />
            </div>
            <textarea
              ref={newsTextareaRef}
              value={newsText}
              onChange={e => setNewsText(e.target.value)}
              style={{
                width: "calc(100% - 16px)",
                border: "1px solid #D40511",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
                background: "#f8f9fa",
                resize: "vertical",
                height: showNews && showSafety ? "140px" : "280px",
                lineHeight: "1.5",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap"
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

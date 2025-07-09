import React, { useState, useEffect } from "react";

export default function AdditionalContentPage() {
  const [selectedTopic, setSelectedTopic] = useState("Performance");
  const [showText, setShowText] = useState(true);
  const [textContent, setTextContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const textareaRef = React.useRef();

  const topics = ["Performance", "News", "Safety", "Team", "Other"];

  // Clipboard paste handler for screenshots
  useEffect(() => {
    const handlePaste = (event) => {
      if (!event.clipboardData) return;
      
      const items = event.clipboardData.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1 && uploadedImages.length < 3) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const newImage = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: `screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
              };
              setUploadedImages(prev => [...prev, newImage]);
            };
            reader.readAsDataURL(blob);
            event.preventDefault();
            break;
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [uploadedImages.length]);

  // Helper functions for text formatting
  const insertBulletPoint = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textContent.substring(start, end);
    const beforeText = textContent.substring(0, start);
    const afterText = textContent.substring(end);
    
    const isNewLine = start === 0 || textContent[start - 1] === '\n';
    const prefix = isNewLine ? '• ' : '\n• ';
    
    const newText = beforeText + prefix + selectedText + afterText;
    setTextContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertParagraph = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = textContent.substring(0, start);
    const afterText = textContent.substring(start);
    
    const newText = beforeText + '\n\n' + afterText;
    setTextContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  // File upload handler
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/') && uploadedImages.length < 3) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: e.target.result,
            name: file.name
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Calculate layout ratios
  const getImageContainerWidth = () => {
    if (!showText) return "100%";
    return "70%";
  };

  const getTextContainerWidth = () => {
    if (!showText) return "0%";
    return "28%";
  };

  const getImageStyle = () => {
    const imageCount = uploadedImages.length;
    if (imageCount === 0) return {};
    
    const baseStyle = {
      width: "100%",
      objectFit: "contain",
      border: "1px solid #ddd",
      borderRadius: 8,
      backgroundColor: "#f8f9fa"
    };

    if (imageCount === 1) {
      return {
        ...baseStyle,
        height: showText ? "620px" : "675px",
        maxHeight: showText ? "620px" : "675px"
      };
    }
    if (imageCount === 2) {
      return {
        ...baseStyle,
        height: "300px",
        maxHeight: "300px",
        marginBottom: "10px"
      };
    }
    if (imageCount === 3) {
      return {
        ...baseStyle,
        height: "200px",
        maxHeight: "200px",
        marginBottom: "8px"
      };
    }
    return baseStyle;
  };

  const FormatMenu = () => (
    showFormatMenu && (
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
          onClick={() => { insertBulletPoint(); setShowFormatMenu(false); }}
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
          onClick={() => { insertParagraph(); setShowFormatMenu(false); }}
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
    <div style={{
      background: "#fff",
      border: "6px solid #FFCC00",
      borderRadius: 14,
      padding: 20,
      height: 830,
      fontFamily: "'Inter', Arial, sans-serif",
      boxSizing: "border-box"
    }}>
      {/* Header Section - Back to original with only Topic selector */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: "2px solid #D40511"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <label style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#D40511"
          }}>
            Topic:
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              style={{
                marginLeft: 8,
                padding: "6px 12px",
                borderRadius: 6,
                border: "2px solid #D40511",
                fontSize: 16,
                fontWeight: 600,
                color: "#D40511",
                background: "#f8f9fa"
              }}
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </label>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showText}
              onChange={e => setShowText(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#D40511" }}>Show Text Field</span>
          </label>
          
          <label style={{
            background: "#D40511",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600
          }}>
            📁 Upload Images/Screenshots
            <input
              type="file"
              multiple
              accept="image/*,.png,.jpg,.jpeg,.gif,.bmp,.webp"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: "flex",
        gap: 20,
        height: "calc(100% - 100px)"
      }}>
        {/* Images Section */}
        <div style={{
          width: getImageContainerWidth(),
          display: "flex",
          flexDirection: "column",
          gap: 10,
          height: "100%"
        }}>
          {uploadedImages.length === 0 ? (
            <div style={{
              border: "2px dashed #D40511",
              borderRadius: 8,
              padding: 40,
              textAlign: "center",
              color: "#D40511",
              fontSize: 16,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No images or screenshots uploaded</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>Click "Upload Images/Screenshots" to add files</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#D40511", marginBottom: 8 }}>
                OR press Ctrl+V (Cmd+V) to paste from clipboard
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Supports: PNG, JPG, JPEG, GIF, BMP, WebP<br/>
                Maximum 3 images • Screenshots paste directly
              </div>
            </div>
          ) : (
            <div style={{ height: "100%", overflow: "hidden" }}>
              {uploadedImages.map((image, index) => (
                <div key={image.id} style={{ 
                  position: "relative", 
                  marginBottom: index < uploadedImages.length - 1 ? "10px" : "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <img
                    src={image.src}
                    alt={image.name}
                    style={getImageStyle()}
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "#D40511",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: "bold",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                  <div style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Section */}
        {showText && (
          <div style={{
            width: getTextContainerWidth(),
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              padding: "6px 0",
              borderBottom: "2px solid #D40511"
            }}>
              <span style={{
                color: "#D40511",
                fontWeight: 600,
                fontSize: 16
              }}>📝 Content Description</span>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowFormatMenu(f => !f)}
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
                <FormatMenu />
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="Enter detailed description, context, or additional information about the uploaded content..."
              style={{
                width: "calc(100% - 16px)",
                border: "1px solid #D40511",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
                background: "#f8f9fa",
                resize: "vertical",
                height: "100%",
                lineHeight: "1.5",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

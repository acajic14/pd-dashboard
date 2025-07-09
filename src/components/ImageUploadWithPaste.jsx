import React, { useRef } from "react";

export default function ImageUploadWithPaste({ imageUrl, onImageChange }) {
  const fileInputRef = useRef();
  const pasteInputRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      onImageChange(URL.createObjectURL(file));
    } else if (file) {
      alert("Please select a JPG or PNG image.");
    }
  }

  function handlePaste(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        onImageChange(URL.createObjectURL(blob));
        e.preventDefault();
        break;
      }
    }
  }

  function handleAddImageClick() {
    pasteInputRef.current.focus();
  }

  return (
    <div>
      <label style={{
        background: "#D40511",
        color: "#fff",
        borderRadius: 4,
        padding: "6px 16px",
        cursor: "pointer",
        fontWeight: 600
      }}>
        Add Image
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
      </label>
      <button
        onClick={handleAddImageClick}
        style={{
          background: "#eee",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "6px 16px",
          fontWeight: 600,
          cursor: "pointer",
          color: "#D40511",
          marginLeft: 10
        }}
      >
        Paste Screenshot
      </button>
      <input
        ref={pasteInputRef}
        onPaste={handlePaste}
        style={{
          opacity: 0,
          position: "absolute",
          left: "-9999px"
        }}
        tabIndex={-1}
        aria-hidden="true"
      />
      {imageUrl && (
        <div style={{
          marginTop: 20,
          position: "relative",
          display: "block"
        }}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              width: "600px",
              height: "120px",
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 2px 8px #ccc",
              background: "#eee",
              display: "block"
            }}
          />
          <button
            onClick={() => onImageChange(null)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 18,
              lineHeight: "24px",
              textAlign: "center",
              padding: 0
            }}
            title="Remove Image"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

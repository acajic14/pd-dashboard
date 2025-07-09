import React, { useState, useRef } from "react";
import Header from "./components/Header";
import PerformanceQuadrant from "./components/PerformanceQuadrant";
import SafetyNewsQuadrant from "./components/SafetyNewsQuadrant";
import IdeasTable from "./components/IdeasTable";
import TeamNewsQuadrant from "./components/TeamNewsQuadrant";
import AdditionalContentPage from "./components/AdditionalContentPage";
import html2canvas from 'html2canvas';

const QUADRANT_HEIGHT = 410;

const quadrantStyle = {
  border: "6px solid #FFCC00",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  minHeight: QUADRANT_HEIGHT,
  maxHeight: QUADRANT_HEIGHT,
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start"
};

export default function App() {
  const [team, setTeam] = useState("PUD");
  const [page, setPage] = useState("dashboard");
  const [performanceEditable, setPerformanceEditable] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPageMenu, setShowPageMenu] = useState(false);
  const performanceQuadrantRef = useRef();
  const dashboardRef = useRef();

  const getHeaderTitle = (selectedTeam) => {
    switch (selectedTeam) {
      case "PUD":
        return "PUD Performance Dialogue";
      case "WTH":
        return "WTH Performance Dialogue";
      case "SPV":
        return "SPV Performance Dialogue";
      case "Team4":
        return "Team 4 Performance Dialogue";
      case "Team5":
        return "Team 5 Performance Dialogue";
      case "Team6":
        return "Team 6 Performance Dialogue";
      case "Team7":
        return "Team 7 Performance Dialogue";
      default:
        return "DHL Performance Dialogue";
    }
  };

  const headerTitle = getHeaderTitle(team);

  // Page options for dropdown
  const pageOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "additional1", label: "Additional Content 1" },
    { value: "additional2", label: "Additional Content 2" },
    { value: "additional3", label: "Additional Content 3" }
  ];

  const getCurrentPageLabel = () => {
    const currentPage = pageOptions.find(option => option.value === page);
    return currentPage ? currentPage.label : "Dashboard";
  };

  // Screenshot functionality
  const takeScreenshot = async () => {
    setIsCapturing(true);
    
    try {
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `DHL-Dashboard-${team}-${page}-${timestamp}.png`;
      
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: '#f6f6f6',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: dashboardRef.current.scrollHeight,
        width: dashboardRef.current.scrollWidth
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      alert('Screenshot failed. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePageSelect = (selectedPage) => {
    setPage(selectedPage);
    setShowPageMenu(false);
  };

  return (
    <div
      ref={dashboardRef}
      style={{
        width: "80%",
        maxWidth: "1620px",
        margin: "0 auto",
        padding: 16,
        fontFamily: "'Inter', Arial, sans-serif"
      }}
    >
      <Header title={headerTitle} />

      {/* Navigation - Team selector on left, Page controls on right */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
        <label style={{ fontWeight: 600, marginRight: 16 }}>
          Team:
          <select
            value={team}
            onChange={e => setTeam(e.target.value)}
            style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}
          >
            <option value="PUD">PUD</option>
            <option value="WTH">WTH</option>
            <option value="SPV">SPV</option>
            <option value="Team4">Team 4</option>
            <option value="Team5">Team 5</option>
            <option value="Team6">Team 6</option>
            <option value="Team7">Team 7</option>
          </select>
        </label>

        {/* Page Controls - Screenshot + Navigation grouped together */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Screenshot Button - Camera Icon Only */}
          <button
            onClick={takeScreenshot}
            disabled={isCapturing}
            style={{
              background: isCapturing ? "#ccc" : "#D40511",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: isCapturing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18
            }}
            title={isCapturing ? "Capturing screenshot..." : "Take screenshot of current page"}
          >
            {isCapturing ? "⏳" : "📷"}
          </button>

          {/* Page Navigation Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowPageMenu(m => !m)}
              style={{
                background: "#D40511",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 180
              }}
              title="Select page"
            >
              <span>{getCurrentPageLabel()}</span>
              <span style={{ fontSize: 12 }}>{showPageMenu ? "▲" : "▼"}</span>
            </button>
            
            {showPageMenu && (
              <div style={{
                position: "absolute",
                top: 40,
                right: 0,
                zIndex: 100,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 2px 8px #ddd",
                padding: 8,
                minWidth: 180
              }}>
                {pageOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handlePageSelect(option.value)}
                    style={{
                      background: page === option.value ? "#D40511" : "transparent",
                      color: page === option.value ? "#fff" : "#D40511",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 12px",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 2
                    }}
                    onMouseEnter={e => {
                      if (page !== option.value) {
                        e.target.style.background = "#f8f9fa";
                      }
                    }}
                    onMouseLeave={e => {
                      if (page !== option.value) {
                        e.target.style.background = "transparent";
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Quadrant Grid */}
      {page === "dashboard" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 10,
            height: QUADRANT_HEIGHT * 2 + 10,
            minHeight: QUADRANT_HEIGHT * 2 + 10
          }}
        >
          <div style={quadrantStyle}>
            <PerformanceQuadrant
              editable={performanceEditable}
              ref={performanceQuadrantRef}
              onToggleEdit={() => setPerformanceEditable(e => !e)}
            />
          </div>
          <div style={quadrantStyle}>
            <SafetyNewsQuadrant />
          </div>
          <div style={quadrantStyle}>
            <IdeasTable />
          </div>
          <div style={quadrantStyle}>
            <TeamNewsQuadrant />
          </div>
        </div>
      )}

      {/* Additional Content Pages */}
      {page === "additional1" && <AdditionalContentPage />}
      {page === "additional2" && <AdditionalContentPage />}
      {page === "additional3" && <AdditionalContentPage />}
    </div>
  );
}

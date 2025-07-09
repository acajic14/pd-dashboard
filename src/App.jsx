import React, { useState, useRef, useEffect } from "react";
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
  
  // Local storage states
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Local Storage Functions
  const saveTeamData = (teamName, data) => {
    try {
      const dataWithTimestamp = {
        ...data,
        lastUpdated: new Date().toISOString(),
        version: "1.0"
      };
      localStorage.setItem(`pd-dashboard-${teamName}`, JSON.stringify(dataWithTimestamp));
      console.log(`✅ Data saved for team: ${teamName}`);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      alert('Warning: Unable to save data. Your changes may be lost.');
    }
  };

  const loadTeamData = (teamName) => {
    try {
      const savedData = localStorage.getItem(`pd-dashboard-${teamName}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log(`✅ Data loaded for team: ${teamName}`);
        return parsedData;
      }
      console.log(`ℹ️ No saved data found for team: ${teamName}, using defaults`);
      return null;
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      return null;
    }
  };

  const getDefaultTeamData = () => ({
    // Performance Quadrant Data
    kpis: [
      { name: "On-Time Delivery", value: 98, target: 95, period: "permanent", higherIsBetter: true },
      { name: "Error Rate", value: 1.2, target: 2, period: "permanent", higherIsBetter: false }
    ],
    performanceLayout: { rows: 2, cols: 4, label: "2 × 4" },
    
    // Safety & News Quadrant Data
    showSafety: true,
    showNews: true,
    safetyText: "",
    newsText: "",
    
    // Ideas & Actions Table Data
    ideasActions: [
      { idea: "Improve process", todo: "Review SOP", who: "Ana", when: "2025-07-10", status: "In Progress" }
    ],
    
    // Team News Quadrant Data
    teamNews: "",
    
    // Additional Content Pages Data
    additionalContent1: {
      selectedTopic: "Performance",
      showText: true,
      textContent: "",
      uploadedImages: []
    },
    additionalContent2: {
      selectedTopic: "Performance",
      showText: true,
      textContent: "",
      uploadedImages: []
    },
    additionalContent3: {
      selectedTopic: "Performance",
      showText: true,
      textContent: "",
      uploadedImages: []
    },
    
    // Metadata
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    version: "1.0"
  });

  // Load data when team changes
  useEffect(() => {
    setIsLoading(true);
    const savedData = loadTeamData(team);
    
    if (savedData) {
      setDashboardData(savedData);
    } else {
      // Initialize with default data for new team
      const defaultData = getDefaultTeamData();
      setDashboardData(defaultData);
      saveTeamData(team, defaultData);
    }
    
    setIsLoading(false);
  }, [team]);

  // Auto-save data when it changes (debounced)
  useEffect(() => {
    if (!isLoading && Object.keys(dashboardData).length > 0) {
      const timeoutId = setTimeout(() => {
        saveTeamData(team, dashboardData);
      }, 500); // Save 500ms after last change

      return () => clearTimeout(timeoutId);
    }
  }, [dashboardData, team, isLoading]);

  // Function to update dashboard data
  const updateDashboardData = (updates) => {
    setDashboardData(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Export/Import functions for backup
  const exportDashboardData = () => {
    const allTeamsData = {};
    const teams = ['PUD', 'WTH', 'SPV', 'Team4', 'Team5', 'Team6', 'Team7'];
    
    teams.forEach(teamName => {
      const teamData = loadTeamData(teamName);
      if (teamData) {
        allTeamsData[teamName] = teamData;
      }
    });

    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      application: "PD Dashboard",
      teams: allTeamsData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PD-Dashboard-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Dashboard data exported successfully!\nFile: PD-Dashboard-Backup-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const importDashboardData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.teams) {
          Object.keys(importData.teams).forEach(teamName => {
            saveTeamData(teamName, importData.teams[teamName]);
          });
          
          // Reload current team data
          const currentTeamData = importData.teams[team];
          if (currentTeamData) {
            setDashboardData(currentTeamData);
          }
          
          alert('✅ Dashboard data imported successfully!');
        } else {
          alert('❌ Invalid backup file format.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('❌ Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
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
      const filename = `PD-Dashboard-${team}-${page}-${timestamp}.png`;
      
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

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Inter', Arial, sans-serif",
        fontSize: 18,
        color: '#D40511',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: 24 }}>🔄</div>
        <div>Loading dashboard for {team}...</div>
      </div>
    );
  }

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

        {/* Data Management Buttons */}
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          <button
            onClick={exportDashboardData}
            style={{
              background: "#FFCC00",
              color: "#D40511",
              border: "1px solid #D40511",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600
            }}
            title="Export all team data as backup"
          >
            💾 Export
          </button>
          
          <label style={{
            background: "#FFCC00",
            color: "#D40511",
            border: "1px solid #D40511",
            borderRadius: 6,
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600
          }}>
            📁 Import
            <input
              type="file"
              accept=".json"
              onChange={importDashboardData}
              style={{ display: "none" }}
            />
          </label>
        </div>

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
              dashboardData={dashboardData}
              updateDashboardData={updateDashboardData}
            />
          </div>
          <div style={quadrantStyle}>
            <SafetyNewsQuadrant 
              dashboardData={dashboardData}
              updateDashboardData={updateDashboardData}
            />
          </div>
          <div style={quadrantStyle}>
            <IdeasTable 
              dashboardData={dashboardData}
              updateDashboardData={updateDashboardData}
            />
          </div>
          <div style={quadrantStyle}>
            <TeamNewsQuadrant 
              dashboardData={dashboardData}
              updateDashboardData={updateDashboardData}
            />
          </div>
        </div>
      )}

      {/* Additional Content Pages */}
      {page === "additional1" && (
        <AdditionalContentPage 
          pageKey="additionalContent1"
          dashboardData={dashboardData}
          updateDashboardData={updateDashboardData}
        />
      )}
      {page === "additional2" && (
        <AdditionalContentPage 
          pageKey="additionalContent2"
          dashboardData={dashboardData}
          updateDashboardData={updateDashboardData}
        />
      )}
      {page === "additional3" && (
        <AdditionalContentPage 
          pageKey="additionalContent3"
          dashboardData={dashboardData}
          updateDashboardData={updateDashboardData}
        />
      )}
    </div>
  );
}

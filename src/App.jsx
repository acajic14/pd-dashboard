import React, { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Header from "./components/Header";
import PerformanceQuadrant from "./components/PerformanceQuadrant";
import SafetyNewsQuadrant from "./components/SafetyNewsQuadrant";
import IdeasTable from "./components/IdeasTable";
import TeamNewsQuadrant from "./components/TeamNewsQuadrant";
import AdditionalContentPage from "./components/AdditionalContentPage";

// Your saved Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKR7HOIaS5Fn13B3O_9iNgZz9thC-g1TU",
  authDomain: "pd-dashboard-d4b62.firebaseapp.com",
  projectId: "pd-dashboard-d4b62",
  storageBucket: "pd-dashboard-d4b62.firebasestorage.app",
  messagingSenderId: "878017746594",
  appId: "1:878017746594:web:8c260fe1354e6ec4e3e9fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const QUADRANT_HEIGHT = 410;

const quadrantStyle = {
  border: "6px solid #FFCC00",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
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
  const [showPageMenu, setShowPageMenu] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Track authenticated user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [dataError, setDataError] = useState(""); // For data loading errors
  
  const performanceQuadrantRef = useRef();
  const dashboardRef = useRef();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load and sync data from Firestore if authenticated
  useEffect(() => {
    if (!user) return; // Only sync if logged in
    
    setIsLoading(true);
    setDataError("");
    const teamDocRef = doc(db, "teams", team);

    const unsubscribe = onSnapshot(teamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setDashboardData(docSnap.data());
        console.log("Data loaded:", docSnap.data()); // Debug log
      } else {
        const defaultData = getDefaultTeamData();
        setDoc(teamDocRef, defaultData).then(() => {
          setDashboardData(defaultData);
          console.log("Default data initialized"); // Debug log
        }).catch((error) => {
          setDataError("Failed to initialize data: " + error.message);
        });
      }
      setIsLoading(false);
    }, (error) => {
      setDataError("Data sync error: " + error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [team, user]);

  // Login function
  const handleLogin = async () => {
    try {
      setLoginError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Login failed: " + error.message);
    }
  };

  // Update data in Firestore
  const updateDashboardData = async (updates) => {
    if (!user) return; // Only allow updates if logged in
    const teamDocRef = doc(db, "teams", team);
    try {
      await setDoc(teamDocRef, {
        ...dashboardData,
        ...updates,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      console.log("Data updated"); // Debug log
    } catch (error) {
      alert("Update failed: " + error.message);
    }
  };

  // Default data function
  const getDefaultTeamData = () => ({
    kpis: [
      { name: "On-Time Delivery", value: 98, target: 95, period: "permanent", higherIsBetter: true, isPercentage: true },
      { name: "Error Rate", value: 1.2, target: 2, period: "permanent", higherIsBetter: false, isPercentage: true }
    ],
    performanceLayout: { rows: 2, cols: 4, label: "2 × 4" },
    showSafety: true,
    showNews: true,
    safetyText: "",
    newsText: "",
    ideasActions: [
      { idea: "Improve process", todo: "Review SOP", who: "Ana", when: "10.07", status: "In Progress" }
    ],
    teamNews: "",
    additionalContent1: { selectedTopic: "Performance", showText: true, textContent: "", uploadedImages: [] },
    additionalContent2: { selectedTopic: "Performance", showText: true, textContent: "", uploadedImages: [] },
    additionalContent3: { selectedTopic: "Performance", showText: true, textContent: "", uploadedImages: [] },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    version: "1.0"
  });

  // getHeaderTitle function (ensured it's defined here)
  const getHeaderTitle = (selectedTeam) => {
    switch (selectedTeam) {
      case "PUD": return "PUD Performance Dialogue";
      case "WTH": return "WTH Performance Dialogue";
      case "SPV": return "SPV Performance Dialogue";
      case "Team4": return "Team 4 Performance Dialogue";
      case "Team5": return "Team 5 Performance Dialogue";
      case "Team6": return "Team 6 Performance Dialogue";
      case "Team7": return "Team 7 Performance Dialogue";
      default: return "DHL Performance Dialogue";
    }
  };

  // Export/Import functions (optional fallback)
  const exportDashboardData = () => {
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PD-Dashboard-${team}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`✅ Data exported for ${team}!`);
  };

  const importDashboardData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        updateDashboardData(importedData);
        alert('✅ Data imported successfully!');
      } catch (error) {
        alert('❌ Error importing data.');
      }
    };
    reader.readAsText(file);
  };

  const handlePageSelect = (selectedPage) => {
    setPage(selectedPage);
    setShowPageMenu(false);
  };

  const pageOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "additional1", label: "Additional Content 1" },
    { value: "additional2", label: "Additional Content 2" },
    { value: "additional3", label: "Additional Content 3" }
  ];

  const getCurrentPageLabel = () => pageOptions.find(option => option.value === page)?.label || "Dashboard";

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Login to Access Dashboard</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }} />
        <button onClick={handleLogin} style={{ padding: "10px", background: "#D40511", color: "#fff", border: "none", borderRadius: "6px", width: "100%" }}>Login</button>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      </div>
    );
  }

  if (dataError) {
    return <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>{dataError}</div>;
  }

  if (Object.keys(dashboardData).length === 0) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>No data available for this team. Try adding some content or check Firestore.</div>;
  }

  return (
    <div ref={dashboardRef} style={{ width: "80%", maxWidth: "1620px", margin: "0 auto", padding: 16, fontFamily: "'Inter', Arial, sans-serif" }}>
      <Header title={getHeaderTitle(team)} />

      {/* Navigation */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
        <label style={{ fontWeight: 600, marginRight: 16 }}>
          Team:
          <select value={team} onChange={(e) => setTeam(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}>
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
          <button onClick={exportDashboardData} style={{ background: "#FFCC00", color: "#D40511", border: "1px solid #D40511", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, fontWeight: 600 }} title="Export team data">
            💾 Export
          </button>
          <label style={{ background: "#FFCC00", color: "#D40511", border: "1px solid #D40511", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            📁 Import
            <input type="file" accept=".json" onChange={importDashboardData} style={{ display: "none" }} />
          </label>
        </div>

        {/* Page Navigation Dropdown */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <button onClick={() => setShowPageMenu(m => !m)} style={{ background: "#D40511", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, minWidth: 180 }} title="Select page">
            <span>{getCurrentPageLabel()}</span>
            <span style={{ fontSize: 12 }}>{showPageMenu ? "▲" : "▼"}</span>
          </button>
          {showPageMenu && (
            <div style={{ position: "absolute", top: 40, right: 0, zIndex: 100, background: "#fff", border: "1px solid #ccc", borderRadius: 8, boxShadow: "0 2px 8px #ddd", padding: 8, minWidth: 180 }}>
              {pageOptions.map(option => (
                <button key={option.value} onClick={() => handlePageSelect(option.value)} style={{ background: page === option.value ? "#D40511" : "transparent", color: page === option.value ? "#fff" : "#D40511", border: "none", borderRadius: 4, padding: "8px 12px", width: "100%", textAlign: "left", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 2 }} onMouseEnter={e => { if (page !== option.value) e.target.style.background = "#f8f9fa"; }} onMouseLeave={e => { if (page !== option.value) e.target.style.background = "transparent"; }}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Quadrant Grid */}
      {page === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10, height: QUADRANT_HEIGHT * 2 + 10, minHeight: QUADRANT_HEIGHT * 2 + 10 }}>
          <div style={quadrantStyle}>
            <PerformanceQuadrant editable={performanceEditable} ref={performanceQuadrantRef} onToggleEdit={() => setPerformanceEditable(e => !e)} dashboardData={dashboardData} updateDashboardData={updateDashboardData} />
          </div>
          <div style={quadrantStyle}>
            <SafetyNewsQuadrant dashboardData={dashboardData} updateDashboardData={updateDashboardData} />
          </div>
          <div style={quadrantStyle}>
            <IdeasTable dashboardData={dashboardData} updateDashboardData={updateDashboardData} />
          </div>
          <div style={quadrantStyle}>
            <TeamNewsQuadrant dashboardData={dashboardData} updateDashboardData={updateDashboardData} />
          </div>
        </div>
      )}

      {/* Additional Content Pages */}
      {page === "additional1" && <AdditionalContentPage pageKey="additionalContent1" dashboardData={dashboardData} updateDashboardData={updateDashboardData} />}
      {page === "additional2" && <AdditionalContentPage pageKey="additionalContent2" dashboardData={dashboardData} updateDashboardData={updateDashboardData} />}
      {page === "additional3" && <AdditionalContentPage pageKey="additionalContent3" dashboardData={dashboardData} updateDashboardData={updateDashboardData} />}
    </div>
  );
}

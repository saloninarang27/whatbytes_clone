import React from "react";
import Logo from "../src/logoo.jpg";
import profile from "../src/profile.png";
import { BarChart, Award, FileText } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';
import { useState } from "react";
import { Chart as ChartJS } from 'chart.js/auto';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <img src={Logo} alt="WhatBytes Logo" style={styles.logo} />
        <h1 style={styles.brandName}>WhatBytes</h1>
      </div>
      <nav>
        <div style={styles.menuItem}><BarChart size={20} /><span style={styles.menuText}>Dashboard</span></div>
        <div style={{ ...styles.menuItem, ...styles.activeMenu }}><Award size={20} /><span style={styles.menuText}>Skill Test</span></div>
        <div style={styles.menuItem}><FileText size={20} /><span style={styles.menuText}>Internship</span></div>
      </nav>
    </div>
  );
};

const Navbar = () => {
  return (
    <div style={styles.navbar}>
      <div></div>
      <div style={styles.userInfo}>
        <img src={profile} alt="User Profile" style={styles.profilePic} />
        <span style={styles.username}>Rahil Siddique</span>
      </div>
    </div>
  );
};

const SkillTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [rank, setRank] = useState("");
  // const [percentile, setPercentile] = useState("");
  // const [currentScore, setCurrentScore] = useState("");

  const [skillTestResults, setSkillTestResults] = useState({
      rank: 1,
      percentile: 30,
      currentScore: 10,
  });

  const handleUpdateClick = () => {
      // setRank(skillTestResults.rank.toString());
      // setPercentile(skillTestResults.percentile.toString());
      // setCurrentScore(skillTestResults.currentScore.toString());
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

  const handleSave = (newRank, newPercentile, newCurrentScore) => {  // Take arguments
    setSkillTestResults({
        rank: parseInt(newRank, 10) || 0,
        percentile: parseInt(newPercentile, 10) || 0,
        currentScore: parseInt(newCurrentScore, 10) || 0,
    });
    setIsModalOpen(false);
};

return (
  <div style={styles.skillTestContent}>
      <h4 style={styles.skillTestTitle}>Skill Test</h4>
      <div style={styles.card}>
          <img src="https://cdn-icons-png.flaticon.com/512/919/919827.png" alt="HTML5" style={styles.cardIcon} />
          <div style={styles.cardContent}>
              <h3>Hyper Text Markup Language</h3>
              <p style={styles.cardDetails}>Questions: 08 | Duration: 15 mins | Submitted on 5 June 2021</p>
          </div>
          <button style={styles.updateButton} onClick={handleUpdateClick}>Update</button>
      </div>
      <QuickStatistics results={skillTestResults} />

      {/* Modal */}
      {isModalOpen && (
          <UpdateModal 
              onClose={handleCloseModal} 
              onSave={handleSave} 
              initialValues={skillTestResults} // Pass initial values
          />
      )}
  </div>
);
};

const UpdateModal = ({ onClose, onSave, initialValues }) => { // Receive props
  const [rank, setRank] = useState(initialValues.rank.toString()); // Use initialValues
  const [percentile, setPercentile] = useState(initialValues.percentile.toString());
  const [currentScore, setCurrentScore] = useState(initialValues.currentScore.toString());

  return (
      <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>Update Scores</h3>
              <div style={styles.inputGroup}>
                  <label htmlFor="rank">1. Update your Rank</label>
                  <input type="text" id="rank" value={rank} onChange={(e) => setRank(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                  <label htmlFor="percentile">2. Update your Percentile</label>
                  <input type="text" id="percentile" value={percentile} onChange={(e) => setPercentile(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                  <label htmlFor="currentScore">3. Update your Current Score (out of 15)</label>
                  <input type="text" id="currentScore" value={currentScore} onChange={(e) => setCurrentScore(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.buttonGroup}>
                  <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
                  <button 
                      style={styles.saveButton} 
                      onClick={() => onSave(rank, percentile, currentScore)} // Pass values to onSave
                  >
                      Save
                  </button>
              </div>
          </div>
      </div>
  );
};

const QuickStatistics = ({ results = { rank: 0, percentile: 0, currentScore: 0 } }) => { 
  const statData = [
      { icon: "🏆", label: "YOUR RANK", value: results.rank },
      { icon: "📊", label: "PERCENTILE", value: `${results.percentile}%` },
      { icon: "✅", label: "CORRECT ANSWERS", value: `${results.currentScore} / 15` },
  ];

  return (
      <div style={styles.quickStatisticsContainer}>
          <h4 style={styles.quickStatisticsTitle}>Quick Statistics</h4>
          <div style={styles.quickStatistics}>
              {statData.map((stat, index) => (
                  <div key={index} style={styles.statCard}>
                      <span style={styles.statIcon}>{stat.icon}</span>
                      <div>
                          <p style={styles.statText}>{stat.value}</p>
                          <p style={styles.statLabel}>{stat.label}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

const generateCurveData = (dataPoints) => {
  const curveData = [];
  for (let i = 0; i < dataPoints.length - 1; i++) {
      const startPoint = dataPoints[i];
      const endPoint = dataPoints[i + 1];
      curveData.push(startPoint);

      const numInterpolatedPoints = 10; 
      for (let j = 1; j <= numInterpolatedPoints; j++) {
          const x = startPoint.x + (endPoint.x - startPoint.x) * (j / (numInterpolatedPoints + 1));
          const y = startPoint.y + (endPoint.y - startPoint.y) * (j / (numInterpolatedPoints + 1));
          curveData.push({ x, y });
      }
  }
  curveData.push(dataPoints[dataPoints.length - 1]);
  return curveData;
};

const ComparisonGraph = () => {
  const dataPoints = [
      { x: 0, y: 4 },
      { x: 25, y: 4 },
      { x: 50, y: 90 },
      { x: 75, y: 4 },
      { x: 100, y: 4 },
  ];

  const graphData = useMemo(() => ({
      datasets: [
          {
              label: 'Number of Students',
              data: generateCurveData(dataPoints),
              fill: false,
              borderColor: 'purple',
              tension: 0.4, 
              pointBackgroundColor: 'white',
              pointBorderColor: 'purple',
              pointRadius: 3, 
              hoverRadius: 5, 
              showLine: true,
          },
      ],
  }), []);

  const graphOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          x: {
              type: 'linear',
              title: {
                  display: true,
                  text: 'Percentile',
              },
          },
          y: {
              title: {
                  display: true,
                  text: 'Number of Students',
              },
              beginAtZero: true,
              ticks: {
                  stepSize: 10,
              },
          },
      },
      plugins: {
          tooltip: {
              callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.formattedValue} students`,
              },
          },
      },
  };

  return (
      <div style={styles.graphSection}>
          <h3 style={styles.comparisonGraphTitle}>Comparison Graph</h3>
          <div style={styles.graph}>
              <p>You scored 30% percentile which is lower than the average percentile 72% of all the engineers who took this assessment.</p>
              <div style={{ height: '200px' }}>
                  <Line data={graphData} options={graphOptions} />
              </div>
          </div>
      </div>
  );
};

const SyllabusAnalysis = () => {
  const progressData = [
      { title: "HTML Tools, Forms, History", percentage: 80, color: "blue" },
      { title: "Tags & References in HTML", percentage: 60, color: "orange" },
      { title: "Tables & References in HTML", percentage: 24, color: "red" },
      { title: "Tables & CSS Basics", percentage: 96, color: "green" },
  ];

  return (
      <div style={styles.analysisSection}>
          <h4 style={styles.syllabusTitle}>Syllabus Wise Analysis</h4>
          {progressData.map((item, index) => (
              <div key={index} style={styles.progressItem}>
                  <div style={styles.textAndBar}> {/* Container for text and bar */}
                      <p style={styles.progressText}>{item.title}</p>
                      <div style={styles.progressBarContainer}> {/* Container for track and bar */}
                          <div style={styles.progressBarTrack}>
                              <div
                                  style={{
                                      width: `${item.percentage}%`,
                                      backgroundColor: item.color,
                                      height: "100%",
                                      borderRadius: "4px",
                                  }}
                              ></div>
                          </div>
                      </div>
                  </div>
                  <span style={{ color: item.color, marginLeft: "10px", alignSelf: 'center' }}>{item.percentage}%</span> {/* Percentage to the right */}
              </div>
          ))}
      </div>
  );
};



const QuestionAnalysis = () => {
  const totalQuestions = 15;
  const [correctAnswers, setCorrectAnswers] = useState(10);

  const incorrectAnswers = totalQuestions - correctAnswers;

  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Question Analysis',
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  return (
    <div style={{ textAlign: "center", margin: "20px auto", width: "80%" }}>
      <h3 style={{ fontWeight: "bold" }}>Question Analysis</h3>
      <div style={{ 
        fontSize: "18px", 
        fontWeight: "bold", 
        background: "#e0e0e0", 
        display: "inline-block", 
        padding: "8px 15px", 
        borderRadius: "8px", 
        marginBottom: "10px" 
      }}>
        {correctAnswers} / {totalQuestions}
      </div>
      <p>You scored {correctAnswers} questions correct out of {totalQuestions}. However, it still needs some improvements.</p>
      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <Bar data={data} options={{ 
          responsive: true, 
          plugins: { legend: { display: true } } 
        }} />
      </div>
    </div>
  );
};


const renderProgressBar = (title, percentage, color) => {
  return (
    <div style={styles.progressContainer}>
      <p>{title}</p>
      <div style={styles.progressBar}>
        <div style={{ width: `${percentage}%`, backgroundColor: color, height: "8px", borderRadius: "4px" }}></div>
      </div>
      <span style={{ color: color, marginLeft: "10px" }}>{percentage}%</span>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div style={styles.dashboard}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Navbar />
        <div style={styles.contentArea}>
          <div style={styles.leftContent}>
            <SkillTest />
            
            {/* <QuickStatistics />  */}
            <ComparisonGraph />
          </div>
          <div style={styles.rightContent}>
            <SyllabusAnalysis />
            <QuestionAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  dashboard: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },

  analysisSection: {
    marginTop: "20px",
},

  syllabusTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
},
  skillTestContent: {
    position: 'relative', // Important for absolute positioning of the modal
},

progressItem: {
  display: "flex",
  alignItems: "flex-start",
   // Align items vertically in the center
  marginBottom: "10px",
},

textAndBar: { // New style for the container of text and bar
  display: "flex",
  flexDirection: "column", // Stack text and bar vertically
  flex: 1, // Allow text and bar to take up available space
  marginRight: "10px", // Add spacing between bar and percentage
},


progressText: {
  marginRight: "5px",
},

progressBarContainer: {
  width: "400px", // Increased width here! Adjust as needed
  height: "8px",
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex", // Enable flexbox for positioning
  alignItems: "center",
},

progressBarTrack: {
  backgroundColor: "#e0e0e0",
  height: "100%",
  width: "100%", // Or a specific width if you prefer
  borderRadius: "4px",
},

progressBar: {
  height: "100%",
  borderRadius: "4px",
},

modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
},

modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '400px',
},

modalTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '15px',
},

inputGroup: {
    marginBottom: '15px',
},

input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
},

buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
},

cancelButton: {
    backgroundColor: '#ddd',
    color: '#333',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    marginRight: '10px',
},

saveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
},

  sidebar: {
    width: "180px",
    backgroundColor: "white",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    height: "100%",
    overflowY: "auto",
  },

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },

  logo: {
    width: "30px",
    height: "30px",
    marginRight: "5px",
  },

  brandName: {
    fontSize: "16px",
    fontWeight: "bold",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "background 0.3s ease",
  },

  menuText: {
    marginLeft: "5px",
  },

  activeMenu: {
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
  },

  navbar: {
    width: "100%",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 10px",
    backgroundColor: "white",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    overflowX: "auto", // Make navbar horizontally scrollable
    whiteSpace: "nowrap",
    // position: "sticky",
    // top: "0",
    // zIndex: "1000",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginRight: "10px",
  },

  profilePic: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
  },

  username: {
    fontWeight: "bold",
    whiteSpace: "nowrap",
    fontSize: "14px",
  },

  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "20px",
  },
  contentArea: {
    display: "flex",
    flex: 1,
    overflow: "hidden", // Prevent content from overflowing
    gap: "20px",
    height: "calc(100vh - 60px)", // Calculate height dynamically (adjust 100px as needed)
},

  leftContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
  },

  rightContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column", // Stack elements vertically in right content
    height: "100%",
    overflowY: "auto",
  },

  rightContentInner: { // Style for the inner div
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Align items to the top
    },

  skillTestArea: {
    flex: 1,
    overflow: "auto",
  },

  syllabusAnalysisArea: {
    flex: 1,
    overflow: "auto",
  },

  content: {
    flex: 1,
    overflowY: "auto",
  },

  skillTestTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  cardIcon: {
    width: "50px",
    height: "50px",
    marginRight: "15px",
  },

  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  cardDetails: {
    color: "#777",
    fontSize: "14px",
    marginTop: "5px",
  },

  scoreAndButton: { // New style for the right side of the card
    display: "flex",
    flexDirection: "column", // Stack scores and button vertically
    alignItems: "flex-end", // Align to the right
    marginLeft: "20px", // Add some left margin for spacing
  },

scoreItem: {
    display: "flex",
    alignItems: "center", // Align label and value
    marginBottom: "5px", // Add spacing between score items
},

scoreLabel: {
    fontWeight: "bold",
    marginRight: "5px",
},

  updateButton: {
    backgroundColor: "#000080",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    marginLeft: "10px",
    marginTop: "10px",
  },

  quickStatisticsContainer: {
    marginBottom: "20px",
  },

  quickStatisticsTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  quickStatistics: {
    display: "flex",
    gap: "20px",
  },

  statCard: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    justifyContent: "center",
  },

  statIcon: {
    fontSize: "24px",
    marginRight: "10px",
  },

  statText: {
    fontSize: "18px",
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: "12px",
    color: "#666",
  },

  graphSection: {
    marginTop: "20px",
  },

  comparisonGraphTitle: { // Style for Comparison Graph title
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  comparisonGraphDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
},
comparisonGraphChart: {
  flexGrow: 1, // Allow the chart to take up available space within the graph container
},

  graph: {
    height: "250px", // Set a fixed height for the graph container
    display: "flex",
    flexDirection: "column",
    // Add your graph styles here
  },
  analysisSection: {
    marginTop: "20px",
  },
  syllabusTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  progressContainer: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  progressBar: {
    width: "70%",
    backgroundColor: "#eee",
    height: "8px",
    borderRadius: "4px",
    marginRight: "10px",
  },
  questionAnalysisTitle: { // Style for Question Analysis title
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  chart: {
    height: "150px",
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    padding: "10px",
  },
  analysisSection: {
    marginTop: "20px",
    marginBottom: "20px", // Add margin at the bottom
  },
  
  questionAnalysisContent: {
    display: "flex",
    flexDirection: "column", // Stack elements vertically
  },
  scoreAndMessage: { // Style for the score and message container
    display: "flex",
    alignItems: "flex-start", // Align to the top
    marginBottom: "10px", // Spacing below score and message
    gap: "20px", // Add spacing between score and message
  },
  scoreContainer: { // Style for the score
    backgroundColor: "#f0f4f8",
    padding: "10px 15px",
    borderRadius: "5px",
  },
  scoreText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  analysisMessage: {
    flex: 1, // Allow message to take up available space
  },
  chart: {
    height: "150px",
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    padding: "10px",
    display: "flex", // Use flexbox for centering
    alignItems: "center", // Vertically center content
    justifyContent: "center", // Horizontally center content
  },
  
};


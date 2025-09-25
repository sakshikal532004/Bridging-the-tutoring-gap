import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Grid, Button, Paper, Avatar, ThemeProvider, createTheme, CircularProgress, Alert,
  TextField, List, ListItem, ListItemText, ListItemIcon, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, FormControl, InputLabel, Container, Radio, RadioGroup, 
  FormControlLabel, Divider, ListItemAvatar
} from "@mui/material";
import {
  People as StudentsIcon,
  EventNote as AttendanceIcon,
  MenuBook as MaterialsIcon,
  Quiz as QuizIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  BarChart as ChartIcon,
  Notifications as NoticesIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow,
  Timer
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a11cb",
      light: "#8a3dd8",
      dark: "#4a0b9b",
    },
    secondary: {
      main: "#2575fc",
      light: "#5191fd",
      dark: "#0057cc",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 16,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        }
      }
    }
  },
});

// Analytics Page Component
function AnalyticsPage() {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin')}
        >
          Back to Dashboard
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Performance Trends</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Student performance over time
              </Typography>
              <Box sx={{ height: 200, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Chart Placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChartIcon color="secondary" sx={{ mr: 2 }} />
                <Typography variant="h6">Subject Analytics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Performance by subject
              </Typography>
              <Box sx={{ height: 200, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Chart Placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Detailed Reports</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Generate and view comprehensive reports
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="primary" fullWidth>
                    Student Performance
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="secondary" fullWidth>
                    Attendance Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Quiz Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Quizzes Management Page Component
function ManageQuizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Quiz dialog states
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ 
    title: "", 
    subject: "", 
    standard: "", 
    level: "", 
    stream: "",
    timeLimit: 600,
    questions: [
      { id: 1, text: "", options: ["", "", "", ""], correctAnswer: "" }
    ]
  });
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Stream-wise subjects for standards 11 and 12
  const streamSubjects = {
    "Std 11": {
      "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
      "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
      "Arts": ["History", "Geography", "Political Science", "Psychology", "Sociology", "English"]
    },
    "Std 12": {
      "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
      "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
      "Arts": ["History", "Geography", "Political Science", "Psychology", "Sociology", "English"]
    }
  };

  // Base subjects for standards 5-10
  const baseSubjects = ["Mathematics", "Science", "English", "History", "Geography", "Computer Science"];

  // Function to get subjects based on standard and stream
  const getSubjectsForStandard = (standard, stream = "") => {
    if (standard === "Std 11" || standard === "Std 12") {
      return streamSubjects[standard][stream] || [];
    } else {
      return baseSubjects;
    }
  };

  // Function to trigger data update event
  const triggerDataUpdate = () => {
    window.dispatchEvent(new Event('dataUpdated'));
  };

  // Load quizzes data
  useEffect(() => {
    const loadQuizzes = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get quizzes data
        let quizzes = [];
        const quizKeys = ["quizzes", "quizData", "quizResults"];
        
        for (const key of quizKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsedQuizzes = JSON.parse(data);
              quizzes = quizzes.concat(parsedQuizzes);
              console.log(`Found ${parsedQuizzes.length} quizzes in key: ${key}`);
            } catch (e) {
              console.error(`Error parsing ${key}:`, e);
            }
          }
        }
        
        setQuizzes(quizzes);
        setLoading(false);
      } catch (error) {
        console.error("Error loading quizzes:", error);
        setError("Failed to load quizzes. Please try again.");
        setLoading(false);
      }
    };
    
    loadQuizzes();
    
    // Set up a listener to update quizzes when data changes
    const handleStorageChange = (e) => {
      console.log("Storage change detected:", e);
      loadQuizzes();
    };
    
    // Also check for custom events that might be triggered by your app
    const handleCustomEvent = () => {
      console.log("Custom data change event detected");
      loadQuizzes();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleCustomEvent);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleCustomEvent);
    };
  }, []);

  // Quiz dialog functions
  const handleQuizDialogOpen = () => {
    setQuizDialogOpen(true);
    setNewQuiz({ 
      title: "", 
      subject: "", 
      standard: "", 
      level: "", 
      stream: "",
      timeLimit: 600,
      questions: [
        { id: 1, text: "", options: ["", "", "", ""], correctAnswer: "" }
      ]
    });
    setEditingQuiz(null);
  };

  const handleQuizDialogClose = () => {
    setQuizDialogOpen(false);
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz(prev => ({ ...prev, [name]: value }));
    
    // If standard is changed, reset subject and stream
    if (name === "standard") {
      setNewQuiz(prev => ({ ...prev, subject: "", stream: "" }));
    }
    
    // If stream is changed, reset subject
    if (name === "stream") {
      setNewQuiz(prev => ({ ...prev, subject: "" }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = { 
      ...updatedQuestions[questionIndex], 
      options: updatedOptions 
    };
    setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: newQuiz.questions.length + 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    };
    setNewQuiz(prev => ({ 
      ...prev, 
      questions: [...prev.questions, newQuestion] 
    }));
  };

  const removeQuestion = (index) => {
    if (newQuiz.questions.length <= 1) {
      alert("A quiz must have at least one question.");
      return;
    }
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions.splice(index, 1);
    setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSaveQuiz = () => {
    if (!newQuiz.title.trim() || !newQuiz.subject.trim() || !newQuiz.standard.trim()) {
      alert("Please fill in title, subject, and standard.");
      return;
    }

    // For standards 11 and 12, stream is required
    if ((newQuiz.standard === "Std 11" || newQuiz.standard === "Std 12") && !newQuiz.stream) {
      alert("Please select a stream for standards 11 and 12.");
      return;
    }

    // Validate questions
    for (let i = 0; i < newQuiz.questions.length; i++) {
      const question = newQuiz.questions[i];
      if (!question.text.trim()) {
        alert(`Please fill in the text for question ${i + 1}.`);
        return;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          alert(`Please fill in option ${j + 1} for question ${i + 1}.`);
          return;
        }
      }
      if (!question.correctAnswer.trim()) {
        alert(`Please select the correct answer for question ${i + 1}.`);
        return;
      }
    }

    const updatedQuizzes = [...quizzes];
    const quizToSave = {
      ...newQuiz,
      id: editingQuiz ? editingQuiz.id : `quiz-${Date.now()}`,
      isActive: true
    };

    if (editingQuiz) {
      // Update existing quiz
      const index = updatedQuizzes.findIndex(q => q.id === editingQuiz.id);
      if (index !== -1) {
        updatedQuizzes[index] = quizToSave;
      }
    } else {
      // Add new quiz
      updatedQuizzes.unshift(quizToSave);
    }

    setQuizzes(updatedQuizzes);
    
    // Create normalized version for quiz play component
    const normalizedQuizzes = updatedQuizzes.map(quiz => ({
      ...quiz,
      standard: quiz.standard.replace("Std ", "").trim(),
      // Create a searchable key for the quiz
      searchKey: `${quiz.subject.toLowerCase()}-${quiz.standard.replace("Std ", "").trim()}-${quiz.level.toLowerCase()}`
    }));
    
    // Create a special format for the quiz play component
    const quizPlayData = {};
    updatedQuizzes.forEach(quiz => {
      const subject = quiz.subject.toLowerCase();
      const standard = quiz.standard.replace("Std ", "").trim();
      const level = quiz.level.toLowerCase();
      
      if (!quizPlayData[subject]) {
        quizPlayData[subject] = {};
      }
      
      if (!quizPlayData[subject][standard]) {
        quizPlayData[subject][standard] = {};
      }
      
      if (!quizPlayData[subject][standard][level]) {
        quizPlayData[subject][standard][level] = [];
      }
      
      quizPlayData[subject][standard][level].push(quiz);
    });
    
    // Save to all possible quiz keys to ensure compatibility with quiz play component
    const quizKeys = ["quizzes", "quizData", "quizResults"];
    quizKeys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(updatedQuizzes));
      console.log(`Saved quizzes to ${key}`);
    });
    
    // Save normalized version specifically for quiz play component
    localStorage.setItem("normalizedQuizzes", JSON.stringify(normalizedQuizzes));
    console.log("Saved normalized quizzes to normalizedQuizzes");
    
    // Save special format for quiz play component
    localStorage.setItem("quizPlayData", JSON.stringify(quizPlayData));
    console.log("Saved quiz play data to quizPlayData");
    
    setQuizDialogOpen(false);
    triggerDataUpdate();
    
    // Log the saved quiz for debugging
    console.log("Quiz saved successfully:", quizToSave);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setNewQuiz(quiz);
    setQuizDialogOpen(true);
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
      setQuizzes(updatedQuizzes);
      
      // Create normalized version for quiz play component
      const normalizedQuizzes = updatedQuizzes.map(quiz => ({
        ...quiz,
        standard: quiz.standard.replace("Std ", "").trim(),
        // Create a searchable key for the quiz
        searchKey: `${quiz.subject.toLowerCase()}-${quiz.standard.replace("Std ", "").trim()}-${quiz.level.toLowerCase()}`
      }));
      
      // Create a special format for the quiz play component
      const quizPlayData = {};
      updatedQuizzes.forEach(quiz => {
        const subject = quiz.subject.toLowerCase();
        const standard = quiz.standard.replace("Std ", "").trim();
        const level = quiz.level.toLowerCase();
        
        if (!quizPlayData[subject]) {
          quizPlayData[subject] = {};
        }
        
        if (!quizPlayData[subject][standard]) {
          quizPlayData[subject][standard] = {};
        }
        
        if (!quizPlayData[subject][standard][level]) {
          quizPlayData[subject][standard][level] = [];
        }
        
        quizPlayData[subject][standard][level].push(quiz);
      });
      
      // Delete from all possible quiz keys
      const quizKeys = ["quizzes", "quizData", "quizResults"];
      quizKeys.forEach(key => {
        localStorage.setItem(key, JSON.stringify(updatedQuizzes));
        console.log(`Deleted quiz from ${key}`);
      });
      
      // Update normalized quizzes
      localStorage.setItem("normalizedQuizzes", JSON.stringify(normalizedQuizzes));
      console.log("Updated normalized quizzes after deletion");
      
      // Update quiz play data
      localStorage.setItem("quizPlayData", JSON.stringify(quizPlayData));
      console.log("Updated quiz play data after deletion");
      
      triggerDataUpdate();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "background.default",
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Manage Quizzes
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Quiz List
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleQuizDialogOpen}
              >
                Add Quiz
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : quizzes.length > 0 ? (
              <List sx={{ py: 0 }}>
                {quizzes.map((quiz) => (
                  <ListItem
                    key={quiz.id}
                    divider
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" onClick={() => handleEditQuiz(quiz)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleDeleteQuiz(quiz.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Chip 
                        label={`${quiz.subject} - ${quiz.standard} ${quiz.stream ? `(${quiz.stream})` : ''}`} 
                        size="small" 
                        color="primary" 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={quiz.title}
                      secondary={`${quiz.questions.length} questions • ${Math.floor(quiz.timeLimit / 60)} minutes`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No quizzes available. Add a quiz for students to take.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        
        {/* Quiz Dialog */}
        <Dialog open={quizDialogOpen} onClose={handleQuizDialogClose} fullWidth maxWidth="md">
          <DialogTitle>
            {editingQuiz ? "Edit Quiz" : "Add New Quiz"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="title"
                  label="Quiz Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newQuiz.title}
                  onChange={handleQuizChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Standard</InputLabel>
                  <Select
                    name="standard"
                    value={newQuiz.standard}
                    onChange={handleQuizChange}
                    label="Standard"
                  >
                    <MenuItem value="Std 5">Std 5</MenuItem>
                    <MenuItem value="Std 6">Std 6</MenuItem>
                    <MenuItem value="Std 7">Std 7</MenuItem>
                    <MenuItem value="Std 8">Std 8</MenuItem>
                    <MenuItem value="Std 9">Std 9</MenuItem>
                    <MenuItem value="Std 10">Std 10</MenuItem>
                    <MenuItem value="Std 11">Std 11</MenuItem>
                    <MenuItem value="Std 12">Std 12</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {(newQuiz.standard === "Std 11" || newQuiz.standard === "Std 12") && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Stream</InputLabel>
                    <Select
                      name="stream"
                      value={newQuiz.stream}
                      onChange={handleQuizChange}
                      label="Stream"
                    >
                      <MenuItem value="Science">Science</MenuItem>
                      <MenuItem value="Commerce">Commerce</MenuItem>
                      <MenuItem value="Arts">Arts</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Subject</InputLabel>
                  <Select
                    name="subject"
                    value={newQuiz.subject}
                    onChange={handleQuizChange}
                    label="Subject"
                  >
                    {getSubjectsForStandard(newQuiz.standard, newQuiz.stream).map(subject => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Level</InputLabel>
                  <Select
                    name="level"
                    value={newQuiz.level}
                    onChange={handleQuizChange}
                    label="Level"
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Time Limit (minutes)</InputLabel>
                  <Select
                    name="timeLimit"
                    value={newQuiz.timeLimit}
                    onChange={handleQuizChange}
                    label="Time Limit (minutes)"
                  >
                    <MenuItem value={300}>5 minutes</MenuItem>
                    <MenuItem value={600}>10 minutes</MenuItem>
                    <MenuItem value={900}>15 minutes</MenuItem>
                    <MenuItem value={1200}>20 minutes</MenuItem>
                    <MenuItem value={1800}>30 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Questions</Typography>
              
              {newQuiz.questions.map((question, questionIndex) => (
                <Accordion key={questionIndex} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Question {questionIndex + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Question Text"
                          fullWidth
                          variant="outlined"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Options</Typography>
                        <Grid container spacing={1}>
                          {question.options.map((option, optionIndex) => (
                            <Grid item xs={12} md={6} key={optionIndex}>
                              <TextField
                                label={`Option ${optionIndex + 1}`}
                                fullWidth
                                variant="outlined"
                                value={option}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Correct Answer</InputLabel>
                          <Select
                            value={question.correctAnswer}
                            onChange={(e) => handleQuestionChange(questionIndex, 'correctAnswer', e.target.value)}
                            label="Correct Answer"
                          >
                            {question.options.map((option, optionIndex) => (
                              <MenuItem key={optionIndex} value={option}>
                                Option {optionIndex + 1}: {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button 
                          variant="outlined" 
                          color="error"
                          onClick={() => removeQuestion(questionIndex)}
                          disabled={newQuiz.questions.length <= 1}
                        >
                          Remove Question
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
              
              <Button 
                variant="contained" 
                color="primary"
                onClick={addQuestion}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleQuizDialogClose}>Cancel</Button>
            <Button onClick={handleSaveQuiz} variant="contained" color="primary">
              {editingQuiz ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    totalMaterials: 0,
    activeQuizzes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [debugInfo, setDebugInfo] = useState({});
  
  // Notice states
  const [notices, setNotices] = useState([]);
  const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", message: "" });
  const [editingNotice, setEditingNotice] = useState(null);

  // Handle logout function
  const handleLogout = () => {
    // Clear any authentication tokens or user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Redirect to homepage
    navigate('/');
  };

  // Function to trigger data update event
  const triggerDataUpdate = () => {
    window.dispatchEvent(new Event('dataUpdated'));
  };

  // Calculate statistics from localStorage data only (no API calls)
  const calculateStats = () => {
    try {
      console.log("Calculating stats from localStorage...");
      setLoading(true);
      setError(null);

      // Debug: Log all localStorage keys
      const localStorageKeys = Object.keys(localStorage);
      console.log("LocalStorage keys:", localStorageKeys);

      // Create debug info object
      const newDebugInfo = {};

      // Get students data - try multiple possible keys
      let students = [];
      const studentKeys = ["students", "users", "studentData", "userData"];

      for (const key of studentKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            students = JSON.parse(data);
            console.log(`Found ${students.length} students in key: ${key}`);
            newDebugInfo.studentsKey = key;
            newDebugInfo.studentsCount = students.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const totalStudents = Array.isArray(students) ? students.length : 0;
      console.log("Total students:", totalStudents);

      // Get attendance data and calculate average
      let attendance = [];
      const attendanceKeys = ["attendance", "attendanceData"];

      for (const key of attendanceKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            attendance = JSON.parse(data);
            console.log(`Found ${attendance.length} attendance records in key: ${key}`);
            newDebugInfo.attendanceKey = key;
            newDebugInfo.attendanceCount = attendance.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      let totalAttendanceRecords = 0;
      let presentRecords = 0;

      if (Array.isArray(attendance)) {
        attendance.forEach(record => {
          totalAttendanceRecords++;
          if (record.status === "Present") {
            presentRecords++;
          }
        });
      }

      const avgAttendance = totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;
      console.log("Average attendance:", avgAttendance);
      newDebugInfo.avgAttendance = avgAttendance;

      // Get study materials count
      let materials = [];
      const materialKeys = ["studyMaterials", "materials", "resources"];

      for (const key of materialKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            materials = JSON.parse(data);
            console.log(`Found ${materials.length} materials in key: ${key}`);
            newDebugInfo.materialsKey = key;
            newDebugInfo.materialsCount = materials.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const totalMaterials = Array.isArray(materials) ? materials.length : 0;
      console.log("Total materials:", totalMaterials);

      // Get quizzes data
      let quizzes = [];
      const quizKeys = ["quizzes", "quizData", "quizResults"];

      for (const key of quizKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            quizzes = JSON.parse(data);
            console.log(`Found ${quizzes.length} quizzes in key: ${key}`);
            newDebugInfo.quizzesKey = key;
            newDebugInfo.quizzesCount = quizzes.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const activeQuizzes = Array.isArray(quizzes)
        ? quizzes.filter(quiz => quiz.isActive !== false).length
        : 0;
      console.log("Active quizzes:", activeQuizzes);

      // Load notices
      const storedNotices = JSON.parse(localStorage.getItem("notices") || "[]");
      setNotices(storedNotices);

      setStats({
        totalStudents,
        avgAttendance,
        totalMaterials,
        activeQuizzes
      });

      setDebugInfo(newDebugInfo);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error calculating stats:", error);
      setError("Failed to load statistics. Please try again.");
      setLoading(false);
    }
  };

  // Function to add sample data for testing
  const addSampleData = () => {
    try {
      // Add sample students
      const sampleStudents = [
        { id: 1, name: "John Doe", email: "john@example.com", grade: "10" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", grade: "11" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", grade: "9" }
      ];
      localStorage.setItem("students", JSON.stringify(sampleStudents));

      // Add sample attendance
      const sampleAttendance = [
        { id: 1, studentId: 1, date: "2023-09-01", subject: "Math", status: "Present" },
        { id: 2, studentId: 2, date: "2023-09-01", subject: "Math", status: "Present" },
        { id: 3, studentId: 3, date: "2023-09-01", subject: "Math", status: "Absent" }
      ];
      localStorage.setItem("attendance", JSON.stringify(sampleAttendance));

      // Add sample materials
      const sampleMaterials = [
        { id: 1, title: "Algebra Basics", type: "pdf", url: "#", standard: "Std 10", subject: "Mathematics" },
        { id: 2, title: "Chemistry Lab Safety", type: "video", url: "#", standard: "Std 11", subject: "Chemistry", stream: "Science" }
      ];
      localStorage.setItem("studyMaterials", JSON.stringify(sampleMaterials));

      // Create sample quizzes for standards 5 to 12 with streams for 11 and 12
      const sampleQuizzes = [];
      
      // Generate quizzes for each standard from 5 to 12
      for (let std = 5; std <= 12; std++) {
        // Mathematics Quiz - Beginner
        sampleQuizzes.push({
          id: `math-quiz-${std}-beginner`,
          title: `Mathematics - Std ${std} - Beginner`,
          subject: "Mathematics",
          standard: `Std ${std}`,
          level: "Beginner",
          timeLimit: 600, // 10 minutes
          isActive: true,
          questions: [
            {
              id: 1,
              text: `What is ${std * 2} + ${std + 3}?`,
              options: [`${std * 3}`, `${std * 2 + std + 3}`, `${std * 2 + std + 2}`, `${std * 2 + std + 4}`],
              correctAnswer: `${std * 2 + std + 3}`
            },
            {
              id: 2,
              text: `What is ${std * 3} - ${std + 5}?`,
              options: [`${std * 3 - std - 5}`, `${std * 3 - std - 4}`, `${std * 3 - std - 6}`, `${std * 3 - std - 3}`],
              correctAnswer: `${std * 3 - std - 5}`
            },
            {
              id: 3,
              text: `What is ${std} × ${std + 1}?`,
              options: [`${std * (std + 1)}`, `${std * std}`, `${std * (std + 2)}`, `${(std + 1) * (std + 1)}`],
              correctAnswer: `${std * (std + 1)}`
            }
          ]
        });
        
        // Science Quiz - Beginner
        sampleQuizzes.push({
          id: `science-quiz-${std}-beginner`,
          title: `Science - Std ${std} - Beginner`,
          subject: "Science",
          standard: `Std ${std}`,
          level: "Beginner",
          timeLimit: 600, // 10 minutes
          isActive: true,
          questions: [
            {
              id: 1,
              text: "What is the chemical symbol for water?",
              options: ["H2O", "CO2", "O2", "NaCl"],
              correctAnswer: "H2O"
            },
            {
              id: 2,
              text: "Which planet is closest to the sun?",
              options: ["Venus", "Mercury", "Earth", "Mars"],
              correctAnswer: "Mercury"
            },
            {
              id: 3,
              text: "What is the process by which plants make their food?",
              options: ["Respiration", "Photosynthesis", "Digestion", "Circulation"],
              correctAnswer: "Photosynthesis"
            }
          ]
        });
        
        // English Quiz - Beginner
        sampleQuizzes.push({
          id: `english-quiz-${std}-beginner`,
          title: `English - Std ${std} - Beginner`,
          subject: "English",
          standard: `Std ${std}`,
          level: "Beginner",
          timeLimit: 600, // 10 minutes
          isActive: true,
          questions: [
            {
              id: 1,
              text: "What is the past tense of 'go'?",
              options: ["went", "gone", "going", "goes"],
              correctAnswer: "went"
            },
            {
              id: 2,
              text: "Which word is a noun?",
              options: ["run", "quickly", "happiness", "beautiful"],
              correctAnswer: "happiness"
            },
            {
              id: 3,
              text: "What is the plural form of 'child'?",
              options: ["childs", "children", "childes", "child's"],
              correctAnswer: "children"
            }
          ]
        });
      }
      
      // Add stream-specific quizzes for standards 11 and 12
      const streams = ["Science", "Commerce", "Arts"];
      const streamSubjects = {
        "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
        "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
        "Arts": ["History", "Geography", "Political Science", "Psychology", "Sociology", "English"]
      };
      
      for (const std of [11, 12]) {
        for (const stream of streams) {
          for (const subject of streamSubjects[stream]) {
            sampleQuizzes.push({
              id: `${subject.toLowerCase().replace(/\s+/g, '-')}-quiz-std-${std}-${stream.toLowerCase()}-beginner`,
              title: `${subject} - Std ${std} (${stream}) - Beginner`,
              subject: subject,
              standard: `Std ${std}`,
              stream: stream,
              level: "Beginner",
              timeLimit: 600, // 10 minutes
              isActive: true,
              questions: [
                {
                  id: 1,
                  text: `What is the fundamental principle of ${subject} in the ${stream} stream?`,
                  options: [
                    `Principle A of ${subject}`,
                    `Principle B of ${subject}`,
                    `Principle C of ${subject}`,
                    `Principle D of ${subject}`
                  ],
                  correctAnswer: `Principle A of ${subject}`
                },
                {
                  id: 2,
                  text: `Which of the following is a key concept in ${subject}?`,
                  options: [
                    `Concept 1 of ${subject}`,
                    `Concept 2 of ${subject}`,
                    `Concept 3 of ${subject}`,
                    `Concept 4 of ${subject}`
                  ],
                  correctAnswer: `Concept 1 of ${subject}`
                },
                {
                  id: 3,
                  text: `How does ${subject} relate to other subjects in the ${stream} stream?`,
                  options: [
                    `Relationship A`,
                    `Relationship B`,
                    `Relationship C`,
                    `Relationship D`
                  ],
                  correctAnswer: `Relationship A`
                }
              ]
            });
          }
        }
      }
      
      // Create normalized version for quiz play component
      const normalizedQuizzes = sampleQuizzes.map(quiz => ({
        ...quiz,
        standard: quiz.standard.replace("Std ", "").trim(),
        // Create a searchable key for the quiz
        searchKey: `${quiz.subject.toLowerCase()}-${quiz.standard.replace("Std ", "").trim()}-${quiz.level.toLowerCase()}`
      }));
      
      // Create a special format for the quiz play component
      const quizPlayData = {};
      sampleQuizzes.forEach(quiz => {
        const subject = quiz.subject.toLowerCase();
        const standard = quiz.standard.replace("Std ", "").trim();
        const level = quiz.level.toLowerCase();
        
        if (!quizPlayData[subject]) {
          quizPlayData[subject] = {};
        }
        
        if (!quizPlayData[subject][standard]) {
          quizPlayData[subject][standard] = {};
        }
        
        if (!quizPlayData[subject][standard][level]) {
          quizPlayData[subject][standard][level] = [];
        }
        
        quizPlayData[subject][standard][level].push(quiz);
      });
      
      // Save to all possible quiz keys to ensure compatibility
      const quizKeys = ["quizzes", "quizData", "quizResults"];
      quizKeys.forEach(key => {
        localStorage.setItem(key, JSON.stringify(sampleQuizzes));
        console.log(`Saved sample quizzes to ${key}`);
      });
      
      // Save normalized version specifically for quiz play component
      localStorage.setItem("normalizedQuizzes", JSON.stringify(normalizedQuizzes));
      console.log("Saved normalized quizzes to normalizedQuizzes");
      
      // Save special format for quiz play component
      localStorage.setItem("quizPlayData", JSON.stringify(quizPlayData));
      console.log("Saved quiz play data to quizPlayData");

      // Add sample notices
      const sampleNotices = [
        { id: 1, title: "School Holiday", message: "School will be closed next Monday for a public holiday.", date: new Date().toLocaleDateString() },
        { id: 2, title: "Exam Schedule", message: "Final exams will begin from next month. Please prepare accordingly.", date: new Date().toLocaleDateString() }
      ];
      localStorage.setItem("notices", JSON.stringify(sampleNotices));

      // Trigger a refresh and data update event
      calculateStats();
      triggerDataUpdate();

      alert(`Sample data has been added. ${sampleQuizzes.length} quizzes for standards 5-12 with stream-specific subjects for standards 11 and 12 are now available.`);
    } catch (error) {
      console.error("Error adding sample data:", error);
      alert("Failed to add sample data.");
    }
  };

  // Notice functions
  const handleNoticeDialogOpen = () => {
    setNoticeDialogOpen(true);
    setNewNotice({ title: "", message: "" });
    setEditingNotice(null);
  };

  const handleNoticeDialogClose = () => {
    setNoticeDialogOpen(false);
  };

  const handleNoticeChange = (e) => {
    const { name, value } = e.target;
    setNewNotice(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNotice = () => {
    if (!newNotice.title.trim() || !newNotice.message.trim()) {
      alert("Please fill in both title and message.");
      return;
    }

    const updatedNotices = [...notices];
    const noticeToSave = {
      ...newNotice,
      date: new Date().toLocaleDateString(),
      id: editingNotice ? editingNotice.id : Date.now()
    };

    if (editingNotice) {
      // Update existing notice
      const index = updatedNotices.findIndex(n => n.id === editingNotice.id);
      if (index !== -1) {
        updatedNotices[index] = noticeToSave;
      }
    } else {
      // Add new notice
      updatedNotices.unshift(noticeToSave);
    }

    setNotices(updatedNotices);
    localStorage.setItem("notices", JSON.stringify(updatedNotices));
    setNoticeDialogOpen(false);
    triggerDataUpdate();
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setNewNotice({ title: notice.title, message: notice.message });
    setNoticeDialogOpen(true);
  };

  const handleDeleteNotice = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      const updatedNotices = notices.filter(notice => notice.id !== id);
      setNotices(updatedNotices);
      localStorage.setItem("notices", JSON.stringify(updatedNotices));
      triggerDataUpdate();
    }
  };

  useEffect(() => {
    calculateStats();

    // Set up a listener to update stats when data changes
    const handleStorageChange = (e) => {
      console.log("Storage change detected:", e);
      calculateStats();
    };

    // Also check for custom events that might be triggered by your app
    const handleCustomEvent = () => {
      console.log("Custom data change event detected");
      calculateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleCustomEvent);

    // Set up an interval to refresh data periodically (every 30 seconds)
    const intervalId = setInterval(calculateStats, 30000);

    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

  const features = [
    {
      name: "Manage Students",
      route: "/admin/students",
      icon: <StudentsIcon />,
      description: "View, add, edit and remove student profiles",
      color: "primary"
    },
    {
      name: "Manage Attendance",
      route: "/admin/attendance",
      icon: <AttendanceIcon />,
      description: "Track and manage student attendance records",
      color: "secondary"
    },
    {
      name: "Manage Study Materials",
      route: "/admin/materials",
      icon: <MaterialsIcon />,
      description: "Upload and organize educational resources",
      color: "primary"
    },
    {
      name: "Manage Quizzes",
      route: "/admin/quizzes",
      icon: <QuizIcon />,
      description: "Create and manage quiz content",
      color: "secondary"
    }
  ];

  const statsData = [
    {
      title: "Total Students",
      value: loading ? "..." : stats.totalStudents,
      icon: <StudentsIcon />,
      color: "primary"
    },
    {
      title: "Avg. Attendance",
      value: loading ? "..." : `${stats.avgAttendance}%`,
      icon: <AttendanceIcon />,
      color: "secondary"
    },
    {
      title: "Materials",
      value: loading ? "..." : stats.totalMaterials,
      icon: <MaterialsIcon />,
      color: "primary"
    },
    {
      title: "Active Quizzes",
      value: loading ? "..." : stats.activeQuizzes,
      icon: <QuizIcon />,
      color: "secondary"
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        flexDirection: { xs: "column", md: "row" }
      }}>
        {/* Sidebar */}
        <Paper
          elevation={1}
          sx={{
            width: { xs: "100%", md: 260 },
            display: "flex",
            flexDirection: "column",
            borderRight: { md: "1px solid rgba(0, 0, 0, 0.08)" },
            borderBottom: { xs: "1px solid rgba(0, 0, 0, 0.08)", md: "none" },
            borderRadius: 0,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              textAlign: "center"
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Educational Management System
            </Typography>
          </Box>

          <Box sx={{ p: 2, flex: 1 }}>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                p: 2, 
                mb: 1, 
                borderRadius: 2, 
                bgcolor: "rgba(106, 17, 203, 0.08)" 
              }}
            >
              <DashboardIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Dashboard</Typography>
            </Box>

            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                p: 2, 
                mb: 1, 
                borderRadius: 2, 
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" }, 
                cursor: "pointer" 
              }}
              onClick={() => navigate('/admin/analytics')}
            >
              <AnalyticsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Analytics</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.2,
                borderColor: "rgba(211, 47, 47, 0.5)",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "rgba(211, 47, 47, 0.04)"
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflow: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to the administrative control panel. Manage your educational institution from here.
              </Typography>
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={calculateStats}
                disabled={loading}
              >
                Refresh Data
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addSampleData}
              >
                Add Sample Data
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Debug Information */}
          <Card sx={{ mb: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Debug Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Students:</strong> {debugInfo.studentsKey || "Not found"} ({debugInfo.studentsCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Attendance:</strong> {debugInfo.attendanceKey || "Not found"} ({debugInfo.attendanceCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Materials:</strong> {debugInfo.materialsKey || "Not found"} ({debugInfo.materialsCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Quizzes:</strong> {debugInfo.quizzesKey || "Not found"} ({debugInfo.quizzesCount || 0} items)
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsData.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: stat.color === "primary" ? "rgba(106, 17, 203, 0.1)" : "rgba(37, 117, 252, 0.1)",
                          color: stat.color === "primary" ? "primary.main" : "secondary.main",
                          mr: 2
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        {loading ? (
                          <CircularProgress size={24} thickness={4} />
                        ) : (
                          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                            {stat.value}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Notices Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <NoticesIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    Manage Notices
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNoticeDialogOpen}
                >
                  Add Notice
                </Button>
              </Box>
              
              {notices.length > 0 ? (
                <List sx={{ py: 0 }}>
                  {notices.map((notice) => (
                    <ListItem
                      key={notice.id}
                      divider
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" onClick={() => handleEditNotice(notice)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteNotice(notice.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Chip label={notice.date} size="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={notice.title}
                        secondary={notice.message}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No notices available. Add a notice to inform students.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                    }
                  }}
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        bgcolor: feature.color === "primary" ? "rgba(106, 17, 203, 0.1)" : "rgba(37, 117, 252, 0.1)",
                        color: feature.color === "primary" ? "primary.main" : "secondary.main",
                        fontSize: 28
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color={feature.color}
                      size="small"
                      sx={{ mt: "auto" }}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Card sx={{ mt: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => navigate('/admin/students')}
                  >
                    Add New Student
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    onClick={() => navigate('/admin/materials')}
                  >
                    Upload Material
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    onClick={() => navigate('/admin/analytics')}
                  >
                    View Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    onClick={() => navigate('/admin/quizzes')}
                  >
                    Create Quiz
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Notice Dialog */}
      <Dialog open={noticeDialogOpen} onClose={handleNoticeDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingNotice ? "Edit Notice" : "Add New Notice"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Notice Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newNotice.title}
            onChange={handleNoticeChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="message"
            label="Notice Message"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newNotice.message}
            onChange={handleNoticeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoticeDialogClose}>Cancel</Button>
          <Button onClick={handleSaveNotice} variant="contained" color="primary">
            {editingNotice ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

function QuizPlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]); // List of matching quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // The quiz selected by the user
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState(null);
  const [showQuizSelection, setShowQuizSelection] = useState(true); // New state to control quiz selection view

  // Get quiz parameters from location state
  const { subject, standard, level, stream, quizId } = location.state || {};

  // Fetch quiz data based on subject, standard, level, and stream
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("QuizPlay useEffect called with:", { subject, standard, level, stream, quizId });
      
      // Get all quizzes from all sources
      const allQuizzes = getAllQuizzes();
      
      // Log detailed quiz information for debugging
      logQuizDetails(allQuizzes, { subject, standard, level, stream });
      
      let matchingQuizzes = [];
      
      if (subject && standard) {
        const lowerSubject = subject.toLowerCase();
        const normalizedStandard = standard.toString().replace("Std ", "").trim();
        const searchLevel = level ? level.toLowerCase() : "";
        const searchStream = stream ? stream.toLowerCase() : "";
        
        console.log("Searching for quizzes with:", { lowerSubject, normalizedStandard, searchLevel, searchStream });
        
        // Filter quizzes based on subject, standard, level, and stream
        matchingQuizzes = allQuizzes.filter(q => {
          // Ensure quiz has required properties
          if (!q.subject || !q.standard) {
            console.log("Quiz missing required properties:", q);
            return false;
          }
          
          const qSubject = q.subject.toLowerCase();
          const qStandard = q.standard.toString().replace("Std ", "").trim();
          const qLevel = q.level ? q.level.toLowerCase() : "";
          const qStream = q.stream ? q.stream.toLowerCase() : "";
          
          console.log(`Checking quiz: ${q.title || q.id}`, {
            qSubject, qStandard, qLevel, qStream,
            subjectMatch: qSubject === lowerSubject,
            standardMatch: qStandard === normalizedStandard,
            levelMatch: !searchLevel || qLevel === searchLevel,
            streamMatch: !searchStream || qStream === searchStream
          });
          
          // For standards 11 and 12, stream must match if provided
          if ((normalizedStandard === "11" || normalizedStandard === "12") && searchStream) {
            return qSubject === lowerSubject && 
                   qStandard === normalizedStandard &&
                   (!searchLevel || qLevel === searchLevel) &&
                   qStream === searchStream;
          }
          
          // For standards 5-10, or if stream is not provided
          return qSubject === lowerSubject && 
                 qStandard === normalizedStandard &&
                 (!searchLevel || qLevel === searchLevel);
        });
        
        console.log(`Found ${matchingQuizzes.length} matching quizzes after filtering`);
        
        // If a specific quizId is provided, filter the list
        if (quizId && matchingQuizzes.length > 0) {
          matchingQuizzes = matchingQuizzes.filter(q => q.id === quizId);
          console.log(`Filtered to ${matchingQuizzes.length} quiz with ID: ${quizId}`);
        }
        
        setQuizzes(matchingQuizzes);
        
        // If we have exactly one quiz, select it automatically
        if (matchingQuizzes.length === 1) {
          setSelectedQuiz(matchingQuizzes[0]);
          setUserAnswers(new Array(matchingQuizzes[0].questions.length).fill(null));
          setShowQuizSelection(false);
        }
      } else if (quizId) {
        // If only quizId is provided, try to find by ID
        console.log("Searching for quiz by ID:", quizId);
        
        const foundQuiz = allQuizzes.find(q => q.id === quizId);
        if (foundQuiz) {
          setQuizzes([foundQuiz]);
          setSelectedQuiz(foundQuiz);
          setUserAnswers(new Array(foundQuiz.questions.length).fill(null));
          setShowQuizSelection(false);
        } else {
          setError(`No quiz found with ID: ${quizId}. Please contact your administrator.`);
        }
      } else {
        setError("Please select a subject and standard to view available quizzes.");
      }
      
      // If no matching quizzes found, show appropriate message
      if (matchingQuizzes.length === 0 && subject && standard) {
        let errorMessage = `No quizzes found for ${subject} - ${standard}`;
        if (level) errorMessage += ` - ${level}`;
        if (stream) errorMessage += ` (${stream})`;
        errorMessage += '. Please try a different selection or contact your administrator.';
        
        // Add more detailed error information
        errorMessage += '\n\nDebug Information:';
        errorMessage += `\nTotal Quizzes Found: ${allQuizzes.length}`;
        errorMessage += `\nSearch Parameters: ${JSON.stringify({ subject, standard, level, stream })}`;
        
        // Check if there are quizzes for the subject but different standard/level/stream
        const subjectQuizzes = allQuizzes.filter(q => 
          q.subject && q.subject.toLowerCase() === subject.toLowerCase()
        );
        if (subjectQuizzes.length > 0) {
          errorMessage += `\n\nFound ${subjectQuizzes.length} quizzes for ${subject} but with different standards/levels/streams:`;
          subjectQuizzes.slice(0, 3).forEach((quiz, i) => {
            errorMessage += `\n${i+1}. ${quiz.title} (Std ${quiz.standard}, Level: ${quiz.level || 'N/A'}${quiz.stream ? `, Stream: ${quiz.stream}` : ''})`;
          });
          if (subjectQuizzes.length > 3) {
            errorMessage += `\n... and ${subjectQuizzes.length - 3} more`;
          }
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [subject, standard, level, stream, quizId]);

  // Function to start a selected quiz
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.timeLimit || 600); // Default to 10 minutes if not specified
    setQuizStarted(true);
    setShowQuizSelection(false);
    setCurrentQuestion(0);
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = useCallback(() => {
    // Calculate score
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === selectedQuiz.questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / selectedQuiz.questions.length) * 100);
    
    // Save quiz result to localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo")) || {};
    const studentId = user.id || studentInfo.id || "1";
    
    const quizResult = {
      studentId,
      quizId: selectedQuiz.id,
      quizName: selectedQuiz.title,
      subject: selectedQuiz.subject,
      standard: selectedQuiz.standard,
      level: selectedQuiz.level,
      stream: selectedQuiz.stream || "", // Include stream in the result
      score,
      correctAnswers: correctCount,
      totalQuestions: selectedQuiz.questions.length,
      timestamp: new Date().toISOString(),
      results: selectedQuiz.questions.map((question, index) => ({
        question: question.text,
        userAnswer: userAnswers[index],
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswers[index] === question.correctAnswer
      }))
    };
    
    // Get existing quiz results or initialize as empty array
    const existingResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    existingResults.push(quizResult);
    localStorage.setItem("quizResults", JSON.stringify(existingResults));
    
    // Navigate to quiz results page with the result data
    navigate('/student/quiz-results', { state: { quizResult } });
  }, [selectedQuiz, userAnswers, navigate]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, handleSubmitQuiz]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading quizzes...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            <Typography whiteSpace="pre-line">{error}</Typography>
          </Alert>
          
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/student/dashboard')}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {showQuizSelection && quizzes.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                Available Quizzes
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Subject: {subject} | Standard: {standard} {level && `| Level: ${level}`} {stream && `| Stream: ${stream}`}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                {quizzes.map((quiz) => (
                  <ListItem key={quiz.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <QuizIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={quiz.title || `Quiz ${quiz.id}`}
                      secondary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Chip label={`${quiz.questions ? quiz.questions.length : 0} questions`} size="small" />
                          <Chip label={`${Math.floor((quiz.timeLimit || 600) / 60)} mins`} size="small" />
                          <Chip label={`Level: ${quiz.level || 'Medium'}`} size="small" />
                          {(quiz.standard === "11" || quiz.standard === "12") && quiz.stream && (
                            <Chip label={`Stream: ${quiz.stream}`} size="small" color="secondary" />
                          )}
                        </Box>
                      }
                    />
                    <Button 
                      variant="contained" 
                      startIcon={<PlayArrow />}
                      onClick={() => startQuiz(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/student/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {selectedQuiz && !showQuizSelection && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1">
                    {selectedQuiz.title || `Quiz ${selectedQuiz.id}`}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label={selectedQuiz.subject} size="small" color="primary" />
                    <Chip label={`Std ${selectedQuiz.standard}`} size="small" color="info" />
                    {(selectedQuiz.standard === "11" || selectedQuiz.standard === "12") && selectedQuiz.stream && (
                      <Chip label={selectedQuiz.stream} size="small" color="secondary" />
                    )}
                    <Chip label={`Level: ${selectedQuiz.level || 'Medium'}`} size="small" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Timer sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {formatTime(timeLeft)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </Typography>
              </Box>
              
              <Box sx={{ width: '100%', bgcolor: 'primary.light', height: 8, borderRadius: 4, mb: 3 }}>
                <Box 
                  sx={{ 
                    width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%`, 
                    bgcolor: 'primary.main', 
                    height: '100%', 
                    borderRadius: 4 
                  }} 
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {selectedQuiz.questions[currentQuestion].text}
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                <RadioGroup 
                  value={userAnswers[currentQuestion] || ''} 
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                >
                  {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel 
                      key={index} 
                      value={option} 
                      control={<Radio />} 
                      label={option} 
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  variant="outlined" 
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                <Button 
                  variant="contained" 
                  onClick={handleNextQuestion}
                  disabled={!userAnswers[currentQuestion]}
                >
                  {currentQuestion === selectedQuiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

// Helper functions for QuizPlay
function getAllQuizzes() {
  let quizzes = [];
  const quizKeys = ["quizzes", "quizData", "quizResults"];
  
  for (const key of quizKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsedQuizzes = JSON.parse(data);
        quizzes = quizzes.concat(parsedQuizzes);
        console.log(`Found ${parsedQuizzes.length} quizzes in key: ${key}`);
      } catch (e) {
        console.error(`Error parsing ${key}:`, e);
      }
    }
  }
  
  return quizzes;
}

function logQuizDetails(quizzes, searchParams) {
  console.log("Total quizzes available:", quizzes.length);
  console.log("Search parameters:", searchParams);
  
  // Log unique subjects, standards, levels, and streams
  const subjects = [...new Set(quizzes.map(q => q.subject).filter(Boolean))];
  const standards = [...new Set(quizzes.map(q => q.standard).filter(Boolean))];
  const levels = [...new Set(quizzes.map(q => q.level).filter(Boolean))];
  const streams = [...new Set(quizzes.map(q => q.stream).filter(Boolean))];
  
  console.log("Available subjects:", subjects);
  console.log("Available standards:", standards);
  console.log("Available levels:", levels);
  console.log("Available streams:", streams);
}

// Export statements
export default AdminDashboard;
export { AnalyticsPage, ManageQuizzes, QuizPlay };

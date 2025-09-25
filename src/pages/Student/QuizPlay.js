import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Quiz as QuizIcon, PlayArrow, Timer } from "@mui/icons-material";

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
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

// Function to fetch quizzes from admin dashboard
const fetchAdminQuizzes = () => {
  try {
    // Try multiple possible keys for admin quizzes
    const possibleKeys = ["adminQuizzes", "quizzes", "quizData"];
    let adminQuizzes = [];
    
    for (const key of possibleKeys) {
      const quizzes = JSON.parse(localStorage.getItem(key) || "[]");
      if (quizzes.length > 0) {
        console.log(`Found ${quizzes.length} quizzes in key: ${key}`);
        adminQuizzes = [...adminQuizzes, ...quizzes];
      }
    }
    
    // Remove duplicates by ID
    const uniqueQuizzes = [];
    const quizIds = new Set();
    
    adminQuizzes.forEach(quiz => {
      if (!quizIds.has(quiz.id)) {
        quizIds.add(quiz.id);
        uniqueQuizzes.push(quiz);
      }
    });
    
    console.log(`Total unique admin quizzes: ${uniqueQuizzes.length}`);
    return uniqueQuizzes;
  } catch (error) {
    console.error("Error fetching admin quizzes:", error);
    return [];
  }
};

// Function to get all quizzes from all sources
const getAllQuizzes = () => {
  try {
    // Get admin quizzes
    const adminQuizzes = fetchAdminQuizzes();
    
    // Get existing quizzes from other keys
    const quizKeys = ["normalizedQuizzes", "quizResults"];
    let allQuizzes = [...adminQuizzes]; // Start with admin quizzes
    
    for (const key of quizKeys) {
      const quizzes = JSON.parse(localStorage.getItem(key) || "[]");
      if (quizzes.length > 0) {
        // Merge without duplicates
        quizzes.forEach(quiz => {
          if (!allQuizzes.some(q => q.id === quiz.id)) {
            allQuizzes.push(quiz);
          }
        });
        console.log(`Added ${quizzes.length} quizzes from key: ${key}`);
      }
    }
    
    console.log(`Total unique quizzes: ${allQuizzes.length}`);
    return allQuizzes;
  } catch (error) {
    console.error("Error getting all quizzes:", error);
    return [];
  }
};

// Function to check if localStorage has any quiz data
const checkForQuizData = () => {
  const allKeys = Object.keys(localStorage);
  const quizKeys = allKeys.filter(key => 
    key.toLowerCase().includes('quiz') || 
    key.toLowerCase().includes('admin')
  );
  
  console.log("Possible quiz-related keys in localStorage:", quizKeys);
  
  quizKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      console.log(`Key: ${key}, Type: ${Array.isArray(data) ? "Array" : typeof data}, Length: ${Array.isArray(data) ? data.length : "N/A"}`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`Sample quiz from ${key}:`, data[0]);
      }
    } catch (e) {
      console.log(`Key: ${key}, Error parsing: ${e.message}`);
    }
  });
};

// Function to log detailed quiz information for debugging
const logQuizDetails = (quizzes, searchParams) => {
  console.log("=== Detailed Quiz Information ===");
  console.log("Search Parameters:", searchParams);
  
  // Log all quizzes that match the subject
  const subjectMatches = quizzes.filter(q => 
    q.subject && q.subject.toLowerCase() === searchParams.subject.toLowerCase()
  );
  console.log(`Quizzes matching subject "${searchParams.subject}":`, subjectMatches.length);
  
  // Log all quizzes that match the standard
  const standardMatches = quizzes.filter(q => {
    const qStandard = q.standard ? q.standard.toString().replace("Std ", "").trim() : "";
    return qStandard === searchParams.standard.toString();
  });
  console.log(`Quizzes matching standard "${searchParams.standard}":`, standardMatches.length);
  
  // Log all quizzes that match both subject and standard
  const subjectStandardMatches = quizzes.filter(q => {
    const qSubject = q.subject ? q.subject.toLowerCase() : "";
    const qStandard = q.standard ? q.standard.toString().replace("Std ", "").trim() : "";
    return qSubject === searchParams.subject.toLowerCase() && 
           qStandard === searchParams.standard.toString();
  });
  console.log(`Quizzes matching both subject and standard:`, subjectStandardMatches.length);
  
  // Log details of each matching quiz
  if (subjectStandardMatches.length > 0) {
    console.log("Matching quiz details:");
    subjectStandardMatches.forEach((quiz, index) => {
      console.log(`Quiz ${index + 1}:`, {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        standard: quiz.standard,
        level: quiz.level,
        stream: quiz.stream
      });
    });
  }
};

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
  const [debugInfo, setDebugInfo] = useState({}); // Debug information

  // Get quiz parameters from location state
  const { subject, standard, level, stream, quizId } = location.state || {};

  // Fetch quiz data based on subject, standard, level, and stream
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("QuizPlay useEffect called with:", { subject, standard, level, stream, quizId });
      
      // Check for quiz data in localStorage
      checkForQuizData();
      
      // Get all quizzes from all sources
      const allQuizzes = getAllQuizzes();
      
      // Save debug info
      setDebugInfo({
        totalQuizzes: allQuizzes.length,
        searchParams: { subject, standard, level, stream, quizId }
      });
      
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
        
        // Check if there are quizzes for the subject but different standard/level
        const subjectQuizzes = allQuizzes.filter(q => 
          q.subject && q.subject.toLowerCase() === subject.toLowerCase()
        );
        if (subjectQuizzes.length > 0) {
          errorMessage += `\n\nFound ${subjectQuizzes.length} quizzes for ${subject} but with different standards/levels:`;
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

export default QuizPlay;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Button, 
  Divider,
  Paper,
  Grid,
  Chip,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  School as EducatorsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Book as SubjectIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

function Educators() {
  const navigate = useNavigate();
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch educators from localStorage
  useEffect(() => {
    const educatorsData = JSON.parse(localStorage.getItem("educators")) || [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Mathematics Professor",
        subjects: ["Algebra", "Calculus", "Statistics"],
        email: "sarah.johnson@school.edu",
        phone: "+1 (555) 123-4567",
        office: "Room 204, Building A",
        rating: 4.7,
        bio: "Dr. Johnson has over 15 years of teaching experience and specializes in advanced mathematics.",
        education: "Ph.D. in Mathematics, MIT",
        experience: "15 years",
        research: "Mathematical modeling and computational theory"
      },
      {
        id: 2,
        name: "Prof. Michael Chen",
        title: "Science Department Head",
        subjects: ["Physics", "Chemistry", "Biology"],
        email: "michael.chen@school.edu",
        phone: "+1 (555) 234-5678",
        office: "Room 305, Building B",
        rating: 4.5,
        bio: "Prof. Chen is a renowned researcher and educator with a passion for making science accessible to all students.",
        education: "Ph.D. in Physics, Stanford",
        experience: "12 years",
        research: "Quantum physics and nanotechnology"
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        title: "Literature Professor",
        subjects: ["English Literature", "Creative Writing", "Poetry"],
        email: "emily.rodriguez@school.edu",
        phone: "+1 (555) 345-6789",
        office: "Room 112, Building C",
        rating: 4.9,
        bio: "Dr. Rodriguez is an award-winning author and educator who brings literature to life for her students.",
        education: "Ph.D. in English Literature, Harvard",
        experience: "10 years",
        research: "Contemporary American poetry and post-colonial literature"
      },
      {
        id: 4,
        name: "Prof. James Wilson",
        title: "History Professor",
        subjects: ["World History", "Ancient Civilizations", "Political Science"],
        email: "james.wilson@school.edu",
        phone: "+1 (555) 456-7890",
        office: "Room 218, Building A",
        rating: 4.3,
        bio: "Prof. Wilson has traveled extensively and brings real-world historical context to his engaging lectures.",
        education: "Ph.D. in History, Oxford",
        experience: "18 years",
        research: "Ancient civilizations and cultural anthropology"
      }
    ];
    setEducators(educatorsData);
  }, []);

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleViewProfile = (educator) => {
    setSelectedEducator(educator);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedEducator(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar */}
        <Paper 
          elevation={1}
          sx={{ 
            width: 260, 
            display: "flex", 
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
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
              Student Portal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Learn & Grow
            </Typography>
          </Box>
          
          <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
            <List sx={{ py: 0 }}>
              {[
                { text: "Dashboard", icon: <BackIcon />, path: "/dashboard" },
                { text: "Study Materials", icon: <EducatorsIcon />, path: "/materials" },
                { text: "Quizzes", icon: <EducatorsIcon />, path: "/select-standard" },
                { text: "Results", icon: <EducatorsIcon />, path: "/quiz-results" },
                { text: "Attendance", icon: <EducatorsIcon />, path: "/attendance" },
                { text: "Educators", icon: <EducatorsIcon />, path: "/educators" },
              ].map((item, index) => (
                <ListItem 
                  key={index}
                  button
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    mb: 0.5, 
                    borderRadius: 2, 
                    px: 2, 
                    py: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      bgcolor: "rgba(106, 17, 203, 0.08)" 
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button 
              startIcon={<BackIcon />} 
              onClick={() => navigate("/dashboard")}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Our Educators
            </Typography>
          </Box>

          {/* Educators List */}
          <Grid container spacing={3}>
            {educators.map((educator) => (
              <Grid item xs={12} md={6} lg={4} key={educator.id}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column" 
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          mr: 2,
                          bgcolor: "primary.main",
                          fontSize: 28
                        }}
                      >
                        {educator.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {educator.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {educator.title}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating 
                        value={educator.rating} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {educator.rating}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <SubjectIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>
                          Subjects:
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 3, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {educator.subjects.map((subject, index) => (
                          <Chip 
                            key={index}
                            label={subject}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <EmailIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>
                          Email:
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        {educator.email}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <PhoneIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>
                          Phone:
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        {educator.phone}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>
                          Office:
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        {educator.office}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary">
                      {educator.bio}
                    </Typography>
                    
                    <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        fullWidth
                        startIcon={<EmailIcon />}
                        onClick={() => handleEmailClick(educator.email)}
                      >
                        Email
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        fullWidth
                        onClick={() => handleViewProfile(educator)}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Educator Profile Dialog */}
      <Dialog
        open={profileOpen}
        onClose={handleCloseProfile}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden"
          }
        }}
      >
        {selectedEducator && (
          <>
            <DialogTitle sx={{ 
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {selectedEducator.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {selectedEducator.title}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseProfile} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      bgcolor: "primary.main",
                      fontSize: 48
                    }}
                  >
                    {selectedEducator.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ textAlign: "center" }}>
                    <Rating 
                      value={selectedEducator.rating} 
                      precision={0.1} 
                      readOnly 
                      size="medium"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {selectedEducator.rating} Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Professional Information
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Education
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.education}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.experience}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Research Interests
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.research}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Contact Information
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.email}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.phone}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        Office
                      </Typography>
                      <Typography variant="body1">
                        {selectedEducator.office}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Biography
                    </Typography>
                    <Typography variant="body1">
                      {selectedEducator.bio}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<EmailIcon />}
                onClick={() => handleEmailClick(selectedEducator.email)}
              >
                Send Email
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleCloseProfile}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default Educators;
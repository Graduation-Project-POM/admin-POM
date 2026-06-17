import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  containerStyles,
  paperStyles,
  titleStyles,
  subtitleStyles,
  formStyles,
  textFieldStyles,
  buttonStyles,
  linkStyles,
} from "./loginStyle";
import { loginUser } from "../../../services/authService";
import { useAuth } from "../../../services/AuthContext";
import { LanguageToggle } from "../../common/LanguageToggle";

export default function Login() {
  const {t,  i18n } = useTranslation();
  console.log(t("login.welcomeBackTitle"));
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
console.log(i18n.language);
       console.log(i18n.getDataByLanguage("en"));
    if (!userName || !password) {
      setError(t("login.validationRequired"));
      return;
    }

    try {
      const response = await loginUser(userName, password);

      login({
        token: response.accessToken,
        refreshToken: response.refreshToken,
        role: response.role,
        userName: response.userName,
      });

      if (response.role === "Admin") navigate("/admin/dashboard");
      else if (response.role === "Trainer") navigate("/trainer/dashboard");
      else navigate("/student/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || t("login.loginFailed"));
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <LanguageToggle floating />
      <Box sx={containerStyles}>
        
        <Paper elevation={3} sx={paperStyles}>
          <Typography component="h1" variant="h4" sx={titleStyles}>
            {t("login.welcomeBackTitle")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={subtitleStyles}
          >
            {t("login.welcomeBackSubtitle")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={formStyles}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label={t("login.usernameLabel")}
              name="userName"
              autoComplete="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("login.passwordLabel")}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyles}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={t("login.togglePasswordVisibility")}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyles}
            >
              {t("login.signInButton")}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("login.noAccountQuestion")}{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => (window.location.href = "/credentials/signup")}
                  sx={linkStyles}
                >
                  {t("login.signUpLink")}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

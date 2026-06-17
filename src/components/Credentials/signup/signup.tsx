import { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper, Container, Alert, Link,
  InputAdornment, IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  containerStyles, paperStyles, titleStyles, subtitleStyles,
  formStyles, textFieldStyles, buttonStyles, linkStyles,
} from "./signupStyle";
import { signupUser } from "../../../services/authService";
import { LanguageToggle } from "../../common/LanguageToggle";

function getApiErrorMessage(err: any, t: any, fallback: string): string {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (data.code && data.code !== "ERROR" && data.code !== "SERVER_ERROR") {
    return t(`errors.${data.code}`, { defaultValue: data.message || fallback });
  }

  if (data.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return first[0] as string;
  }
  if (typeof data.message === "string") return data.message;
  return fallback;
}

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !userName || !email || !password) {
      setError(t("signup.allFieldsRequired", { defaultValue: "All fields are required" }));
      return;
    }
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError(t("signup.nameShortError", { defaultValue: "First and last name must be at least 2 characters" }));
      return;
    }
    if (userName.trim().length < 4) {
      setError(t("signup.usernameShortError", { defaultValue: "Username must be at least 4 characters" }));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("signup.invalidEmailError", { defaultValue: "Please enter a valid email address" }));
      return;
    }
    if (password.length < 8) {
      setError(t("signup.passwordShortError", { defaultValue: "Password must be at least 8 characters" }));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("signup.passwordMismatchError", { defaultValue: "Passwords do not match" }));
      return;
    }

    try {
      await signupUser({
        firstName,
        middleName: "",
        lastName,
        email,
        userName,
        phoneNumber: null,
        gender: "female",
        profileImageUrl: "",
        password,
        roleID: 4, // required by the DTO; backend forces Student anyway
      });

      setSuccess(t("signup.accountCreated", { defaultValue: "Account created successfully! Redirecting to login..." }));
      setTimeout(() => navigate("/credentials/login"), 1500);
    } catch (err: any) {
      setError(getApiErrorMessage(err, t, t("signup.signupFailed")));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <LanguageToggle floating />
      <Box sx={containerStyles}>
        <Paper elevation={3} sx={paperStyles}>
          <Typography component="h1" variant="h4" sx={titleStyles}>
            {t("signup.createAccountTitle")}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={subtitleStyles}>
            {t("signup.createAccountSubtitle")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSignup} sx={formStyles}>
            <TextField
              margin="normal" required fullWidth
              label={t("signup.firstNameLabel")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              margin="normal" required fullWidth
              label={t("signup.lastNameLabel")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              margin="normal" required fullWidth
              label={t("signup.usernameLabel")}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              margin="normal" required fullWidth
              id="email" name="email" autoComplete="email"
              label={t("signup.emailLabel")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              margin="normal" required fullWidth
              name="password" id="password" autoComplete="new-password"
              label={t("signup.passwordLabel")}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyles}
              helperText={t("signup.passwordHelper")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal" required fullWidth
              name="confirmPassword" id="confirmPassword" autoComplete="new-password"
              label={t("signup.confirmPasswordLabel")}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={textFieldStyles}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button type="submit" fullWidth variant="contained" sx={buttonStyles}>
              {t("signup.signUpButton")}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("signup.alreadyHaveAccount")}{" "}
                <Link
                  component="button" type="button" variant="body2"
                  onClick={() => (window.location.href = "/credentials/login")}
                  sx={linkStyles}
                >
                  {t("signup.signInLink")}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
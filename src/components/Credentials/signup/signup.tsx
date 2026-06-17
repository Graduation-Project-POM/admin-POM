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

import {
  containerStyles,
  paperStyles,
  titleStyles,
  subtitleStyles,
  formStyles,
  textFieldStyles,
  buttonStyles,
  linkStyles,
} from "./signupStyle";
import { signupUser } from "../../../services/authService";

export default function Signup() {
  const { t } = useTranslation();

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
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError(t("signup.passwordMismatchError"));
      return;
    }

    if (password.length < 6) {
      setError(t("signup.passwordShortError"));
      return;
    }

    try {
      const response = await signupUser({
        firstName,
        middleName: "",
        lastName,
        email,
        userName,
        phoneNumber: "",
        gender: "female",
        profileImageUrl: "",
        password,
        roleID: 4,
        createdAt: new Date().toISOString(),
      });


      setSuccess("Account created successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={containerStyles}>
        <Paper elevation={3} sx={paperStyles}>
          <Typography component="h1" variant="h4" sx={titleStyles}>
            {t("signup.createAccountTitle")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={subtitleStyles}
          >
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
            {/* First Name */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={textFieldStyles}
            />

            {/* Last Name */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={textFieldStyles}
            />

            {/* Username */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={textFieldStyles}
            />

            {/* Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("signup.emailLabel")}
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldStyles}
            />

            {/* Password */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("signup.passwordLabel")}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyles}
              helperText={t("signup.passwordHelper")}
              inputprops={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t("signup.confirmPasswordLabel")}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={textFieldStyles}
              inputprops={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyles}
            >
              {t("signup.signUpButton")}
            </Button>

            {/* Login Link */}
            <Box
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t("signup.alreadyHaveAccount")}{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
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

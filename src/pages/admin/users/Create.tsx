import { useState } from "react";
import { Box } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

const Create = ({ open, onClose }: CreateUserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Create New User"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <FormField
            type="text"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <FormField
            type="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            type="select"
            label="User Role"
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
            options={[
              { label: "Student", value: "STUDENT" },
              { label: "Trainer", value: "TRAINER" },
              { label: "Administrator", value: "ADMIN" },
            ]}
          />

          <FormField
            type="switch"
            label="Active Account"
            name="isActive"
            value={formData.isActive}
            onChange={handleSwitchChange}
          />

          <FormField
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormField
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          Create User
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Create;

import { useState } from "react";
import {
  Box,
  MenuItem,
} from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";

interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: UserFormData | null;
}

const Edit = ({ open, onClose, userData }: EditUserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    userData || {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      isActive: true,
    },
  );

  // Update form if userData changes (when modal opens)
  useState(() => {
    if (userData) setFormData(userData);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated User Data:", formData);
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Edit User" maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            label="User Role"
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
            select
          >
            <MenuItem value="STUDENT">Student</MenuItem>
            <MenuItem value="TRAINER">Trainer</MenuItem>
            <MenuItem value="ADMIN">Administrator</MenuItem>
          </FormField>
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {" "}
          Edit{" "}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Edit;

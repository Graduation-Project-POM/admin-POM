import React, { useRef, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ImagePlus, X } from "lucide-react";
import { Button } from "../button/Button";
import { Label } from "../label/Label";
import { problemsService } from "../../../services/problemsService";
import { resolveMediaUrl } from "../../../utils/media";
import { getApiErrorMessage } from "../../../utils/apiError";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}


export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; 
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await problemsService.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          t("problem.form.imageUploadFailed", "Failed to upload image"),
        ),
      );
    } finally {
      setUploading(false);
    }
  };

  const preview = resolveMediaUrl(value);

  return (
    <Box sx={{ width: "100%" }}>
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Button
          type="button"
          variantType="outline"
          startIcon={
            uploading ? <CircularProgress size={16} /> : <ImagePlus size={16} />
          }
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? t("problem.form.imageUploading", "Uploading...")
            : value
              ? t("problem.form.imageChange", "Change image")
              : t("problem.form.imageChoose", "Choose image")}
        </Button>
        {value && !uploading && (
          <Button
            type="button"
            variantType="danger"
            size="small"
            startIcon={<X size={14} />}
            onClick={() => onChange("")}
          >
            {t("problem.form.imageRemove", "Remove")}
          </Button>
        )}
      </Box>
      {preview && (
        <Box
          component="img"
          src={preview}
          alt="preview"
          sx={{
            mt: 1.5,
            maxHeight: 140,
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            bgcolor: "#f8fafc",
            display: "block",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {error && (
        <Typography
          sx={{ mt: 1, color: "#dc2626", fontSize: "12px", fontWeight: 600 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

// SharedTable.tsx
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  ThemeProvider,
  IconButton,
  Checkbox,
  TextField,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../button/Button";
import {
  theme,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
} from "./tableStyle";
import type { SharedTableProps, TableRowBase } from "../../../types/index";

export function SharedTable<TRow extends TableRowBase>({
  data,
  columns,
  onRowSelect,
  onAdd,
  onDelete,
  onEdit,
  onSingleDelete,
  addButtonLabel,
  searchPlaceholder,
  canEditRow,
  canDeleteRow,
}: SharedTableProps<TRow>) {
  const { t } = useTranslation();

  const rowCanEdit = (row: TRow) => !!onEdit && (canEditRow ? canEditRow(row) : true);
  const rowCanDelete = (row: TRow) => !!onSingleDelete && (canDeleteRow ? canDeleteRow(row) : true);
  const rowSelectable = (row: TRow) => (canDeleteRow ? canDeleteRow(row) : true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRow, setCurrentRow] = useState<TRow | null>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: TRow) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleEdit = () => {
    if (currentRow && onEdit) onEdit(currentRow);
    handleActionClose();
  };

  const handleDelete = () => {
    if (currentRow && onSingleDelete) onSingleDelete(String(currentRow.id));
    handleActionClose();
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const selectableData = filteredData.filter(rowSelectable);

  const handleSelectAll = (checked: boolean) => {
    const newSelected: Set<string> = checked
      ? new Set(selectableData.map((row) => String(row.id)))
      : new Set();
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const selectedIds = Array.from(selectedRows).map((id) => String(id));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder={searchPlaceholder ?? t("ui.table.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 320,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#fff",
              "& fieldset": {
                borderColor: "#e5e7eb",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8B1D23",
                borderWidth: "1.5px",
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9ca3af" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={1.5}>
          {onDelete && (
            <Button
              variantType="default"
              onClick={() => onDelete(selectedIds)}
              disabled={selectedRows.size === 0}
              startIcon={<Trash2 size={16} />}
            >
              {t("buttons.delete")} {selectedRows.size > 0 ? `(${selectedRows.size})` : ""}
            </Button>
          )}
          {onAdd && (
            <Button
              variantType="default"
              onClick={onAdd}
              startIcon={<Plus size={16} />}
            >
              {addButtonLabel ?? t("ui.table.createButton")}
            </Button>
          )}
        </Stack>
      </Box>
      <Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            border: "1px solid #e5e7eb",
            backgroundColor: "#fff",
          }}
        >
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedRows.size === selectableData.length &&
                      selectableData.length > 0
                    }
                    indeterminate={
                      selectedRows.size > 0 &&
                      selectedRows.size < selectableData.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: "#cbd5e1",
                      "&.Mui-checked": {
                        color: "#8B1D23",
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: "#8B1D23",
                      },
                    }}
                  />
                </StyledTableCell>
                {columns.map((col) => (
                  <StyledTableCell key={col.id}>{col.label}</StyledTableCell>
                ))}
                <StyledTableCell align="center">{t("common.actions")}</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.has(String(row.id))}
                      disabled={!rowSelectable(row)}
                      onChange={(e) =>
                        handleSelectRow(String(row.id), e.target.checked)
                      }
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": {
                          color: "#8B1D23",
                        },
                      }}
                    />
                  </StyledTableCell>
                  {columns.map((col) => (
                    <StyledTableCell key={col.id}>
                      {col.render
                        ? col.render(row)
                        : ((row as Record<string, unknown>)[col.id] as React.ReactNode)}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">
                    {(rowCanEdit(row) || rowCanDelete(row)) && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionClick(e, row)}
                      >
                        <MoreVertical size={18} color="#64748b" />
                      </IconButton>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleActionClose}
          elevation={2}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "10px",
              minWidth: 140,
              mt: 0.5,
              border: "1px solid #e5e7eb",
            },
          }}
        >
          {currentRow && rowCanEdit(currentRow) && (
          <MenuItem onClick={handleEdit} sx={{ py: 1, px: 2 }}>
            <ListItemIcon sx={{ minWidth: "32px !important" }}>
              <Pencil size={16} color="#64748b" />
            </ListItemIcon>
            <ListItemText
              primary={t("buttons.edit")}
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", fontWeight: 600, color: "#1e293b" },
                },
              }}
            />
          </MenuItem>
          )}
          {currentRow && rowCanDelete(currentRow) && (
          <MenuItem
            onClick={handleDelete}
            sx={{ py: 1, px: 2, "&:hover": { bgcolor: "#fef2f2" } }}
          >
            <ListItemIcon sx={{ minWidth: "32px !important" }}>
              <Trash2 size={16} color="#ef4444" />
            </ListItemIcon>
            <ListItemText
              primary={t("buttons.delete")}
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", fontWeight: 600, color: "#ef4444" },
                },
              }}
            />
          </MenuItem>
          )}
        </Menu>
      </Box>
    </ThemeProvider>
  );
}
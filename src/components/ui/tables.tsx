import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  createTheme,
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
import { Button } from "./button/Button";

export const theme = createTheme({
  typography: {
    fontFamily: "Lenos, sans-serif",
  },
});

// No longer need TableContainerStyled – use sx directly
// If you want to keep it, remove component={Paper} usage

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f9fafb",
  borderBottom: "2px solid #e5e7eb",
  "& th": {
    fontWeight: 700,
    color: "#374151",
    fontSize: "12px",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    padding: "14px",
  },
});

const StyledTableRow = styled(TableRow)({
  borderBottom: "1px solid #f3f4f6",
  "&:hover": {
    backgroundColor: "#fafafa",
  },
});

const StyledTableCell = styled(TableCell)({
  padding: "12px 14px",
  color: "#1f2937",
  fontSize: "14px",
});

interface Column {
  id: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface SharedTableProps {
  title?: string;
  data: any[];
  columns: Column[];
  onRowSelect?: (selectedIds: string[]) => void;
  onAdd?: () => void;
  onDelete?: (selectedIds: string[]) => void;
  onEdit?: (row: any) => void;
  onSingleDelete?: (id: string) => void;
  addButtonLabel?: string;
  searchPlaceholder?: string;
}

export const SharedTable: React.FC<SharedTableProps> = ({
  data,
  columns,
  onRowSelect,
  onAdd,
  onDelete,
  onEdit,
  onSingleDelete,
  addButtonLabel = "Create",
  searchPlaceholder = "Search...",
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRow, setCurrentRow] = useState<any | null>(null);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
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

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked
      ? new Set(filteredData.map((row) => row.id))
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
          placeholder={searchPlaceholder}
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
              variantType="danger"
              onClick={() => onDelete(selectedIds)}
              disabled={selectedRows.size === 0}
              startIcon={<Trash2 size={16} />}
            >
              Delete {selectedRows.size > 0 ? `(${selectedRows.size})` : ""}
            </Button>
          )}
          {onAdd && (
            <Button
              variantType="default"
              onClick={onAdd}
              startIcon={<Plus size={16} />}
            >
              {addButtonLabel}
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
                      selectedRows.size === filteredData.length &&
                      filteredData.length > 0
                    }
                    indeterminate={
                      selectedRows.size > 0 &&
                      selectedRows.size < filteredData.length
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
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onChange={(e) =>
                        handleSelectRow(row.id, e.target.checked)
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
                      {col.render ? col.render(row) : row[col.id]}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionClick(e, row)}
                    >
                      <MoreVertical size={18} color="#64748b" />
                    </IconButton>
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
          <MenuItem onClick={handleEdit} sx={{ py: 1, px: 2 }}>
            <ListItemIcon sx={{ minWidth: "32px !important" }}>
              <Pencil size={16} color="#64748b" />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", fontWeight: 600, color: "#1e293b" },
                },
              }}
            />
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{ py: 1, px: 2, "&:hover": { bgcolor: "#fef2f2" } }}
          >
            <ListItemIcon sx={{ minWidth: "32px !important" }}>
              <Trash2 size={16} color="#ef4444" />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", fontWeight: 600, color: "#ef4444" },
                },
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};
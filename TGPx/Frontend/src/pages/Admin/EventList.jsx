import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Checkbox,
  TextField,
  MenuItem,
  Button

  // InputLabel,
  // FormControl,
  // Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit, Delete } from '@mui/icons-material';
import useEventStore from '../../store/EventStore';
import EventForm from './EventForm';
import ConfirmDialog from '../../components/confirmDialog';
import BaseDialog from '../../components/EditDialog';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

const EventList = () => {
  const {
    events,
    fetchAllEvents,
    deleteEvent,

  } = useEventStore();


  const [selectedMonth, setSelectedMonth] = useState(null); // number or null
  const [selectedYear, setSelectedYear] = useState(null);   // number or null
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = 5;



  const filteredEvents = events.filter((event) => {
    const matchesTitle = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesMonth = selectedMonth !== null
      ? Number(event.month) === selectedMonth
      : true;

    const matchesYear = selectedYear !== null
      ? Number(event.year) === selectedYear
      : true;

    return matchesTitle && matchesMonth && matchesYear;
  });



  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear, searchTerm]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);



  const [selectedEvents, setSelectedEvents] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('single'); // 'single' | 'bulk'
  const [targetId, setTargetId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    description: '',
    month: '',
    year: '',
    imageUrls: [],
    uploadedImageFiles: [],
  });
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleSelect = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map((e) => e._id));
    }
  };

  const handleEdit = (event) => {
    setEditFormData({
      id: event._id,
      title: event.title,
      description: event.description,
      month: event.month,
      year: event.year,
      imageUrls: event.imageUrls || [],
      uploadedImageFiles: [],
    });
    setEditDialogOpen(true);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFormData((prev) => ({
      ...prev,
      uploadedImageFiles: files,
    }));
  };

  const handleUpdate = async () => {
    const { id, title, description, month, year, uploadedImageFiles, imageUrls } = editFormData;

    setIsUpdating(true);
    const result = await useEventStore.getState().updateEvent(id, {
      title,
      description,
      month,
      year,
      images: uploadedImageFiles,
      existingImageUrls: imageUrls,
    });

    if (result?.success !== false) {
      setEditDialogOpen(false);
    }

    setIsUpdating(false);
  };



  const handleDelete = (id) => {
    setTargetId(id);
    setDialogMode('single');
    setConfirmDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    setDialogMode('bulk');
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (dialogMode === 'single' && targetId) {
      await deleteEvent(targetId);
    } else if (dialogMode === 'bulk') {
      await Promise.all(selectedEvents.map((id) => deleteEvent(id)));
      setSelectedEvents([]);
    }

    setConfirmDialogOpen(false);
    setTargetId(null);
  };

  return (
    <div className="event-container" >
      {/* Event Form */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="event table">
          <TableHead>
            {/* Toolbar Row */}
            <TableRow>
              <TableCell
                className=''
                colSpan={7}
                sx={{
                  py: 2,
                  px: 1,
                  borderBottom: 'none',
                }}
              >
                <Box className="event-toolbar">
                  {/* Search */}
                  <Box className="search-box">
                    <TextField
                      size="small"
                      placeholder="Search title"
                      variant="outlined"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Filters and Actions */}
                  <Box className="filter-actions">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleDeleteSelected}
                      startIcon={<DeleteIcon />}
                      className="delete-btn"
                    >
                      Delete
                    </Button>

                    <EventForm />

                    <TextField
                      select
                      label="Month"
                      size="small"
                      variant="outlined"
                      value={selectedMonth ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        setSelectedMonth(value);
                      }}
                      className="month-select"
                    >
                      <MenuItem value="">All</MenuItem>
                      {MONTH_NAMES.map((month, i) => (
                        <MenuItem key={month} value={i + 1}>
                          {month}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Year"
                      size="small"
                      variant="outlined"
                      value={selectedYear ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        setSelectedYear(value);
                      }}
                      className="year-select"
                    >
                      <MenuItem value="">All</MenuItem>
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>


              </TableCell>
            </TableRow>

            {/* Column Header Row */}
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedEvents.length === events.length && events.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>



          <TableBody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => {
                const monthIndex = Number(event.month) - 1;
                const month =
                  monthIndex >= 0 && monthIndex < 12 ? MONTH_NAMES[monthIndex] : 'Invalid';
                const year = event.year || 'N/A';

                return (
                  <TableRow
                    key={event._id}
                    hover
                    selected={selectedEvents.includes(event._id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedEvents.includes(event._id)}
                        onChange={() => handleSelect(event._id)}
                      />
                    </TableCell>
                    <TableCell>
                      {event.imageUrls && event.imageUrls.length > 0 ? (
                        <img
                          src={event.imageUrls[0]}
                          alt={event.title}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 6
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{event.title || 'Untitled'}</TableCell>
                    <TableCell>
                      {event.description
                        ? event.description.length > 250
                          ? `${event.description.slice(0, 250)}...`
                          : event.description
                        : 'No description'}
                    </TableCell>
                    <TableCell>{month}</TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                          <IconButton color="info"
                          >
                         <VisibilityIcon />
                          </IconButton>
                        </Link>
                        <IconButton color="success" onClick={() => handleEdit(event)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(event._id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No events found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>
      <Box className="financial-pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          size="medium"
          shape="rounded"
          className="custom-pagination"
        />
      </Box>



      <ConfirmDialog
        open={confirmDialogOpen}
        title={dialogMode === 'bulk' ? 'Delete Selected Events' : 'Delete Event'}
        content={
          dialogMode === 'bulk'
            ? `Are you sure you want to delete ${selectedEvents.length} selected events?`
            : 'Are you sure you want to delete this event?'
        }
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
      />


      <BaseDialog
        open={editDialogOpen}
        title="Edit Event"
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdate}
        submitLabel="Update"
        isSubmitting={isUpdating}
      >
        <TextField
          fullWidth margin="normal"
          label="Title"
          value={editFormData.title}
          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
        />
        <TextField
          fullWidth multiline rows={4} margin="normal"
          label="Description"
          value={editFormData.description}
          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Month"
          value={editFormData.month}
          onChange={(e) =>
            setEditFormData({ ...editFormData, month: Number(e.target.value) })
          }
        >
          {MONTH_NAMES.map((name, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Year"
          type="number"
          margin="normal"
          fullWidth
          inputProps={{ min: 2021, max: 2030 }}
          value={editFormData.year}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 2021 && val <= 2030) {
              setEditFormData({ ...editFormData, year: val });
            }
          }}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleEditImageChange}
          style={{ marginTop: '1rem' }}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          {editFormData.imageUrls.length > 0 && `Existing: ${editFormData.imageUrls.length} image(s)`}
        </Typography>
      </BaseDialog>



    </div>
  );
};

export default EventList;

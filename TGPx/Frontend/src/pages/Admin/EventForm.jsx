import { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem,
  Box, Button, CircularProgress, TextField, FormControl, InputLabel, Select,
  MenuItem, useMediaQuery, Typography, IconButton, 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import useEventStore from '../../store/EventStore';
import { toast } from 'react-toastify';
import '../../styles/event.scss';

const EventForm = () => {
  const { isLoading, createEvent, resetForm } = useEventStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [title, setLocalTitle] = useState('');
  const [description, setLocalDescription] = useState('');
  const [month, setLocalMonth] = useState('');
  const [year, setLocalYear] = useState('');
  const isMobile = useMediaQuery('(max-width: 650px)');

  const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));

  const clearForm = () => {
    setLocalTitle('');
    setLocalDescription('');
    setLocalMonth('');
    setLocalYear('');
    setImageFiles([]);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createEvent({
      title,
      description,
      month,
      year,
      images: imageFiles,
    });

    if (result.success) {
      toast.success('Event created successfully!');
      clearForm();
      setOpenDialog(false);
    } else {
      toast.error(result.message || 'Failed to create event.');
    }
  };

  return (
    <>
      {/* Compact "+" Icon Button */}
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        className="add-btn"
      >
        Add
      </Button>

      {/* Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          clearForm();
          setOpenDialog(false);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { overflowX: 'hidden' } }}
      >
        <DialogTitle>
          Create Event
          <IconButton
            edge="end"
            onClick={() => {
              clearForm();
              setOpenDialog(false);
            }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box>
            {/* Image preview */}
            <Box sx={{ mb: 2 }}>
              <ImageList sx={{ width: '100%', height: 340 }} cols={isMobile ? 2 : 3} rowHeight={164} gap={8}>
                {imageFiles.length === 0 ? (
                  <ImageListItem>
                    <Typography variant="h6" color="textSecondary">
                      No images selected.
                    </Typography>
                  </ImageListItem>
                ) : (
                  imageFiles.map((file, i) => (
                    <ImageListItem key={i}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${i}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </ImageListItem>
                  ))
                )}
              </ImageList>
            </Box>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
              disabled={isLoading}
            />

            <TextField
              label="Title"
              fullWidth
              margin="normal"
              required
              value={title}
              onChange={(e) => setLocalTitle(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
              value={description}
              onChange={(e) => setLocalDescription(e.target.value)}
              disabled={isLoading}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                onChange={(e) => setLocalMonth(Number(e.target.value))}
                disabled={isLoading}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m, i) => (
                  <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                onChange={(e) => setLocalYear(Number(e.target.value))}
                disabled={isLoading}
              >
                {[2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021].map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { clearForm(); setOpenDialog(false); }} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventForm;

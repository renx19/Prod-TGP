import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, Box, Button, CircularProgress,
  TextField, FormControl, InputLabel, Select, MenuItem, useMediaQuery, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  // Import the close icon
import useEventStore from '../../store/EventStore';
import { toast } from 'react-toastify';
import '../../styles/event.scss';

const EventForm = () => {
  const {
    title, description, isImageUploaded, isUploading, isCreatingEvent,
    setTitle, setDescription, setMonth, setYear, handleImageUpload, handleEventSubmit,
    month, year  // Retrieve the current state of month and year from the store
  } = useEventStore();

  const [imageFiles, setImageFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery('(max-width: 650px)');

  const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));
  
  // Function to clear the form
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setMonth('');
    setYear('');
    setImageFiles([]);  // Clear the selected image files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !description || !month || !year || imageFiles.length === 0) {
      toast.error('Please fill all required fields and upload an image.');
      return;
    }

    await handleEventSubmit(imageFiles);
    toast.success('Event created successfully!');
    setOpenDialog(false); // Close dialog after event is created
    clearForm();  // Clear the form after submission
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    clearForm();  // Clear the form when dialog is closed
    setOpenDialog(false);  // Close the dialog
  };

  return (
    <Box className="event-form">
      {/* Trigger Button to Open Dialog */}
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Create Event
      </Button>

      {/* Dialog for the event form */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Create Event
          {/* Close button added here */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="event-form">
            {/* Image Upload Section */}
            <Box className="image-preview" sx={{ mb: 2 }}>
              <ImageList sx={{ width: '100%', height: '340px' }} cols={isMobile ? 2 : 3} rowHeight={164} gap={8}>
                {imageFiles.length === 0 ? (
                  <ImageListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" color="textSecondary">No images uploaded.</Typography>
                  </ImageListItem>
                ) : (
                  imageFiles.map((file, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded Preview ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))
                )}
              </ImageList>
            </Box>

            <input
              type="file" id="images" accept="image/*" multiple
              onChange={handleImageChange} className="file-input" disabled={isUploading}
            />
            <Button
              variant="contained" onClick={() => handleImageUpload(imageFiles)}
              disabled={!imageFiles.length || isUploading} className="upload-button"
            >
              {isUploading ? <CircularProgress size={24} /> : 'Upload Images'}
            </Button>

            {/* Form Fields */}
            <TextField
              label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)}
              required fullWidth disabled={isUploading || isCreatingEvent} margin="normal"
            />
            <TextField
              label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)}
              required fullWidth multiline rows={4} margin="normal"
              disabled={isUploading || isCreatingEvent}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Event Month</InputLabel>
              <Select
                value={month}  // Bind value to the month state
                onChange={(e) => setMonth(Number(e.target.value))}
                required
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                  .map((monthName, index) => <MenuItem key={index} value={index + 1}>{monthName}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Year</InputLabel>
              <Select
                value={year}  // Bind value to the year state
                onChange={(e) => setYear(Number(e.target.value))}
                required
              >
                {[2027, 2026, 2025, 2024, 2023, 2022].map(yearOption => (
                  <MenuItem key={yearOption} value={yearOption}>{yearOption}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button
            type="submit" variant="contained" onClick={handleSubmit} disabled={isUploading || isCreatingEvent}
          >
            {isCreatingEvent ? <CircularProgress size={24} /> : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventForm;

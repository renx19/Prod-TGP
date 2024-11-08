import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FinancialEventForm from './EventFinancialForm';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useFinancialEventStore from '../../store/testStore';

const FinancialEventTable = () => {
  const { financialEvents, fetchFinancialEvents, deleteFinancialEvent, updateFinancialEvent } = useFinancialEventStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleteInputValid, setIsDeleteInputValid] = useState(true);

  useEffect(() => {
    fetchFinancialEvents();
  }, [fetchFinancialEvents]);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setNewTitle(event.title);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewTitle('');
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteInput('');
    setIsDeleteInputValid(true);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteInput('');
    setIsDeleteInputValid(true);
  };

  const handleDeleteInputChange = (e) => {
    setDeleteInput(e.target.value);
    setIsDeleteInputValid(e.target.value === 'DELETE');
  };

  const handleSave = () => {
    if (selectedEvent) {
      updateFinancialEvent(selectedEvent._id, { title: newTitle });
      handleDialogClose();
    }
  };

  const handleDelete = () => {
    if (deleteInput === 'DELETE' && selectedEvent) {
      deleteFinancialEvent(selectedEvent._id);
      handleDeleteDialogClose();
    }
  };

  return (
    <div className='financial-list-container' style={{padding: "20px"}}>
      <FinancialEventForm />

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Total Expenses</TableCell>
              <TableCell>Total Donations</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.budget}</TableCell>
                <TableCell>{event.totalExpenses}</TableCell>
                <TableCell>{event.totalDonations}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/event/${event._id}`}
                    variant="outlined"
                    color="primary"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteClick(event)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Title Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Event Title</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            variant="outlined"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Type DELETE to Confirm"
            variant="outlined"
            fullWidth
            value={deleteInput}
            onChange={handleDeleteInputChange}
            error={!isDeleteInputValid}
            helperText={!isDeleteInputValid ? 'Please type DELETE to confirm' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" disabled={!isDeleteInputValid}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancialEventTable;

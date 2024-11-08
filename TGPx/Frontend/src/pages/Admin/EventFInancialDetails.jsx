import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import useFinancialEventStore from '../../store/testStore';

const FinancialEventDetailsPage = () => {
  const { eventId } = useParams();
  const {
    updateExpenses, updateDonations, updateDistributions,
    deleteExpense, deleteDonation, deleteDistribution,
    financialEvents, fetchFinancialEvents, selectFinancialEvent, selectedFinancialEvent, 
    insertExpense, insertDonation, insertDistribution
    
  } = useFinancialEventStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [dialogType, setDialogType] = useState(''); // Expense, Donation, or Distribution

  useEffect(() => {
    console.log("Fetching financial events...");
    if (financialEvents.length === 0) {
      fetchFinancialEvents();
    } else {
      const event = financialEvents.find(event => event._id === eventId);
      selectFinancialEvent(event);
      console.log("Event selected:", event);
    }
  }, [eventId, financialEvents, fetchFinancialEvents, selectFinancialEvent]);

  if (!selectedFinancialEvent) {
    console.log("No selected event found.");
    return <Typography>No event selected or not found</Typography>;
  }

  const { title, budget, expenses, donations, distributions, totalDonations, 
    totalExpenses, } = selectedFinancialEvent;

  // Handle open/close dialog
  const handleOpenDialog = (type, item) => {
    console.log(`Opening dialog for ${type}:`, item);
    setDialogType(type);

    // Initialize dialogData with relevant fields for the current type
    setDialogData({
      _id: item._id, // Ensure _id is included
      date: item.date || '',
      particulars: type === 'expense' ? item.particulars : '',
      cost: type === 'expense' ? item.cost : '',
      amount: type === 'donation' ? item.amount : '',
      store: type === 'expense' ? item.store : '',
      quantity: type === 'distribution' ? item.quantity : '',
      location: type === 'distribution' ? item.location : '',
      goodsDistributed: type === 'distribution' ? item.goodsDistributed : '',
      receivedFrom: type === 'donation' ? item.receivedFrom : ''
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog.");
    setOpenDialog(false);
    setDialogData(null);
  };


  const handleSaveChanges = () => {
    console.log("Saving changes for:", dialogType, dialogData);
  
    // Create the updated item based on dialogData
    let updatedItem;
  
    if (dialogType === 'expense') {
      updatedItem = {
        _id: dialogData._id,
        date: dialogData.date,
        particulars: dialogData.particulars,
        cost: dialogData.cost,  // Ensure only one "cost" key
        store: dialogData.store,
      };
    } else if (dialogType === 'donation') {
      updatedItem = {
        _id: dialogData._id,
        date: dialogData.date,
        receivedFrom: dialogData.receivedFrom,
        amount: dialogData.amount,
      };
    } else if (dialogType === 'distribution') {
      updatedItem = {
        _id: dialogData._id,
        date: dialogData.date,
        location: dialogData.location,
        goodsDistributed: dialogData.goodsDistributed,
        quantity: dialogData.quantity,
      };
    }
  

  
    // Define actions for updating respective arrays
    const updateActions = {
      'expense': (item) => {
        const index = expenses.findIndex(expense => expense._id === item._id);
        if (index !== -1) {
          expenses[index] = item; // Update the expense in local state or array
          updateExpenses({ expenses: [item] }); // Wrap expenses in an object if needed
        }
      },
      'donation': (item) => {
        const index = donations.findIndex(donation => donation._id === item._id);
        if (index !== -1) {
          donations[index] = item; // Update the donation in local state or array
          updateDonations({ donations: [item] }); // Wrap donation in an array before updating
        }
      },
      'distribution': (item) => {
        const index = distributions.findIndex(distribution => distribution._id === item._id);
        if (index !== -1) {
          distributions[index] = item; // Update the distribution in local state or array
          updateDistributions({ distributions: [item] }); // Wrap distributions in an object if needed
        }
      },
    };
  
    // Get the action function based on dialogType
    const action = updateActions[dialogType];
  
    if (action) {
      console.log("Updating item:", updatedItem);
  
      // Wrap the updated item inside its respective array for saving
      let wrappedItem;
      if (dialogType === 'expense') {
        wrappedItem = { expenses: [updatedItem] };
      } else if (dialogType === 'donation') {
        wrappedItem = { donations: [updatedItem] }; // Wrap the donation in an array
      } else if (dialogType === 'distribution') {
        wrappedItem = { distributions: [updatedItem] };
      }
  
      // Call the update function for the respective array, passing the wrapped item
      action(updatedItem); // Now we send the wrapped item, ensuring it's correctly formatted
  
    } else {
      console.log(`No action found for dialogType: ${dialogType}`);
    }
  
    handleCloseDialog();
  };
  
  
  
  
  
  
  
  const handleDelete = (type, itemId) => {
    console.log(`Attempting to delete ${type} with ID: ${itemId}`);

    // Use `eventId` from the selected financial event
    const eventId = selectedFinancialEvent?._id;

    if (!eventId) {
      console.log("No financial event ID found.");
      return;
    }

    const deleteActions = {
      'expense': (id) => deleteExpense(id, eventId),
      'donation': (id) => deleteDonation(id, eventId),
      'distribution': (id) => deleteDistribution(id, eventId)
    };

    const deleteAction = deleteActions[type];
    if (deleteAction) {
      deleteAction(itemId); // Pass both itemId and financialEventId
      console.log(`${type} with ID ${itemId} deleted.`);
    } else {
      console.log(`No delete action found for type: ${type}`);
    }
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6">Budget: {budget}</Typography>
      </div>

      {/* Expenses Table */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Expenses</Typography>
      <Typography variant="h5" style={{ marginTop: '20px' }}>Expenses: {totalExpenses}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.store}</TableCell>
                <TableCell>{expense.particulars}</TableCell>
                <TableCell>{expense.cost}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog('expense', expense)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete('expense', expense._id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Donations Table */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Donations</Typography>
      <Typography variant="h5" style={{ marginTop: '20px' }}>Total Donations:  {totalDonations}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Received From</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{donation.receivedFrom}</TableCell>
                <TableCell>{donation.amount}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog('donation', donation)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete('donation', donation._id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Distributions Table */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Distributions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Goods</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributions.map((distribution) => (
              <TableRow key={distribution._id}>
                <TableCell>{distribution.date}</TableCell>
                <TableCell>{distribution.location}</TableCell>
                <TableCell>{distribution.goodsDistributed}</TableCell>
                <TableCell>{distribution.quantity}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog('distribution', distribution)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete('distribution', distribution._id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Editing */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            fullWidth
            value={dialogData?.date || ''}
            onChange={(e) => setDialogData({ ...dialogData, date: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          {dialogType === 'expense' && (
            <>
              <TextField
                label="Store"
                fullWidth
                value={dialogData?.store || ''}
                onChange={(e) => setDialogData({ ...dialogData, store: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Particulars"
                fullWidth
                value={dialogData?.particulars || ''}
                onChange={(e) => setDialogData({ ...dialogData, particulars: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Cost"
                fullWidth
                value={dialogData?.cost || ''}
                onChange={(e) => setDialogData({ ...dialogData, cost: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}
          {dialogType === 'donation' && (
            <>
              <TextField
                label="Received From"
                fullWidth
                value={dialogData?.receivedFrom || ''}
                onChange={(e) => setDialogData({ ...dialogData, receivedFrom: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Amount"
                fullWidth
                value={dialogData?.amount || ''}
                onChange={(e) => setDialogData({ ...dialogData, amount: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}
          {dialogType === 'distribution' && (
            <>
              <TextField
                label="Location"
                fullWidth
                value={dialogData?.location || ''}
                onChange={(e) => setDialogData({ ...dialogData, location: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Goods"
                fullWidth
                value={dialogData?.goodsDistributed || ''}
                onChange={(e) => setDialogData({ ...dialogData, goodsDistributed: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Quantity"
                fullWidth
                value={dialogData?.quantity || ''}
                onChange={(e) => setDialogData({ ...dialogData, quantity: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FinancialEventDetailsPage;

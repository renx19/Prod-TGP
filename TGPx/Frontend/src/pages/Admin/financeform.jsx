import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    TextField,
    Box,
    Typography,
    Grid,
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import { useState } from 'react';
  import useFinancialEventStore from '../../store/testStore';
  import PropTypes from 'prop-types';
  import { toast } from 'react-toastify';
  
  const FinancialEventDialog = ({ open, onClose }) => {
    const { addFinancialEvent } = useFinancialEventStore();
  
    const sanitizeArray = (items, fields) => {
      return items.map((item) => {
        const sanitized = {};
        for (const [key, type] of Object.entries(fields)) {
          const value = item[key];
  
          if (type === 'number') {
            sanitized[key] = value === '' ? null : Number(value);
          } else if (type === 'string') {
            sanitized[key] = (value || '').trim();
          } else if (type === 'date') {
            sanitized[key] = value || null;
          }
        }
        return sanitized;
      });
    };
  
  
    // Local form state
    const [title, setTitle] = useState('');
    const [expenses, setExpenses] = useState([
      { date: '', store: '', particulars: '', cost: 0 },
    ]);
    const [donations, setDonations] = useState([
      { date: '', receivedFrom: '', amount: 0 },
    ]);
    const [distributions, setDistributions] = useState([
      { date: '', location: '', goodsDistributed: '', quantity: 0 },
    ]);
  
    const addItem = (typeSetter, defaultItem) => {
      typeSetter((prev) => [...prev, defaultItem]);
    };
  
    const setField = (typeSetter, index, field, value) => {
      typeSetter((prev) => {
        const updated = [...prev];
        updated[index][field] = value;
        return updated;
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = {
        title: title.trim(),
        expenses: sanitizeArray(expenses, {
          date: 'date',
          store: 'string',
          particulars: 'string',
          cost: 'number',
        }),
        donations: sanitizeArray(donations, {
          date: 'date',
          receivedFrom: 'string',
          amount: 'number',
        }),
        distributions: sanitizeArray(distributions, {
          date: 'date',
          location: 'string',
          goodsDistributed: 'string',
          quantity: 'number',
        }),
      };
  
      try {
        const result = await addFinancialEvent(data);
  
        if (result.success) {
          toast.success('Financial event submitted successfully!');
          resetForm();
          onClose();
        } else {
          toast.error('Submission failed. Please try again.');
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('An unexpected error occurred.');
      }
    };
  
    const resetForm = () => {
      setTitle('');
      setExpenses([{ date: '', store: '', particulars: '', cost: 0 }]);
      setDonations([{ date: '', receivedFrom: '', amount: 0 }]);
      setDistributions([{ date: '', location: '', goodsDistributed: '', quantity: 0 }]);
    };
  
  
    const removeLastItem = (typeSetter) => {
      typeSetter((prev) => prev.slice(0, -1));
  
    };
  
  
  
  
  
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          Create Financial Event
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
  
            <Box mt={3}>
              <Typography variant="h6">Expenses</Typography>
              {expenses.map((expense, i) => (
                <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={expense.date}
                      onChange={(e) =>
                        setField(setExpenses, i, 'date', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Store"
                      fullWidth
                      value={expense.store}
                      onChange={(e) =>
                        setField(setExpenses, i, 'store', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Particulars"
                      fullWidth
                      value={expense.particulars}
                      onChange={(e) =>
                        setField(setExpenses, i, 'particulars', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Cost"
                      type="number"
                      fullWidth
                      value={expense.cost}
                      onChange={(e) =>
                        setField(setExpenses, i, 'cost', e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
  
                  </Grid>
                </Grid>
              ))}
              <Button onClick={() => addItem(setExpenses, { date: '', store: '', particulars: '', cost: 0 })} sx={{ mt: 1 }}>
                Add Expense
              </Button>
              <Button
                sx={{ mt: 1, color: 'red' }}
                onClick={() => removeLastItem(setExpenses)}
                disabled={expenses.length === 1}
              >
                Delete
              </Button>
            </Box>
  
            {/* Repeat similar for Donations */}
            <Box mt={3}>
              <Typography variant="h6">Donations</Typography>
              {donations.map((donation, i) => (
                <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={donation.date}
                      onChange={(e) =>
                        setField(setDonations, i, 'date', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Amount"
                      type="number"
                      fullWidth
                      value={donation.amount}
                      onChange={(e) =>
                        setField(setDonations, i, 'amount', e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
  
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Received From"
                      fullWidth
                      value={donation.receivedFrom}
                      onChange={(e) =>
                        setField(setDonations, i, 'receivedFrom', e.target.value)
                      }
                    />
                  </Grid>
  
                </Grid>
              ))}
              <Button onClick={() => addItem(setDonations, { date: '', receivedFrom: '', amount: 0 })} sx={{ mt: 1 }}>
                Add Donation
              </Button>
              <Button
                sx={{ mt: 1, color: 'red' }}
                onClick={() => removeLastItem(setDonations)}
                disabled={donations.length === 1}
              >
                Delete
              </Button>
            </Box>
  
            {/* Distributions */}
            <Box mt={3}>
              <Typography variant="h6">Distributions</Typography>
              {distributions.map((dist, i) => (
                <Grid container spacing={2} key={i} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={dist.date}
                      onChange={(e) =>
                        setField(setDistributions, i, 'date', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Location"
                      fullWidth
                      value={dist.location}
                      onChange={(e) =>
                        setField(setDistributions, i, 'location', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Goods"
                      fullWidth
                      value={dist.goodsDistributed}
                      onChange={(e) =>
                        setField(setDistributions, i, 'goodsDistributed', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Qty"
                      type="number"
                      fullWidth
                      value={dist.quantity}
                      onChange={(e) =>
                        setField(setDistributions, i, 'quantity', e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
  
                  </Grid>
                </Grid>
              ))}
              <Button onClick={() => addItem(setDistributions, { date: '', location: '', goodsDistributed: '', quantity: 0 })} sx={{ mt: 1 }}>
                Add Distribution
              </Button>
              <Button
                sx={{ mt: 1, color: 'red' }}
                onClick={() => removeLastItem(setDistributions)}
                disabled={distributions.length === 1}
              >
                Delete
              </Button>
            </Box>
  
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    )
};
 
  FinancialEventDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  
  
  export default FinancialEventDialog;
  
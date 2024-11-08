import React, { useState } from 'react';
import useFinancialEventStore from '../../store/testStore';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FinancialEventForm = () => {
  const {
    title,
    expenses,
    donations,
    distributions,
    setTitle,
    setBudget,
    addFinancialEvent,
    addExpense,
    addDonation,
    addDistribution,
    setField,
    budget,
  } = useFinancialEventStore();

  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBudget(budget); // Use the fetched budget
    addFinancialEvent();
    handleCloseDialog();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpenDialog}>
        Create Financial Event
      </Button>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          Create Financial Event
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ paddingBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Budget"
                variant="outlined"
                type="number"
                value={budget} // Use the fetched budget
                InputProps={{
                  readOnly: true,
                }}
                required
              />
            </Box>

            {/* Expenses Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>Expenses</Typography>
              {expenses.map((expense, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      type="date"
                      value={expense.date}
                      onChange={(e) =>
                        setField('expenses', index, 'date', e.target.value)
                      }
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Store"
                      value={expense.store}
                      onChange={(e) =>
                        setField('expenses', index, 'store', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Particulars"
                      value={expense.particulars}
                      onChange={(e) =>
                        setField('expenses', index, 'particulars', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cost"
                      type="number"
                      value={expense.cost}
                      onChange={(e) =>
                        setField('expenses', index, 'cost', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={addExpense} sx={{ mt: 2 }}>
                Add Expense
              </Button>
            </Box>

            {/* Donations Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>Donations</Typography>
              {donations.map((donation, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      type="date"
                      value={donation.date}
                      onChange={(e) =>
                        setField('donations', index, 'date', e.target.value)
                      }
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Received From"
                      value={donation.receivedFrom}
                      onChange={(e) =>
                        setField(
                          'donations',
                          index,
                          'receivedFrom',
                          e.target.value
                        )
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Amount"
                      type="number"
                      value={donation.amount}
                      onChange={(e) =>
                        setField('donations', index, 'amount', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={addDonation} sx={{ mt: 2 }}>
                Add Donation
              </Button>
            </Box>

            {/* Distributions Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>Distributions</Typography>
              {distributions.map((distribution, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      type="date"
                      value={distribution.date}
                      onChange={(e) =>
                        setField('distributions', index, 'date', e.target.value)
                      }
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location"
                      value={distribution.location}
                      onChange={(e) =>
                        setField('distributions', index, 'location', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Goods Distributed"
                      value={distribution.goodsDistributed}
                      onChange={(e) =>
                        setField(
                          'distributions',
                          index,
                          'goodsDistributed',
                          e.target.value
                        )
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={distribution.quantity}
                      onChange={(e) =>
                        setField('distributions', index, 'quantity', e.target.value)
                      }
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={addDistribution} sx={{ mt: 2 }}>
                Add Distribution
              </Button>
            </Box>

            <DialogActions sx={{ paddingBottom: 2 }}>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialEventForm;

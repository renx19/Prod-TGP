import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent, CardHeader, Divider, Stack, Box
} from '@mui/material';
import useFinancialEventStore from '../store/testStore';
import { formatDate } from '../utils/DateConverter';
import Loading from '../utils/loading'

const FinancialEventDetailsPage = () => {
  const { financialId } = useParams();
  const { currentEvent, fetchFinancialEventById } = useFinancialEventStore();

  useEffect(() => {
    if (financialId) {
      fetchFinancialEventById(financialId);
    }
  }, [financialId, fetchFinancialEventById]);

  if (!currentEvent) return <Loading/>;

  const { title, budget, totalDonations, totalExpenses, expenses, donations, distributions } = currentEvent;

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem' }}>
      {/* Header Card */}
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
                {title}
              </Typography>
            </Stack>
          }
          sx={{ backgroundColor: '#242424', borderBottom: '1px solid #ddd', py: 1 }}
        />

        <CardContent sx={{ padding: 3 }}>
          <Stack spacing={2}>
            {[
              { label: 'Total Donations', value: totalDonations },
              { label: 'Expenses', value: totalExpenses },
              { label: 'Budget', value: budget },
            ].map((item, index, arr) => (
              <React.Fragment key={item.label}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1"><strong>{item.label}</strong></Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>
                {index < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Expenses Table */}
      <Typography variant="h6" gutterBottom>Expenses</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#242424' }}>
            <TableRow>
              {['Date', 'Store', 'Particulars', 'Cost'].map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #444',
                    py: 1.5,
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.store}</TableCell>
                <TableCell>{expense.particulars}</TableCell>
                <TableCell>{expense.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Distributions Table */}
      <Typography variant="h6" gutterBottom>Distributions</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#242424' }}>
            <TableRow>
              {['Date', 'Location', 'Goods', 'Quantity'].map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #444',
                    py: 1.5,
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {distributions.map((distribution) => (
              <TableRow key={distribution._id}>
                <TableCell>{formatDate(distribution.date)}</TableCell>
                <TableCell>{distribution.location}</TableCell>
                <TableCell>{distribution.goodsDistributed}</TableCell>
                <TableCell>{distribution.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Donations Table */}
      <Typography variant="h6" gutterBottom>Donations</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#242424' }}>
            <TableRow>
              {['Date', 'Received From', 'Amount'].map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #444',
                    py: 1.5,
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell>{formatDate(donation.date)}</TableCell>
                <TableCell>{donation.receivedFrom}</TableCell>
                <TableCell>{donation.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinancialEventDetailsPage;


import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider
} from '@mui/material';

const financialData = {
  title: "Relief Operation 2025",
  totalDonations: 50000,
  totalExpenses: 30000,
  budget: 20000,
  expenses: [
    { date: "2025-08-01", store: "Grocery Mart", particulars: "Rice", cost: 10000 },
    { date: "2025-08-02", store: "Pharmacy", particulars: "Medicines", cost: 5000 },
  ],
  donations: [
    { date: "2025-07-25", receivedFrom: "John Doe", amount: 20000 },
    { date: "2025-07-28", receivedFrom: "Jane Smith", amount: 30000 },
  ],
  distributions: [
    { date: "2025-08-05", location: "Barangay A", goodsDistributed: "Rice Packs", quantity: 100 },
    { date: "2025-08-06", location: "Barangay B", goodsDistributed: "Medical Kits", quantity: 50 },
  ]
};

const formatCurrency = (amount) => `₱${amount.toLocaleString()}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-PH');

const FinancialEvent = () => {
  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem' }}>
      <Card>
        <CardHeader title={financialData.title} />
        <CardContent>
          <Typography variant="body1">Total Donations: {formatCurrency(financialData.totalDonations)}</Typography>
          <Typography variant="body1">Total Expenses: {formatCurrency(financialData.totalExpenses)}</Typography>
          <Typography variant="body1">Remaining Budget: {formatCurrency(financialData.budget)}</Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Expenses</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialData.expenses.map((exp, idx) => (
              <TableRow key={idx}>
                <TableCell>{formatDate(exp.date)}</TableCell>
                <TableCell>{exp.store}</TableCell>
                <TableCell>{exp.particulars}</TableCell>
                <TableCell>{formatCurrency(exp.cost)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Donations</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Received From</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialData.donations.map((don, idx) => (
              <TableRow key={idx}>
                <TableCell>{formatDate(don.date)}</TableCell>
                <TableCell>{don.receivedFrom}</TableCell>
                <TableCell>{formatCurrency(don.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Distributions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Goods Distributed</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialData.distributions.map((dist, idx) => (
              <TableRow key={idx}>
                <TableCell>{formatDate(dist.date)}</TableCell>
                <TableCell>{dist.location}</TableCell>
                <TableCell>{dist.goodsDistributed}</TableCell>
                <TableCell>{dist.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinancialEvent;

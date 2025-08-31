import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useFinancialEventStore from '../store/testStore';
import "../styles/financial-event.scss"
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Paper, Box, InputAdornment, TextField, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterInput from '../components/filterInput';

const FinancialEventTable = () => {
  const { financialEvents, fetchFinancialEvents, } = useFinancialEventStore();

  //Dialog
  const [open, setOpen] = useState(false);


  //Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetRange, setBudgetRange] = useState("");
  const [donationsRange, setDonationsRange] = useState("");
  const [expensesRange, setExpensesRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);




  const FinancialEventsPerPage = 5;

  const filteredFinancialEvents = financialEvents.filter((financialEvent) => {
    const matchesTitle = searchTerm
      ? financialEvent.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    let eventDate = financialEvent.date ? new Date(financialEvent.date) : null;
    if (!eventDate) {
      const allDates = [
        ...financialEvent.expenses.map(e => new Date(e.date)),
        ...financialEvent.donations.map(d => new Date(d.date)),
        ...financialEvent.distributions.map(dist => new Date(dist.date)),
      ].filter(d => !isNaN(d));
      if (allDates.length) {
        eventDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      }
    }

    const matchesDateRange =
      !eventDate ||
      ((!startDate || eventDate >= new Date(startDate)) &&
        (!endDate || eventDate <= new Date(endDate)));

    const matchesBudgetRange = budgetRange
      ? (() => {
        const [min, max] = budgetRange.split("-").map(Number);
        return max
          ? financialEvent.budget >= min && financialEvent.budget <= max
          : financialEvent.budget >= min; // For "20001+"
      })()
      : true;

    const matchesDonationsRange = donationsRange
      ? (() => {
        const [min, max] = donationsRange.split("-").map(Number);
        return max
          ? financialEvent.totalDonations >= min && financialEvent.totalDonations <= max
          : financialEvent.totalDonations >= min;
      })()
      : true;

    const matchesExpensesRange = expensesRange
      ? (() => {
        const [min, max] = expensesRange.split("-").map(Number);
        return max
          ? financialEvent.totalExpenses >= min && financialEvent.totalExpenses <= max
          : financialEvent.totalExpenses >= min;
      })()
      : true;

    return (
      matchesTitle &&
      matchesDateRange &&
      matchesBudgetRange &&
      matchesDonationsRange &&
      matchesExpensesRange
    );
  });


  const handleApplyFilters = () => {
    setOpen(false); // close the dialog
  };


  //Pagination
  const indexOfLastEvent = currentPage * FinancialEventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - FinancialEventsPerPage;
  const currentFinancialEvents = filteredFinancialEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredFinancialEvents.length / FinancialEventsPerPage);



  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, budgetRange, donationsRange]);



  useEffect(() => {
    fetchFinancialEvents();
  }, [fetchFinancialEvents]);



  return (

    <div className="financial-view-container">
      <TableContainer component={Paper} className="financial-view-table" >
        <Table className="financial-view-table-inner">
          <TableHead className="financial-view-th">
            <TableRow>
              <TableCell className="financial-view-th-cell" colSpan={7}>
                <Box className="financial-view-event-toolbar">
                  {/* Search Box */}
                  <Box className="financial-search-box">
                    <TextField
                      size="small"
                      placeholder="Search title"
                      variant="outlined"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" className="search-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box> 

                  {/* Filters */}
                  <Box className="filter-actions-con">
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={() => setOpen(true)}
                    >
                      Filters
                    </Button>

                    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                      <DialogTitle>Filter Options</DialogTitle>
                      <DialogContent>
                        <Box className="filter-con">
                          <Box className="filter-actions">
                            <FilterInput type="date" label="Start Date" value={startDate} onChange={setStartDate} />
                            <FilterInput type="date" label="End Date" value={endDate} onChange={setEndDate} />
                            <FilterInput type="select" value={budgetRange} onChange={setBudgetRange} options={[{ value: '', label: 'Budget Range' }, { value: '0-5000', label: '0 – 5,000' }, { value: '5001-10000', label: '5,001 – 10,000' }, { value: '10001-20000', label: '10,001 – 20,000' }, { value: '20001', label: '20,001+' }]} />
                            <FilterInput type="select" value={donationsRange} onChange={setDonationsRange} options={[{ value: '', label: 'Donations Range' }, { value: '0-5000', label: '0 – 5,000' }, { value: '5001-10000', label: '5,001 – 10,000' }, { value: '10001-20000', label: '10,001 – 20,000' }, { value: '20001', label: '20,001+' }]} />
                            <FilterInput type="select" value={expensesRange} onChange={setExpensesRange} options={[{ value: '', label: 'Expenses Range' }, { value: '0-5000', label: '0 – 5,000' }, { value: '5001-10000', label: '5,001 – 10,000' }, { value: '10001-20000', label: '10,001 – 20,000' }, { value: '20001', label: '20,001+' }]} />
                          </Box>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleApplyFilters}>
                          Apply
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>

            {/* Table Header */}
            <TableRow>
              <TableCell className="view-col-title">Title</TableCell>
              <TableCell className="view-col-budget">Budget</TableCell>
              <TableCell className="view-col-expenses">Total Expenses</TableCell>
              <TableCell className="view-col-donations">Total Donations</TableCell>
              <TableCell className="view-col-actions">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {currentFinancialEvents.map((financialEvent) => (
              <TableRow
                key={financialEvent._id}
                hover
              >
                <TableCell>{financialEvent.title}</TableCell>
                <TableCell>{financialEvent.budget}</TableCell>
                <TableCell>{financialEvent.totalExpenses}</TableCell>
                <TableCell>{financialEvent.totalDonations}</TableCell>
                <TableCell>
                  <div className="button-group">
                    <Link to={`/financial-List-Details/${financialEvent._id}`} className="no-link-style">
                      <Button variant="contained" color="info" startIcon={<VisibilityIcon />}>
                         Details
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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



    </div>
  );
};

export default FinancialEventTable;

import React, { useEffect } from 'react';
import { Grid2, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
import useEventStore from '../../store/EventStore'; // Import the event store
import EventForm from './EventForm';

const EventList = () => {
  const { events, fetchAllEvents, isFetching } = useEventStore();

  useEffect(() => {
    fetchAllEvents(); // Fetch the events when the component mounts
  }, [fetchAllEvents]);

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="event-container" style={{ padding: '60px' }}>
      {/* Center the EventForm */}
      <Grid2 container justifyContent="center" alignItems="center" sx={{ marginBottom: '40px' }}>
        <Grid2 item xs={12} sm={10} md={8}>
          <EventForm />
        </Grid2>
      </Grid2>

      {/* Grid2 Container for Table and Responsiveness */}
      <Grid2 container justifyContent="center" alignItems="center" sx={{ marginTop: '20px', padding: '0 10px' }}>
        <Grid2 item xs={12} md={10} lg={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="events table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Title</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events && events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell component="th" scope="row">
                        {event.title}
                      </TableCell>
                      <TableCell align="left">{event.description}</TableCell>
                      <TableCell align="left">{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => console.log('View Event', event.id)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: '600',
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="h6" color="textSecondary">
                        No events found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default EventList;

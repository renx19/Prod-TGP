import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMemberStore } from '../../store/memberStore';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  FormControl, InputLabel, Select,
  Box,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';

import "../../styles/members.scss";
import { StatusOptions, GenderOptions, BatchOptions } from '../../utils/Options';
import CreateMemberForm from './MemberForm';


export const AdminMembers = () => {
  const { members, error, fetchMembers, deleteMember } = useMemberStore();
  const [openDelete, setOpenDelete] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMemberId, setMenuMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterBatchName, setFilterBatchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set to show 8 items per page
  const [open, setOpen] = useState(false);


  useEffect(() => {
    fetchMembers(); // Fetch all members on component mount
  }, [fetchMembers]);

  // Error handling
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Loading state
  if (!members || members.length === 0) {
    return <div>Loading members...</div>;
  }

  const handleMenuClick = (event, memberId) => {
    setAnchorEl(event.currentTarget);
    setMenuMemberId(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMemberId(null);
  };

  const handleDeleteOpen = (id) => {
    setMemberToDelete(id);
    setDeleteConfirmation('');
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setMemberToDelete(null);
    setDeleteConfirmation('');
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete);
    }
    handleDeleteClose();
  };

  const handleApplyFilters = () => {
    setOpen(false); // close the dialog
  };


  // Filter members based on search term and selected status
  const matchesFilter = (filterValue, memberValue) => {
    return filterValue === "" || memberValue === filterValue;
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearchTerm = member.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesSearchTerm &&
      matchesFilter(filterType, member.status) &&
      matchesFilter(filterGender, member.gender) &&
      matchesFilter(filterBatchName, member.batchName)
    );
  });

  // Calculate paginated members
  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (

    <div className='admin-member-con' >
         <div className='admin-member-wrapper' >
      <Typography component="div" className="member-toolbar">
        <div className="member-toolbar__controls">
          <TextField
            label="Search Members"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-toolbar__search"
          />
          <Box className="member-toolbar__actions">
            <CreateMemberForm />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setOpen(true)}
              className="member-toolbar__filter-btn"
            >
              Filters
            </Button>
          </Box>

        </div>
      </Typography>
     
     
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs"   >
        <DialogTitle>Filter Options</DialogTitle>
        <DialogContent className='member-filter' >

          {/* Filter By Status */}
          <FormControl sx={{ width: 280 }}>
            <InputLabel>Filter By Status</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter By Status"
            >
              <MenuItem value={""}>All Status</MenuItem>
              {StatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 280 }}>
            <InputLabel>Filter By Gender</InputLabel>
            <Select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              label="Filter By Gender"
            >
              <MenuItem value={""}>All Genders</MenuItem>
              {GenderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 280 }}>
            <InputLabel>Filter By Batch Name</InputLabel>
            <Select
              value={filterBatchName}
              onChange={(e) => setFilterBatchName(e.target.value)}
              label="Filter By Batch Name"
            >
              <MenuItem value={""}>All Batches</MenuItem>
              {BatchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>




      {/* Member Cards Grid */}
      <Grid container spacing={2} >
        {currentMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '20px', height: '320px', backgroundColor: '#242424', color: '#242424' }}>
              {/* Status icon on the top right */}
              <IconButton
                aria-label="more options"
                onClick={(event) => handleMenuClick(event, member._id)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <MoreHorizIcon />
              </IconButton>

              <Typography
                style={{
                  position: 'absolute',
                  top: 15,
                  left: 8,
                  color:
                    member.status === 'Inactive' ? '#f9e79f' : // Pastel Yellow
                      member.status === 'Suspended' ? '#f1948a' : // Pastel Red
                        '#a3e4d7', // Pastel Green
                  textShadow: '2px 3px 4px rgba(-1, 0.2, 0.2, 0.2)',
                }}
                color="text.secondary"
              >
                {member.status || 'N/A'}
              </Typography>

              {/* Profile Image */}
              {member.imageUrl && (
                <CardMedia
                  component="img"
                  alt={member.fullName}
                  height="80"
                  style={{
                    borderRadius: '50%',
                    width: '80px',
                    objectFit: 'cover',
                    marginTop: '30px',

                  }}
                  image={member.imageUrl}
                />
              )}

              {/* Full Name */}
              <Typography variant="h6" component="div" style={{ textAlign: 'center', color: "#fff" }}>
                {member.fullName || 'Unnamed Member'}
              </Typography>

              {/* Member Details */}
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', color: '#fff' }}>
                <Typography color="#fff">{member.phoneNumber || 'N/A'}</Typography>
                <Typography color="#fff">{member.batchName || 'N/A'}</Typography>
              </CardContent>

              {/* View Profile Button */}
              <Link to={`/member/${member._id}`}>
                <Button variant="contained" style={{ marginTop: '10px' }}>
                  View Profile
                </Button>
              </Link>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuMemberId === member._id}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to={`/member/${member._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Edit
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => { handleDeleteOpen(member._id); handleMenuClose(); }}>
                  Delete
                </MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Type DELETE to confirm deletion of this member:</p>
          <TextField
            autoFocus
            margin="dense"
            label=""
            type="text"
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteConfirmation !== 'DELETE'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
    </div>
  );
};

export default AdminMembers;

import  { useEffect, useState } from 'react';
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
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Select from 'react-select';
import "../../styles/members.scss";
import { StatusOptions, GenderOptions, BatchOptions } from '../../utils/Options';

export const AdminMembers = () => {
  const { members, error, fetchMembers, deleteMember } = useMemberStore();
  const [openDelete, setOpenDelete] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMemberId, setMenuMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState([]);
  const [filterGender, setFilterGender] = useState([]);
  const [filterBatchName, setFilterBatchName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set to show 8 items per page

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

  // Filter members based on search term and selected status
  // Filter members based on search term and selected status
// Filter members based on search term and selected status
const filteredMembers = members.filter((member) => {
  const matchesSearchTerm = member.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilterType = filterType.length === 0 || filterType.some(option => member.status === option.value);
  const matchesFilterGender = filterGender.length === 0 || filterGender.some(option => member.gender === option.value);
  const matchesFilterBatchName = filterBatchName.length === 0 || filterBatchName.some(option => member.batchName === option.value); // Adjust this line according to your member schema
  return matchesSearchTerm && matchesFilterType && matchesFilterGender && matchesFilterBatchName;
});




  // Calculate paginated members
  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (
    <div className='admin-member'>
    <Typography component="div" style={{ width: '100%' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        flexDirection: 'row', // Default to row layout
        width: '100%',
      }}
    >
      <TextField
        label="Search Members"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ flex: 1, width: '70%', minWidth: '250px' }} // Takes full width of the parent
        InputProps={{
          sx: {
            height: '48px',
            padding: '0em',
          },
          classes: {
            root: 'custom-input',
          },
        }}
      />

<Select
        isMulti
        options={StatusOptions}
        value={filterType}
        onChange={(selectedOptions) => setFilterType(selectedOptions)}
        styles={{
          control: (provided) => ({
            ...provided,
            height: '48px',
            boxShadow: 'none',
            borderColor: 'lightgray',
            '&:hover': {
              borderColor: 'gray',
            },
            flex: 1,
            width: '100%',
            minWidth: '250px',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0e0e0',
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '0.5em',
          }),
        }}
        placeholder="Filter By Status"
      />

      {/* Gender Filter */}
      <Select
        isMulti
        options={GenderOptions}
        value={filterGender}
        onChange={(selectedOptions) => setFilterGender(selectedOptions)}
        styles={{
          control: (provided) => ({
            ...provided,
            height: '48px',
            boxShadow: 'none',
            borderColor: 'lightgray',
            '&:hover': {
              borderColor: 'gray',
            },
            flex: 1,
            width: '100%',
            minWidth: '250px',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0e0e0',
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '0.5em',
          }),
        }}
        placeholder="Filter By Gender"
      />

      {/* Batch Name Filter */}
      <Select
        isMulti
        options={BatchOptions}
        value={filterBatchName}
        onChange={(selectedOptions) => setFilterBatchName(selectedOptions)}
        styles={{
          control: (provided) => ({
            ...provided,
            height: '48px',
            boxShadow: 'none',
            borderColor: 'lightgray',
            '&:hover': {
              borderColor: 'gray',
            },
            flex: 1,
            width: '100%',
            minWidth: '250px',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0e0e0',
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '0.5em',
          }),
        }}
        placeholder="Filter By Batch Name"
      />

    </div>
  </Typography>



      {/* Member Cards Grid */}
      <Grid container spacing={2}>
        {currentMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '20px', height: '320px', backgroundColor: '#FEFEFE', color: '#242424'}}>
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
              <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>
                {member.fullName || 'Unnamed Member'}
              </Typography>

              {/* Member Details */}
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', color: '#242424'}}>
                <Typography color="#242424">{member.phoneNumber || 'N/A'}</Typography>
                <Typography color="#242424">{member.batchName || 'N/A'}</Typography>
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
  );
};

export default AdminMembers;

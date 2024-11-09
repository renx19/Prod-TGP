import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMemberStore } from '../store/memberStore';
import '../styles/members.scss';
import { Person, Home, Phone, CalendarToday, School, AccountCircle, FormatListNumbered,  Male, MilitaryTech, Foundation, SportsEsports, SportsMartialArts, Rowing, ContactEmergency} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import Select from '@mui/material/Select';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit'
import MenuItem from '@mui/material/MenuItem';
import { BatchOptions } from '../utils/Options';


const MemberDetails = () => {
  const { user, role} = useAuthStore();
  const { id } = useParams();
  const { formData, error, fetchMemberDetails, fetchMyMemberDetails, updateMember, uploadImage  } = useMemberStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Track if an image has been uploaded
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Role-based access control
    if (user) {
      // Check if the user role is "member"
      if (user.role === 'member') {
        // If the user is a member, fetch their own member details
        fetchMyMemberDetails(user._id)
      } else if (id) {
        // If the user is not a member, allow fetching based on the provided ID
        fetchMemberDetails(id);
      } else {
        console.error('No valid ID provided for fetching member details.');
      }
    } else if (id) {
      // If there's an ID and no user, you may handle it as needed
      fetchMemberDetails(id);
    }
  }, [id, user, fetchMemberDetails]);
  
  useEffect(() => {
    if (formData) {
      setEditData(formData);
    }
  }, [formData]);
  

  const handleSave = async () => {
    try {
      await updateMember(formData._id, editData); 
      toast.success('Member updated successfully!');

      // Option 1: Refetch data after updating
      fetchMemberDetails(formData._id);

      // Option 2: Update local state directly
      setEditData(editData); // This line ensures the editData reflects changes immediately
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member. Please try again.');
    }
  };



  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    // For date input types
    if (type === 'date') {
      setEditData((prevState) => ({
        ...prevState,
        [name]: value, // Directly store the selected date value in the state
      }));
    } 
    // For Select input types
    else if (type === 'select-one' || e.target.tagName === 'SELECT') {
      setEditData((prevState) => ({
        ...prevState,
        [name]: value, // Use name to update the value for select
      }));
    } 
    // For other types of input fields
    else {
      setEditData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, imageUrl: reader.result, imageFile: file }); // Save both the file and preview URL
        setIsImageUploaded(false); // Reset upload status when a new image is selected
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadImage = async () => {
    if (editData.imageFile) {
      setLoading(true); // Start the loading indicator
      setIsImageUploaded(false); // Reset the image upload state
      try {
        const imageUrl = await uploadImage(editData.imageFile); // Upload the image and get the URL
        setEditData({ ...editData, imageUrl }); // Store the uploaded image URL in editData
        setIsImageUploaded(true); // Mark the image as uploaded successfully
        toast.success('Image uploaded successfully!'); // Show success notification
      } catch (err) {
        console.error('Error uploading image:', err); // Log the error
        toast.error('Failed to upload image. Please try again.'); // Show error notification
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    } else {
      toast.warning('Please select an image first!'); // Warn the user if no image is selected
    }
  };



  const handleCancel = () => {
    setEditData(formData);
    setIsEditing(false);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!formData || Object.keys(formData).length === 0) {
    return <div>Loading member details...</div>;
  }

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A';
  };

  const formatDateForInput = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Member Profile</h1>

      <div className="profile-content">
        <div className="user-info-card card">
        <div className="member-image-container">
                {isEditing ? (
                  <>
                    {editData.imageUrl && (
                      <div className="profile-image-wrapper">
                        <img
                          src={editData.imageUrl}
                          alt={`${editData.fullName || 'Profile'}'s Profile`}
                          className="profile-image"
                        />
                        <label htmlFor="file-upload" className="upload-icon-label">
                          <EditIcon className="upload-icon" />
                        </label>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input"
                          id="file-upload" // Assign an id to target it later
                          style={{ display: 'none' }} // Hide the file input
                        />
                       <button
                        className="upload-button"
                        onClick={handleUploadImage}
                        disabled={loading || isImageUploaded} // Disable if loading or image already uploaded
                      >
                        {loading ? 'Uploading...' : 'Upload'}
                      </button>
                      </div>
                    )}
                  </>
                ) : (
                  formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt={`${formData.fullName}'s Profile`}
                      className="profile-image"
                    />
                  )
                )}
              </div>



              <div className="user-info">

               <div className="info-row">
                <div className="info-wrapper">
                  <div className="info-icon-wrapper">
                    <AccountCircle className="info-icon"/>
                  </div>
                  <div className="info-label-wrapper">
                    <label className="info-label">Username:</label>
                  </div>
                </div>
                <div className="info-data-wrapper">
                  {isEditing ? (
                    <TextField
                      value={editData.user.username || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      className="user-details-input"
                      sx={{ width: '100%', margin: '10px 0' }}
                    />
                  ) : (
                    <p className="info-data">{formData.user.username ||user.username}</p>
                  )}
                </div>
              </div>

              <div className="info-row">
                <div className="info-wrapper">
                  <div className="info-icon-wrapper">
                    <EmailIcon className="info-icon" />
                  </div>
                  <div className="info-label-wrapper">
                    <label className="info-label">Email:</label>
                  </div>
                </div>
                <div className="info-data-wrapper">
                  {isEditing ? (
                    <TextField
                      value={editData.user.email || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      className="user-details-input"
                      sx={{ width: '100%', margin: '10px 0' }}
                    />
                  ) : (
                    <p className="info-data">{formData.user.email || user.email}</p>
                  )}
                </div>
              </div>

              <div className="info-row">
                <div className="info-wrapper">
                  <div className="info-icon-wrapper">
                    <FormatListNumbered className="info-icon" />
                  </div>
                  <div className="info-label-wrapper">
                    <label className="info-label">Member #:</label>
                  </div>
                </div>
                <div className="info-data-wrapper">
                  <p className="info-data">{formData.memberNumber}</p>
                </div>
              </div>




            <div className="button-container">
              <button className="profile-button" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button className="profile-button" onClick={handleSave}>Save</button>
              )}
            </div>
          </div>

        </div>

        <div className="personal-info-card card">
          <h3>Personal Details</h3>
           <div className="personal-info-container">
            <div className="detail-row">
              <Person />
              <strong>Full Name:</strong>
              {isEditing ? (
                <TextField
                  name="fullName"
                  value={editData.fullName || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.fullName || 'N/A'}</span>
              )}
            </div>
            <div className="detail-row">
              <Home />
              <strong>Address:</strong>
              {isEditing ? (
                <TextField
                  name="address"
                  value={editData.address || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.address || 'N/A'}</span>
              )}
            </div>
            <div className="detail-row">
              <Phone />
              <strong>Phone Number:</strong>
              {isEditing ? (
                <TextField
                  name="phoneNumber"
                  value={editData.phoneNumber || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.phoneNumber || 'N/A'}</span>
              )}
            </div>
           

            <div className="detail-row">
             <CalendarToday />
            <strong>Birthday:</strong>
            {isEditing ? (
              <TextField
                type="date"
                name="birthday"
                value={formatDateForInput(editData.birthday || '')} // Use editData for input
                onChange={handleInputChange}
                className="birthday-input" // Optional: for additional styling
                variant="outlined"
                fullWidth
                sx={{width: '50%'}}
              />
            ) : (
              <span>{formatDate(formData.birthday) || 'N/A'}</span> // Use formatDate for display
            )}
          </div>
          
          <div className="detail-row">
            <Male/>
            <strong>Gender:</strong>
            {isEditing ? (
              <Select
                name="gender"
                value={editData.gender || ''} // Ensure this binds correctly to your state
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                sx={{ width: '50%', margin: '10px 0', lineHeight: '0.6em' }}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Non-Binary">Non-Binary</MenuItem>
              </Select>
            ) : (
              <span>{formData.gender || 'N/A'}</span>
            )}
          </div>


       </div>
          <h4>Additional Information</h4>

          <div className="other-details-container">

          <div className="detail-row">
            <MilitaryTech/>
            <strong>Status:</strong>
            {isEditing ? (
              <Select
                name="status"
                value={editData.status || ''} // Ensure this binds correctly to your state
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                sx={{ width: '50%', margin: '10px 0', lineHeight: '0.6em' }}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            ) : (
              <span>{formData.status || 'N/A'}</span>
            )}
          </div>



          <div className="detail-row">
      <School />
      <strong>Batch Name:</strong>
      {isEditing ? (
        <Select
          name="batchName"
          value={editData.batchName || ''}
          onChange={handleInputChange}
          sx={{ width: '50%', margin: '10px 0', lineHeight: '0.6em' }}
        >
          <MenuItem value="">
            <em>Select Batch</em>
          </MenuItem>
          {BatchOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <span>{formData.batchName || 'N/A'}</span>
      )}
    </div>

            <div className="detail-row">
              <CalendarToday />
              <strong>Date of IR:</strong>
              {isEditing ? (
                <TextField
                  type="date"
                  name="dateOfIR"
                   value={formatDateForInput(editData.dateOfIR || '')}
                  onChange={handleInputChange}
                  className="date-of-ir-input" // Optional: for additional styling
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formatDate(formData.dateOfIR)}</span>
              )}
            </div>



            <div className="detail-row">
              <Foundation />
              <strong>Sponsor Name:</strong>
              {isEditing ? (
                <TextField
                  name="sponsorName"
                  value={editData.sponsorName || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.sponsorName || 'N/A'}</span>
              )}
            </div>

            <div className="detail-row">
              <SportsMartialArts />
              <strong>GT:</strong>
              {isEditing ? (
                <TextField
                  name="gt"
                  value={editData.gt || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.gt || 'N/A'}</span>
              )}
            </div>
            <div className="detail-row">
              <Rowing />
              <strong>MWw:</strong>
              {isEditing ? (
                <TextField
                  name="mww"
                  value={editData.mww || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.mww || 'N/A'}</span>
              )}
            </div>

            
            <div className="detail-row">
              <ContactEmergency />
              <strong>Alexis Name:</strong>
              {isEditing ? (
                <TextField
                  name="alexisName"
                  value={editData.alexisName || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{width: '50%'}}
                />
              ) : (
                <span>{formData.alexisName || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;

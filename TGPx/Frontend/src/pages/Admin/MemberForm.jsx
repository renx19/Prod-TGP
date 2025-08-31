import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField'; // Import MUI TextField
import useMemberStore from '../../store/memberStore';
import { toast } from 'react-toastify'; // Import toast
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import '../../styles/members.scss'; // Import the SCSS file
import { StatusOptions, BatchOptions, GenderOptions } from '../../utils/Options';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControl, Select, MenuItem
} from '@mui/material';


const CreateMemberForm = () => {
  const {
    formData,
    setFormData,
    createMember,
    uploadImage,
    fetchAvailableUsers,
    availableUsers,
    error,
  } = useMemberStore();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAvailableUsers(); // Fetch available users on component mount
  }, [fetchAvailableUsers]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      await createMember(); // Create member
      toast.success('Member created successfully!'); // Notify user on success

      // Reset the form data and image upload state after successful creation
      resetForm();
    } catch (err) {
      console.error('Error creating member:', err); // Additional logging
      toast.error('Error creating member. Please try again.'); // Notify user on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const resetForm = () => {
    setFormData({
      user: '',
      status: '',
      fullName: '',
      address: '',
      dateOfIR: '',
      birthday: '',
      phoneNumber: '',
      batchName: '',
      sponsorName: '',
      gt: '',
      mww: '',
      almaMater: '',
      alexisName: '',
      gender: '',
      image: null, // Reset image input
    });
    setImagePreview(null); // Reset image preview
    setIsImageUploaded(false); // Reset image upload state
  };
  const handleUserChange = (value) => {
    setFormData({ ...formData, user: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, image: file });

    // Create a preview URL for the selected image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUploadImage = async () => {
    if (formData.image) {
      setLoading(true); // Set loading state to true immediately
      setIsImageUploaded(false); // Reset image uploaded state
      try {
        const imageUrl = await uploadImage(formData.image); // Upload image and get URL
        setFormData({ ...formData, imageUrl }); // Store the image URL in form data
        setIsImageUploaded(true); // Set image upload status to true
        toast.success('Image uploaded successfully!'); // Notify user on success
      } catch (err) {
        console.error('Error uploading image:', err); // Additional logging
        toast.error('Failed to upload image. Please try again.'); // Notify user on error
      } finally {
        setLoading(false); // Reset loading state after upload attempt
      }
    } else {
      toast.warning('Please select an image first!'); // Notify user to select an image
    }
  };



  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDialog(true);
        }}
        title="Add Member"
        className="memberform-toolbar__add-btn"
        startIcon={<AddIcon />}
      >Add
      </Button>


      <Dialog
        open={openDialog}
        onClose={() => {
          resetForm();
          setOpenDialog(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Create Member
          <IconButton
            edge="end"
            onClick={() => {
              resetForm();
              setOpenDialog(false);
            }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <form className="create-member-form" onSubmit={handleSubmit}>
            <div className="cm-title">
              {error && <div className="error">{error}</div>} {/* Display error if any */}
            </div>

            <div className="cm-container">
              <div className="image-section">
                <div className="member-image-container">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="preview-image" />
                  ) : (
                    <div className="placeholder" />
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="input-file"
                  />
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={loading || isImageUploaded} // Disable if loading or if the image is already uploaded
                    className="upload-button"
                  >
                    {loading ? 'Uploading...' : isImageUploaded ? 'Image Uploaded' : 'Upload Image'}
                  </button>
                </div>
              </div>

              <div className="input-section">
                <div className="input-grid">

                  <FormControl fullWidth sx={{ my: 1 }}>
                    <Select
                      displayEmpty
                      name="user"
                      value={formData.user || ""}
                      onChange={(e) => handleUserChange(e.target.value)}
                      required
                      sx={{ height: 52 }}
                    >
                      <MenuItem value="">Select an Available User</MenuItem>
                      {availableUsers.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Status */}
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <Select
                      displayEmpty
                      name="status"
                      value={formData.status || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ height: 52 }}
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      {StatusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Batch */}
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <Select
                      displayEmpty
                      name="batchName"
                      value={formData.batchName || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ height: 52 }}
                    >
                      <MenuItem value="">Select Batch</MenuItem>
                      {BatchOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Gender */}
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <Select
                      displayEmpty
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ height: 52 }}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      {GenderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                  {renderTextField('fullName', 'Full Name', true)}
                  {renderTextField('address', 'Address')}
                  {renderTextField('dateOfIR', '', false, 'date')}
                  {renderTextField('birthday', '', false, 'date')}
                  {renderTextField('phoneNumber', 'Phone Number')}
                  {renderTextField('sponsorName', 'Sponsor Name')}
                  {renderTextField('alexisName', ' Alexis Name')}
                  {renderTextField('gt', 'GT')}
                  {renderTextField('mww', 'MWW')}
                  {renderTextField('almaMater', 'Alma Mater')}
                </div>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" disabled={loading} className="button">
                {loading ? 'Creating...' : 'Create Member'}
              </button>

            </div>
            <DialogActions>

            </DialogActions>
          </form>
        </DialogContent>
      </Dialog >
    </>
  );

  function renderTextField(name, label, required = false, type = 'text') {
    return (
      <TextField
        variant="outlined"
        fullWidth
        margin="normal"
        type={type}
        name={name}
        label={label}
        value={formData[name] || ''}
        onChange={handleInputChange}
        required={required}
        className="input-file"
        InputProps={{
          sx: {
            height: '52px', // Set the height of the input
            padding: '0.5em', // Adjust padding as needed
            width: '100%',
            zIndex: '0',
            // You can add more styles here if needed
          },
          // If you want to adjust styles of the root input element further
          classes: {
            root: 'custom-input', // Add a custom class if needed
          },
        }}
      />
    );
  }
};

export default CreateMemberForm;

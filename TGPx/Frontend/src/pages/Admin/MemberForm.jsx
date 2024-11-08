import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Import react-select
import TextField from '@mui/material/TextField'; // Import MUI TextField
import useMemberStore from '../../store/memberStore';
import { toast } from 'react-toastify'; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/members.scss'; // Import the SCSS file
import { StatusOptions, BatchOptions, GenderOptions } from '../../utils/Options';

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
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isMemberCreated, setIsMemberCreated] = useState(false); // State to track member creation

  useEffect(() => {
    fetchAvailableUsers(); // Fetch available users on component mount
  }, [fetchAvailableUsers]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      await createMember(); // Create member
      toast.success('Member created successfully!'); // Notify user on success
      setIsMemberCreated(true); // Set member created state to true

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
    setIsMemberCreated(false); // Reset member created state for the next submission
  };

  const handleUserChange = (selectedOption) => {
    setFormData({ ...formData, user: selectedOption.value });
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

  const handleNext = () => {
    navigate('/success'); // Navigate to the success component or page
  };

  return (
    <form className="create-member-form" onSubmit={handleSubmit}>
      <div className="cm-title">
        {error && <div className="error">{error}</div>} {/* Display error if any */}
      </div>

      <div className="cm-container">
        <div className="image-section">
          <div className="image-container">
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
        
          <Select
            options={availableUsers.map((user) => ({
              value: user._id,
              label: user.username,
            }))} // Use username for display
            onChange={handleUserChange}
            placeholder="Select an Available User"
            required
            styles={{
              control: (provided) => ({
                ...provided,
                height: '52px', // Adjust height as needed
                margin: '0.5em 0 ',
              }),
            }}
          />
            <Select
              options={[{ value: '', label: 'Select Status' }, ...StatusOptions]} // Using StatusOptions
              name="status"
              onChange={(selectedOption) =>
                handleInputChange({ target: { name: 'status', value: selectedOption.value } }) // For single select
              }
              placeholder="Select Status"
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: '52px', // Adjust height as needed
                  margin: '0.5em 0 ',
                  padding: '0.5em', // Add padding to control
                }),
              }}
            />

            {/* Batch Select */}
            <Select
              options={[{ value: '', label: 'Select Batch' }, ...BatchOptions]} // Using BatchOptions
              name="batchName"
              onChange={(selectedOption) =>
                handleInputChange({ target: { name: 'batchName', value: selectedOption.value } })
              }
              placeholder="Select Batch"
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: '52px', // Adjust height as needed
                  margin: '0.5em 0 ',
                }),
              }}
            />

            {/* Gender Select */}
            <Select
              options={[{ value: '', label: 'Select Gender' }, ...GenderOptions]} // Using GenderOptions
              name="gender"
              onChange={(selectedOption) =>
                handleInputChange({ target: { name: 'gender', value: selectedOption.value } })
              }
              placeholder="Select Gender"
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: '52px', // Adjust height as needed
                  margin: '0.5em 0 ',
                  padding: '0.5em', // Add padding to control
                }),
              }}
/>


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
        <button
          type="button"
          onClick={handleNext}
          disabled={!isMemberCreated} // Enable only if the member has been successfully created
          className="button next-button" // Added next-button class for styling
        >
          Next
        </button>
      </div>
    </form>
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

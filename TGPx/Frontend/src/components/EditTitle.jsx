import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import useFinancialStore from '../store/testStore'; // Adjust path as needed

const EditTitleDialog = ({ open, onClose, financialId, currentTitle }) => {
  const [input, setInput] = useState(currentTitle || '');
  const { setTitle, updateFinancialEvent } = useFinancialStore();

  // Update input field when currentTitle changes (e.g. when opening dialog again)
  useEffect(() => {
    if (open) {
      setInput(currentTitle || '');
    }
  }, [currentTitle, open]);

  const handleSave = async () => {
    setTitle(input); // Zustand store update
    await updateFinancialEvent(financialId, { title: input }); // API update
    onClose(); // Close dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Financial Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!input.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ✅ Prop types for clarity and validation
EditTitleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  financialId: PropTypes.string.isRequired,
  currentTitle: PropTypes.string,
};

// ✅ Default prop value
EditTitleDialog.defaultProps = {
  currentTitle: '',
};

export default EditTitleDialog;

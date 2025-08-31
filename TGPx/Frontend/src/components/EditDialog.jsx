// components/common/BaseDialog.js
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/custom-mui.scss'; // Import SCSS file

const BaseDialog = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel,
  cancelLabel,
  isSubmitting,
  showCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        className: 'base-dialog-paper', // custom class
      }}
    >
      <DialogTitle className="base-dialog-title">
        {title}
        <IconButton
          edge="end"
          onClick={onClose}
          className="base-dialog-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="base-dialog-content">
        {children}
      </DialogContent>

      <DialogActions className="base-dialog-actions">
        {showCancel && (
          <Button
            onClick={onClose}
            color="secondary"
            disabled={isSubmitting}
            className="base-dialog-cancel"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmitting}
          className="base-dialog-submit"
        >
          {isSubmitting ? <CircularProgress size={24} /> : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BaseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  isSubmitting: PropTypes.bool,
  showCancel: PropTypes.bool,
};

export default BaseDialog;

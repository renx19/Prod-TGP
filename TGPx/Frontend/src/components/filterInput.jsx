import PropTypes from 'prop-types';
import { TextField, FormControl, Select, MenuItem } from '@mui/material';
import '../styles/custom-mui.scss'; // import SCSS

const FilterInput = ({
  type = 'text', // "date", "select", or "text"
  label,
  value,
  onChange,
  options = [], // For select type: [{ value, label }]
  width = 180,
  ...rest
}) => {
  if (type === 'select') {
    return (
      <FormControl
        className="filter-input"
        style={{ width }} // keep width flexible via prop
      >
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          {...rest}
        >
          {options.map((opt, idx) => (
            <MenuItem key={idx} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      type={type}
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      InputLabelProps={{
        shrink: type === 'date' || rest.InputLabelProps?.shrink,
      }}
      className="filter-input"
      style={{ width }}
      {...rest}
    />
  );
};

FilterInput.propTypes = {
  type: PropTypes.oneOf(['text', 'date', 'select']),
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  width: PropTypes.number,
};

export default FilterInput;

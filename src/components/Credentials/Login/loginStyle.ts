
export const containerStyles = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const paperStyles = {
  padding: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: 2,
};

export const titleStyles = {
  mb: 1,
  fontWeight: 600,
  color: '#7D1C48',
};

export const subtitleStyles = {
  mb: 3,
};

export const formStyles = {
  width: '100%',
};

export const textFieldStyles = {
  '& label.Mui-focused': {
    color: '#7D1C48',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#7D1C48',
    },
  },
};

export const buttonStyles = {
  mt: 3,
  mb: 2,
  py: 1.5,
  color: '#fff',
  backgroundColor: '#7D1C48',
  '&:hover': {
    backgroundColor: '#5c1335',
  },
};

export const linkStyles = {
  cursor: 'pointer',
  fontWeight: 600,
  color: '#7D1C48',
};
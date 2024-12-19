import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#2b2b2b',
          color: 'rgba(255, 255, 255, 0.87)',
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#3a3a3a',
          },
        },
        columnHeaders: {
          backgroundColor: '#2b2b2b', // Fondo de los encabezados
          color: 'rgba(255, 255, 255, 1)', // Texto blanco en encabezados
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Línea inferior
        },
      },
    },
  },
});

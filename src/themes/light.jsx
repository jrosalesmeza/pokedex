import { createTheme } from '@mui/material/styles';


export const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#ffffff',
      },
      text: {
        primary: '#213547',
      },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff', // Fondo del DataGrid
            color: '#213547', // Color del texto
            '& .MuiDataGrid-cell': {
              borderColor: '#e0e0e0', // Bordes entre celdas
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#f9f9f9', // Filas alternas
            },
          },
        },
      },
    },
  });
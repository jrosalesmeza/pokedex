
import { useState, useEffect } from 'react';
import { useMediaQuery, CssBaseline, } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './themes/dark';
import { lightTheme } from './themes/light';
import { PokedexPage } from './pages/Pokedex';
import { PokemonPage } from './pages/Pokemon';



function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
 

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/pokemons/" element={<PokedexPage></PokedexPage>}/>
          <Route path="/" element={<PokemonPage></PokemonPage>}/>
        </Routes>
      </Router>

    </ThemeProvider>

  )
}

export default App


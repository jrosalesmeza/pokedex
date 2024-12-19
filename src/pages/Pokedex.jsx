
import { Typography } from '@mui/material';
import { PokemonSearch } from '../components/PokemonSearch';


const pokemons = [];
  for (let i = 1; i <= 50; i++) {
    pokemons.push({
      name: `Pokemon ${i}`,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`,
      type: 'Normal',
      stats: [
        { name: 'Hp', value: 100 },
        { name: 'Attack', value: 50 },
        { name: 'Defense', value: 30 },
      ],
    });
  }

export const PokedexPage = () => {
    return (
        <>
            <Typography variant="h1" align="center" sx={{ mt: 2 }}>
                Pokédex
            </Typography>
            <PokemonSearch language={'es'} />
        </>
    )
}
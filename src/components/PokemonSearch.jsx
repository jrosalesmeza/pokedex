import { useState, useEffect, useCallback } from 'react';
import { Container, TextField } from '@mui/material';
import { Grid2 } from '@mui/material';
import PropTypes from 'prop-types';
import { PokemonCard } from './PokemonCard';
import { getStatTranslation } from '../utils/translations.js';
import {transalation} from '../logic/transalation.js';
import _ from 'lodash';

const LIMIT = 9;

const getPokemonsBatch = async (offset, limit = LIMIT) => {
  const baseUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data.results;
};

const getPokemonDetails = async (pokemon, language) => {
  const response = await fetch(pokemon.url);
  const data = await response.json();
  const translatedTypes = await transalation(data.types.map((t) => t.type.name), "type", language);

  return {
    name: _.startCase(_.toLower(data.name)),
    image: data.sprites.other['official-artwork'].front_default,
    type: translatedTypes.join(', '),
    stats: data.stats.map((s) => ({
      name: getStatTranslation(s.stat.name, language),
      value: s.base_stat,
    })),
  };
};

export const PokemonSearch = ({language}) => {
  const [search, setSearch] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Controla si hay más Pokémon para cargar

  const loadPokemons = useCallback(async () => {
    if (!hasMore || loading) return; // Evita cargar si ya se tienen todos o si está en proceso
    setLoading(true);
    setError(null);

    try {
      const newBatch = await getPokemonsBatch(offset);
      if (newBatch.length === 0) {
        setHasMore(false);
        return;
      }

      const newPokemons = await Promise.all(
        newBatch.map((pokemon) => getPokemonDetails(pokemon, language))
      );

      setPokemons((prev) => [...prev, ...newPokemons]);
      setOffset((prev) => prev + LIMIT); // Incrementa el offset
    } catch (err) {
      setError('Error fetching Pokémon data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, language]);


  useEffect(() => {
    const filterPokemons = () => {
      if (search === '') {
        setFilteredPokemons(pokemons.slice(0, LIMIT));
        return;
      }
      const filtered = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredPokemons(filtered);

      console.log('filtered', filtered, hasMore)

      if (filtered.length === 0 && search && hasMore) {
        // Si no encuentra resultados en los Pokémon cargados, intenta cargar más
        loadPokemons();
      }
    };

    filterPokemons();
  }, [search, pokemons, loadPokemons, hasMore]);

  useEffect(() => {
    setSearch('');
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <TextField
        label="Buscar Pokémon"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
      />
      <Grid2 container spacing={2} justifyContent="center">
        {filteredPokemons.map((pokemon) => (
          <Grid2 item key={pokemon.name}>
            <PokemonCard
              name={pokemon.name}
              image={pokemon.image}
              type={pokemon.type}
              stats={pokemon.stats}
            />
          </Grid2>
        ))}
      </Grid2>
      {loading && <div>Cargando más Pokémon...</div>}
    </Container>
  );
};

PokemonSearch.propTypes = {
  language: PropTypes.string.isRequired,
};

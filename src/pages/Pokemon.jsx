
import { usePokemonFetcher } from '../hooks/usePokemonFetcher.js';



export const PokemonPage = () => {

    const pokemonData = usePokemonFetcher({pokemonName: 'pikachu', language:'es'});
    
    console.log(pokemonData);
    return (
        <div>
            <h1>Pokemon</h1>
        </div>
    )
}
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { transalation } from "../logic/transalation.js";

export const usePokemonFetcher = ({ pokemonName, language = "en" }) => {
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(true);  // Estado para manejar la carga
    const [error, setError] = useState(null);  // Estado para manejar errores

    useEffect(() => {
        if (!pokemonName) return;

        async function fetchData() {
            setLoading(true);
            setError(null);

            const baseUrl = "https://pokeapi.co/api/v2";

            try {
                // 1. Datos principales del Pokémon
                const pokemonResponse = await fetch(`${baseUrl}/pokemon/${pokemonName}`);
                if (!pokemonResponse.ok) {
                    throw new Error("Failed to fetch Pokémon data");
                }
                const pokemon = await pokemonResponse.json();

                const name = pokemon.name;
                const height = pokemon.height;
                const weight = pokemon.weight;
                const types = pokemon.types.map((t) => ({
                    name: t.type.name,
                    url: t.type.url,
                }));
                const abilities = pokemon.abilities.map((a) => a.ability.name);
                const image = pokemon.sprites.other["official-artwork"].front_default;

                const speciesResponse = await fetch(pokemon.species.url);
                if (!speciesResponse.ok) {
                    throw new Error("Failed to fetch species data");
                }
                const species = await speciesResponse.json();

                // 2. Datos de la especie
                const category =
                    species.genera.find((g) => g.language.name === language)?.genus ||
                    species.genera.find((g) => g.language.name === "en")?.genus ||
                    "Unknown";

                const description =
                    species.flavor_text_entries.find(
                        (entry) => entry.language.name === language
                    )?.flavor_text ||
                    species.flavor_text_entries.find(
                        (entry) => entry.language.name === "en"
                    )?.flavor_text ||
                    "Description not available";

                const genderRate = species.gender_rate;
                const gender =
                    genderRate !== -1
                        ? {
                              male: ((8 - genderRate) / 8) * 100,
                              female: (genderRate / 8) * 100,
                          }
                        : "Genderless";
                const varieties = species.varieties.map((v) => v.pokemon.name);

                const evolutionChainResponse = await fetch(species.evolution_chain.url);
                if (!evolutionChainResponse.ok) {
                    throw new Error("Failed to fetch evolution chain data");
                }
                const evolutionChain = await evolutionChainResponse.json();

                // 3. Cadena de evolución con imágenes y tipos
                const parseEvolutions = async (chain) => {
                    const evolutions = [];
                    let current = chain;
                    while (current) {
                        const evolutionName = current.species.name;
                        const evolutionResponse = await fetch(`${baseUrl}/pokemon/${evolutionName}`);
                        if (!evolutionResponse.ok) {
                            throw new Error("Failed to fetch evolution data");
                        }
                        const evolutionData = await evolutionResponse.json();

                        evolutions.push({
                            name: evolutionName,
                            image: evolutionData.sprites.other["official-artwork"].front_default,
                            types: evolutionData.types.map((t) => t.type.name),
                        });

                        current = current.evolves_to[0] || null;
                    }
                    return evolutions;
                };

                const evolutions = await parseEvolutions(evolutionChain.chain);

                // 4. Debilidades (usando los tipos)
                const weaknesses = new Set();
                for (const type of types) {
                    const typeResponse = await fetch(type.url);
                    if (!typeResponse.ok) {
                        throw new Error("Failed to fetch type data");
                    }
                    const typeData = await typeResponse.json();
                    typeData.damage_relations.double_damage_from.forEach((weakness) => {
                        weaknesses.add(weakness.name);
                    });
                }

                // Usamos el hook para traducir tipos, habilidades y debilidades
                const translatedTypes = await transalation(types.map(t => t.name), "type", language);
                const translatedAbilities = await transalation(abilities, "ability", language);
                const translatedWeaknesses = await transalation(Array.from(weaknesses), "type", language);

                // Datos finales
                const data = {
                    name,
                    height,
                    weight,
                    types: translatedTypes,
                    abilities: translatedAbilities,
                    image,
                    category,
                    description,
                    gender,
                    varieties,
                    evolutions,
                    weaknesses: translatedWeaknesses,
                };

                setPokemonData(data);  // Establece los datos cuando se ha completado la carga
            } catch (err) {
                console.error("Error fetching Pokémon data:", err);
                setError(err.message);  // Establece el error si algo falla
            } finally {
                setLoading(false);  // Finalmente, cambiamos el estado de carga
            }
        }

        fetchData();
    }, [pokemonName, language]);

    return { pokemonData, loading, error };  // Retornamos también los estados de carga y error
};

usePokemonFetcher.propTypes = {
    pokemonName: PropTypes.string.isRequired,
    language: PropTypes.string,
};

export default usePokemonFetcher;

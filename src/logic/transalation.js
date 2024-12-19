// Función para obtener las traducciones desde la API
const fetchTranslation = async (id, type, language) => {
    const response = await fetch(`https://pokeapi.co/api/v2/${type}/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
    }
    const data = await response.json();
    const translation = data.names.find((name) => name.language.name === language);
    return translation ? translation.name : id;  // Devuelve la traducción o el ID si no se encuentra
};

export const transalation = async (items, type, language) => {

    
    if (!items.length) return;

    let translations = [];

    const getTranslations = async () => {
        try {
            const translatedItems = await Promise.all(
                items.map(async (item) => {
                    return fetchTranslation(item, type, language);
                })
            );
            translations.push(...translatedItems);
        } catch (error) {
            console.error("Error fetching translations:", error);
            translations.push(...items);
        }
    };

    await getTranslations();

    return translations;
};

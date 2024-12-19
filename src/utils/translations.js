
import { statTranslations } from "../constants";
export const getStatTranslation = (statKey, language = 'en') => {
    console.log(statKey, language, statTranslations[language])
    if (statTranslations[language] && statTranslations[language][statKey]) {
        return statTranslations[language][statKey];
    }
    return statTranslations['en'][statKey];
};

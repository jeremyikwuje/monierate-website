type CountryCode = string;
type CountryName = string;
type Countries = { [code: CountryCode]: CountryName | any };
type GroupedCountries = { [letter: string]: Countries };

import { error } from '@sveltejs/kit';
import * as CountriesData from '$data/countries.json';
import { validCountryKeys } from './validCountryKeys'; // Import the valid country keys (Countries to be listed)

export const load = async () => {
    try {
        const countries: Countries = CountriesData as Countries;

        const groupedByAlpha: GroupedCountries = Object.entries(countries).reduce(
            (acc, [code, name]) => {
                if (!validCountryKeys.includes(code)) {
                    return acc;
                }

                if (typeof name !== 'string') {
                    return acc;
                }

                const firstLetter = name.charAt(0).toUpperCase();

                if (!firstLetter.match(/[A-Z]/)) {
                    return acc;
                }

                if (!acc[firstLetter]) acc[firstLetter] = {};

                acc[firstLetter][code] = name;
                return acc;
            },
            {} as GroupedCountries
        );

        return {
            countries: groupedByAlpha,
        };
    } catch (e) {
        console.error('Error loading countries:', e);
        throw error(500, 'Could not find countries data');
    }
};

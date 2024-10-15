type CountryCode = string;
type CountryName = string;
type Countries = { [code: CountryCode]: CountryName | any }; // Adjusting type to be safer
type GroupedCountries = { [letter: string]: Countries };

import { error } from '@sveltejs/kit';
import * as CountriesData from '$data/countries.json';
import { validCountryKeys } from './validCountryKeys'; // Import the valid country keys

export const load = async () => {
    try {
        const countries: Countries = CountriesData as Countries;

        const groupedByAlpha: GroupedCountries = Object.entries(countries).reduce(
            (acc, [code, name]) => {
                // Check if the country code exists in the validCountryKeys array
                if (!validCountryKeys.includes(code)) {
                    return acc;
                }

                if (typeof name !== 'string') {
                    return acc;
                }

                // Extract the first letter of the country name
                const firstLetter = name.charAt(0).toUpperCase();

                // Skip if no valid first letter
                if (!firstLetter.match(/[A-Z]/)) {
                    return acc;
                }

                // Initialize the group if not already
                if (!acc[firstLetter]) acc[firstLetter] = {};

                // Group the country by the first letter
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

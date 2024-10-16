type CountryCode = string;
type CountryName = string;
type Countries = { [code: CountryCode]: CountryName | any };
type GroupedCountries = { [letter: string]: Countries };

import { error } from '@sveltejs/kit';
import * as CountriesData from '$data/countries.json';
import { validCountryKeys } from './validCountryKeys'; // Import the valid country keys (Countries to be listed)
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const countryCode = params.country;

    try {
        const countries: Countries = CountriesData as Countries;
        const sortedCountries = Object.entries(countries)
            .filter(([code, name]) => validCountryKeys.includes(code) && typeof name === 'string')
            .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB));

        // Step 2: Group the countries by their first letter.
        const groupedByAlpha: GroupedCountries = sortedCountries.reduce(
            (acc, [code, name]) => {
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
            countryCode,
        };
    } catch (e) {
        console.error('Error loading countries:', e);
        throw error(500, 'Could not find countries data');
    }
};

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

var debounce = require('lodash.debounce');
const input = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;
export const countryList = document.querySelector('.country-list');
export const countryInfo = document.querySelector('.country-info');

input.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY))



function onSearch(event) {
    event.preventDefault()
    const inputValue = input.value.trim();
    clearElementContent(countryInfo);
    clearElementContent(countryList);

    if (inputValue !== '') {
        return fetchCountries(inputValue)

            .then(filterData)
            .catch(error => Notify.failure('Oops, there is no country with that name'));

}
}
function filterData(data) {
    if (data.length > 10) {
        return Notify.info('Too many matches found. Please enter a more specific name.')
    }
    const filteredData = data.map(country => ({
        name: country.name.official,
        capital: country.capital,
        population: country.population,
        flagUrl: country.flags.svg,
        lang: country.languages
    }))
    if (filteredData.length >= 2 && filteredData.length <= 10) {
        fillElementWithContent(countryList, createListMarkup, filteredData);
        clearElementContent(countryInfo);
    }
    if (filteredData.length === 1) {
        fillElementWithContent(countryInfo, createCountryInfoMarkup, filteredData);
        clearElementContent(countryList);
    }


}
function createListMarkup(items) {
    return items.reduce((acc, item) => {
        return acc + `<li><img width="30" height="15" src="${item.flagUrl}" />${item.name}</li>`;
    }, '');
}
export function clearElementContent(element) {
    return element.innerHTML = '';
}
function fillElementWithContent(element, markup, data) {
    return element.innerHTML = markup(data);
}
function createCountryInfoMarkup(items) {
    return items.reduce((acc, item) => {
        return acc + `
    <h1><img width="45" height="23" src="${item.flagUrl}"/>${item.name}</h1>
    <ul>
      <li>Capital: ${item.capital}</li>
      <li>Population: ${item.population}</li>
      <li>Languages: ${createLanguagesMarkup(item.lang)}</li>
    </ul>`;
    }, '');
}

function createLanguagesMarkup(languagesObj) {
    return Object.values(languagesObj).join(', ')
}
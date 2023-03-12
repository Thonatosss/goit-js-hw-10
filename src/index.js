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

    if (inputValue !== '') {
        return fetchCountries(inputValue)

            .then(filterData)
            .catch(error => console.log(error));
    } else if (inputValue === '') {
        clearElementContent(countryInfo);
        clearElementContent(countryList);
    }

}
function filterData(data) {
    const filteredData = data.map(country => ({
        name: country.name.official,
        capital: country.capital,
        population: country.population,
        flagUrl: country.flags.svg,
        lang: country.languages
    }))
    if (filteredData.length > 10) {
        return Notify.info('Too many matches found. Please enter a more specific name.')
    }
    else if (filteredData.length >= 2 && filteredData.length < 10) {
        fillElementWithContent(countryList, createListMarkup, filteredData);
        clearElementContent(countryInfo);
    }
    else if (filteredData.length === 1) {
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
    let langArr = [];
    for (const key in languagesObj) {
        langArr.push(languagesObj[key])
    }
    return langArr.map((country) => {
        return `${country}`
    }).join(', ')
}
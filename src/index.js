import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

var debounce = require('lodash.debounce');
const input = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY))



function onSearch(event) {
    event.preventDefault()
    const inputValue = input.value.trim();

    if (inputValue !== '') {
        return fetchCountries(inputValue).then(filterData).catch(error => console.log(error));
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
    console.log(filteredData);
    console.log(filteredData.length);
    if (filteredData.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.')
    }
    else if (filteredData.length > 2 && filteredData.length < 10) {
        countryList.insertAdjacentHTML('afterbegin', createListMarkup(filteredData));
    }
    else if (filteredData.length === 1) {
        countryInfo.insertAdjacentHTML('afterbegin', createCountryInfoMarkup(filteredData));
    }


}

function createListMarkup(items) {
    return items.reduce((acc, item) => {
        return acc + `<li><img width="30" height="15" src="${item.flagUrl}" />${item.name}</li>`;
    }, '');
}

function createCountryInfoMarkup(items) {
    return items.reduce((acc, item) => {
        return acc + `
        <h1><img width="30" height="15" src="${item.flagUrl}"/>${item.name}</h1>
        <ul>
        <li>Capital: ${item.capital}</li>
        <li>Populatin: ${item.population}</li>
        <li>Languages: ${item.languages}</li>
        </ul>`;
    }, '');
}
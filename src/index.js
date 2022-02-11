import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const searchBoxRef = document.getElementById('search-box');
const countrieListRef = document.querySelector('.country-list');
const countrieBoxRef = document.querySelector('.country-info');
let name = '';

searchBoxRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const name = searchBoxRef.value.trim();
  if (name === '') {
    return (countrieListRef.innerHTML = ''), (countrieBoxRef.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      countrieListRef.innerHTML = '';
      countrieBoxRef.innerHTML = '';
      if (countries.length === 1) {
        countrieListRef.insertAdjacentHTML('beforeend', renderCountryList(countries));
        countrieBoxRef.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        countrieListRef.insertAdjacentHTML('beforeend', renderCountryList(countries));
      }
    })
    .catch(alertWrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
            <li class="country-list__item list">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 35 height = 35px>
                <h2 class="country-list__name">${name.official}</h2>
            </li>
            `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `<ul class="country-info__list list">
              <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
              <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
              <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(
                ', ',
              )}</p></li>
          </ul>`;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

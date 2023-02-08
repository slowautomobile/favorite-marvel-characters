const mainDiv = document.getElementById('main');
const charactersGallery = document.querySelector('.charactersGallery');
const searchInput = document.getElementById('search-input-id');

const apiKey = '19ef48654308361f62403056e6b9f1ca';
const marvelApiUrl = 'https://gateway.marvel.com:443/v1/public/characters';
let limitSearch = 20;

let tempImagesFragment = new DocumentFragment();

window.onload = displayBookmarkedChars();

searchInput.addEventListener('input', e => {
  getCharacters(e.target.value);
});

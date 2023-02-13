const mainDiv = document.getElementById('main');
const bookmarkGallery = document.getElementById('bookmark-gallery');
// const charactersGallery = document.querySelector('.charactersGallery');
let charactersGalleryArray = [];
let pages;
let page = 0;


const marvelAttribution = document.querySelector('.marvel-attribution');
const searchInput = document.getElementById('search-input-id');

const paginationEl = document.createElement('div');
paginationEl.classList.add('pagination-wrapper');


const apiKey = '19ef48654308361f62403056e6b9f1ca';
const marvelApiUrl = 'https://gateway.marvel.com:443/v1/public/characters';
let limitSearch = 12;
let offset = 0;
let searchValue;

let tempImagesFragment = new DocumentFragment();
let tempImagesFragmentBackup = new DocumentFragment();

window.onload = () => {
  displayBookmarkedChars();
  searchInput.value = '';
};

const debouncedGet = debounceFn(getCharacters, 500);

searchInput.addEventListener('input', debouncedGet);

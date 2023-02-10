function debounceFn(callbackfn, delay) {
  let timeoutID;

  return function (event) {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      callbackfn(event);
    }, delay);
  };
}

function getCharacters(inputEvent) {
  let searchValue = inputEvent.target.value;
  if (searchValue.length) {
    fetch(
      `${marvelApiUrl}?nameStartsWith=${searchValue}&limit=${limitSearch}&apikey=${apiKey}`
    )
      .then(response => response.json())
      .then(data => {
        let results = data.data.results;
        drawGallery(results);
      });
  } else {
    charactersGallery.innerHTML = '';
    marvelAttribution.classList.add('hide');
    displayBookmarkedChars();
  }
}

function bookmarkCharacter(character, currentCharacter) {
  if (localStorage.getItem(character.id)) {
    localStorage.removeItem(character.id);
    currentCharacter.children[0].classList.add('fa-regular');
    currentCharacter.children[0].classList.remove('fa-solid');
  } else {
    localStorage.setItem(character.id, JSON.stringify(character));
    currentCharacter.children[0].classList.remove('fa-regular');
    currentCharacter.children[0].classList.add('fa-solid');
  }
}

function displayBookmarkedChars() {
  for (let bookmarkedChar of Object.values(localStorage)) {
    drawCharacter(JSON.parse(bookmarkedChar));
  }
}

function drawGallery(results) {
  charactersGallery.innerHTML = '';
  results.forEach((character, i) => drawCharacter(character, i));
  marvelAttribution.classList.remove('hide');
}

function drawCharacter(character, i) {
  let characterContainer = document.createElement('div');
  characterContainer.id = `character-${i}`;
  tempImagesFragment.innerHTML = '';

  let bookmarkBtn = document.createElement('div');
  bookmarkBtn.id = `bookmarkBtn-${i}`;
  bookmarkBtn.title = 'Bookmark Character';
  bookmarkBtn.innerHTML = `<i class="${
    localStorage.getItem(character.id) ? 'fa-solid' : 'fa-regular'
  } fa-bookmark"></i>`;
  bookmarkBtn.classList.add('bookmark-btn');

  characterContainer.innerHTML = `
  ${bookmarkBtn.outerHTML}
    <div class="image-wrapper">
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="image">
    </div>
    <p class="characterName">${character.name}</p>
  `;

  tempImagesFragment.append(characterContainer);

  let currentCharacter = tempImagesFragment.getElementById(`bookmarkBtn-${i}`);
  currentCharacter.addEventListener('click', () => {
    bookmarkCharacter(character, currentCharacter);
  });
  charactersGallery.append(tempImagesFragment);
}

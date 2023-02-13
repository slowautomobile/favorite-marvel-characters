function debounceFn(callbackfn, delay) {
  let timeoutID;

  return function (event) {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      callbackfn(event);
    }, delay);
  };
}

function getCharacters(inputEvent, page = 1) {
  searchValue = inputEvent.target.value;
  let offset = (page - 1) * limitSearch;
  if (searchValue.length) {
    fetch(
      `${marvelApiUrl}?nameStartsWith=${searchValue}&offset=${offset}&limit=${limitSearch}&apikey=${apiKey}`
    )
      .then(response => response.json())
      .then(data => {
        let results = data.data.results;
        total = data.data.total;
        pages = Math.ceil(total / limitSearch);
        drawGallery(results);
        updatePagination();
      });
    } else {
      charactersGallery.innerHTML = '';
      paginationEl.innerHTML = '';
      displayBookmarkedChars();
    }
    marvelAttribution.classList.remove('hide');
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

function updatePagination() {
  paginationEl.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    let pageEl = document.createElement('p');
    pageEl.id = `page-${i}`;
    pageEl.textContent = i + 1;
    if(i === 0) {
      pageEl.classList.add('active');
    }
    paginationEl.append(pageEl);
    let currentSearch = searchValue;
    let currentPage = i + 1;
    pageEl.addEventListener('click', () => {
      let offset = (currentPage - 1) * limitSearch;
      fetch(
        `${marvelApiUrl}?nameStartsWith=${currentSearch}&offset=${offset}&limit=${limitSearch}&apikey=${apiKey}`
      )
        .then(response => response.json())
        .then(data => {
          let results = data.data.results;
          drawGallery(results);
        });

        for(let i = 0; i < pages; i++) {
          paginationEl.children[i].classList.remove('active');
        }

        pageEl.classList.add('active');
    });
  }
}

function drawGallery(results) {
  charactersGallery.innerHTML = '';
 
  results.forEach((character, i) => drawCharacter(character, i));
 
  mainDiv.insertAdjacentElement('beforeend', paginationEl);
}

function drawCharacter(character, i) {
  let characterContainer = document.createElement('div');
  characterContainer.id = `character-${i}`;

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

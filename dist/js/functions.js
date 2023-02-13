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
  searchValue = inputEvent.target.value;
  charactersGalleryArray = [];

  if (searchValue.length) {
    fetch(
      `${marvelApiUrl}?nameStartsWith=${searchValue}&limit=${limitSearch}&apikey=${apiKey}`
    )
      .then(response => response.json())
      .then(data => {
        let results = data.data.results;
        let total = data.data.total;
        pages = Math.ceil(total / 12);
        drawGallery(results, pages, 0);
        marvelAttribution.classList.remove('hide');

        // for(let page = 0; page < pages; page++) {
        // }
        // if(pages === 1 ) {
        // let page = pages;
        // console.log(pages, 'one page');
        // } else {
        // drawGallery(results, pages);
        // console.log(pages, page);
        // }
      });
  } else {
    charactersGalleryArray = [];
    mainDiv.innerHTML = '';
    // charactersGallery.innerHTML = '';
    tempImagesFragment.innerHTML = '';

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
  bookmarkGallery.innerHTML = '';
  for (let bookmarkedChar of Object.values(localStorage)) {
    drawCharacter(JSON.parse(bookmarkedChar));
    bookmarkGallery.append(tempImagesFragment);
  }
  bookmarkGallery.classList.remove('hide');
  if (!bookmarkGallery.children.length) {
    marvelAttribution.classList.remove('hide');
  }
}

function drawGallery(results, pages, page) {
  mainDiv.innerHTML = '';
  // charactersGallery.innerHTML = '';
  bookmarkGallery.classList.add('hide');

  paginationEl.innerHTML = '';
  charactersGalleryArray[page] = document.createElement('div');
  charactersGalleryArray[page].classList.add('charactersGallery');
  charactersGalleryArray[page].id = `charactersGallery-${page}`;

  // let charactersGallery = document.createElement('div');
  // charactersGallery.classList.add('charactersGallery');
  // charactersGallery.id = `charactersGallery-${page}`
  results.forEach((character, i) => drawCharacter(character, i, page));
  charactersGalleryArray[page].append(tempImagesFragment);

  // charactersGalleryArray.push(charactersGallery);

  if (pages > 1) {
    for (let i = 0; i < pages; i++) {
      let pageEl = document.createElement('p');
      pageEl.id = `page-${i}`;
      pageEl.textContent = i + 1;
      paginationEl.append(pageEl);
      paginationEl.children[i].addEventListener('click', () => {
        offset += 12 * i;
        if (charactersGalleryArray[i].id.slice(18) == i) {
          mainDiv.append(charactersGalleryArray[i]);
        } else {
          // if(charactersGalleryArray[i]) {
          //   mainDiv.append(charactersGalleryArray[i]);
          // }
          mainDiv.innerHTML = '';
          fetch(
            `${marvelApiUrl}?nameStartsWith=${searchValue}&offset=${
              offset * (i + 1)
            }&limit=${limitSearch}&apikey=${apiKey}`
          )
            .then(response => response.json())
            .then(data => {
              let results = data.data.results;
              drawGallery(results);
            });
        }
        charactersGalleryArray[i].classList.remove('hide');
      });
      mainDiv.append(charactersGalleryArray[i]);
      console.log('more find');
    }
  } else {
    console.log('single find');
  }

  mainDiv.insertAdjacentElement('beforeend', paginationEl);
}

function drawCharacter(character, i, page) {
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

  // charactersGallery.append(tempImagesFragment);
}

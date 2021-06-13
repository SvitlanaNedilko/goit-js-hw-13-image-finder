let page = 1;

function newPictures(searchQuery) {
  const KEYS = '22042879-adb59bab87f7729a85f6313d3';

  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${KEYS}`,
  )
    .then(r => {
      if (!r.ok) {
        throw Error();
      }
      return r.json();
    })
    .then(({ hits, totalHits }) => {
      incrementPage();
      return { hits, totalHits };
    });
}

function incrementPage() {
  page += 1;
}

export function resetPage() {
  page = 1;
}

export default newPictures;

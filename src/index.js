import './sass/main.scss';
import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';

import gellaryCardMarksup from './templates/gallery-card-markup.hbs';
import newPictures, { resetPage } from './fetch-pictures';

const searchEl = document.querySelector('[data-attribut=search-area]');
const LoadMoreBtn = document.querySelector('[data-action="load-more"]');
const geleryListEl = document.querySelector('.gallery');

searchEl.addEventListener('input', debounce(onSearchPictures, 500));
LoadMoreBtn.addEventListener('click', onLoadMore);

let loadedCount = 0;
let totalCount = 0;

function onSearchPictures(event) {
  if (event.target.value.trim() === '') {
    return;
  }
  clearElements();
  resetPage();

  newPictures(event.target.value.trim())
    .then(({ hits, totalHits }) => {
      if (totalHits === 0) {
        alert({
          text: 'nothing was found !',
          type: 'error',
          delay: 1500,
        });
        return;
      }
      totalCount = totalHits;
      loadedCount = hits.length;
      appendPicturkuesMarp(hits);

      if (totalCount !== loadedCount) {
        LoadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(() => {
      alert({
        text: 'something went wrong !',
        type: 'error',
        delay: 1500,
      });
    });
}

function onLoadMore() {
  newPictures(searchEl.value).then(({ hits }) => {
    loadedCount += hits.length;
    if (loadedCount === totalCount) {
      LoadMoreBtn.classList.add('is-hidden');
    }

    appendPicturkuesMarp(hits);
    const elem = geleryListEl.querySelector(`[data-id='${hits[0].id}']`);
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

function appendPicturkuesMarp(hits) {
  geleryListEl.insertAdjacentHTML('beforeend', createPicturesMarkup(hits));

  geleryListEl.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', e => {
      basicLightbox.create(`<img src="${img.dataset.url}" width="800" height="600">`).show();
    });
  });
}

function createPicturesMarkup(hits) {
  return hits.map(gellaryCardMarksup).join('');
}

function clearElements() {
  geleryListEl.innerHTML = '';
}

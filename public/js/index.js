import '@babel/polyfill';
import { showAlert } from './alerts';
import { scrollToTop } from './scroll';
import { login } from './login';
import { logout } from './logout';
import { createTither, updateTither, deleteTither } from './tithes';

// forms
const loginForm = document.forms.login;
const tithesForm = document.forms.tithes;
const updateForm = document.forms.update;

// admin logout
const logoutBtn = document.querySelector('.logout');
// delete
const deleteBtns = document.querySelectorAll('.delete');
const deleteId = document.querySelectorAll('.Id');

// scroll
const scroll = document.querySelector('.scroll');

// filter variables
const search = document.querySelector('.sermons__search--btn');
const btns = document.querySelectorAll('.sermons__search--filter-box__btn');
// paginate variables
let pageBtns = Array.from(
  document.querySelectorAll('.page-btns-container__item')
);
let prevBtn = document.querySelector('.page-btns-container__prev');
let nextBtn = document.querySelector('.page-btns-container__next');

// scroll
if (scroll)
  scroll.addEventListener('click', () => {
    scrollToTop();
  });

window.addEventListener('scroll', () => {
  if (scroll) scroll.classList.toggle('active', window.scrollY > 200);
});

// filter;
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function (e) {
    e.preventDefault();
    const filter = e.target.dataset.filter;
    let params = new URLSearchParams(location.search);
    params.set('month', filter);

    location.search = '?' + params.toString();
  });
}
if (search)
  search.addEventListener('click', async function (e) {
    e.preventDefault();
    const tither = document.querySelector('#search_tither').value;
    if (!tither) return;
    let params = new URLSearchParams(location.search);
    params.set('tither', tither);
    location.search = '?' + params.toString();
  });

// Paginate
for (let i = 0; i < pageBtns.length; i++) {
  if (pageBtns)
    pageBtns[i].addEventListener('click', function (e) {
      e.preventDefault();
      let page = e.target.dataset.page;

      let params = new URLSearchParams(location.search);
      params.set('page', page);

      location.search = '?' + params.toString();
    });
}

if (pageBtns.length > 4) {
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';

  let delBtnsEnd = pageBtns.splice(5);
  let delBtnsBeg = [];

  for (let btn of delBtnsEnd) {
    btn.style.display = 'none';
  }

  // Next Button
  if (nextBtn)
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (pageBtns.length > 3 && delBtnsEnd.length > 0) {
        let firstBtns = pageBtns.shift();
        firstBtns.style.display = 'none';
        delBtnsBeg.push(firstBtns);
        let AddedBtns = delBtnsEnd.shift();
        AddedBtns.style.display = 'inline-block';
        pageBtns.push(AddedBtns);
      } else {
        showAlert('info', 'No more Pages!!');
      }
    });

  //   Previous Button
  if (prevBtn)
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (delBtnsBeg.length > 0) {
        let reAddBtns = delBtnsBeg.pop();
        reAddBtns.style.display = 'inline-block';
        pageBtns.unshift(reAddBtns);
        let delBtn = pageBtns.pop();
        delBtn.style.display = 'none';
        delBtnsEnd.unshift(delBtn);
      } else {
        showAlert('info', 'No more Pages!!');
      }
    });
}

// Login
if (loginForm)
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = new FormData(loginForm);
    login(data);
  });
// Create Sermon
if (tithesForm)
  tithesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(tithesForm);
    createTither(data);
  });
if (updateForm)
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(updateForm);
    let id = document.querySelector('#id').value;

    if (location.href.indexOf('Tithes') != -1) updateTither(data, id);
  });

if (logoutBtn)
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    logout();
  });

if (deleteBtns)
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', function (e) {
      e.preventDefault();
      let id;
      // alert(location.href);
      // alert(location.href.indexOf('Sermon'));
      for (let j = 0; j < deleteId.length; j++) {
        id = deleteId[i].value;
      }
      if (location.href.indexOf('Tithes') != -1) deleteTither(id);
    });
  }

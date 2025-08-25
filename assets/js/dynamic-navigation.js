// Dynamic Navigation: Single Login/Profil button (no Logout here)
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

(function initDynamicNavigation(){
  function getAuth(){
    return window.firebaseAuth;
  }

  function ensureAuthLink(){
    let link = document.getElementById('auth-nav-link');
    if(!link){
      const nav = document.querySelector('header nav');
      if(!nav) return null;
      link = document.createElement('a');
      link.id = 'auth-nav-link';
      link.className = 'dynamic-auth-link';
      link.href = 'login.html';
      const span = document.createElement('span');
      span.id = 'auth-nav-text';
      span.textContent = 'Login';
      link.appendChild(span);
      nav.appendChild(link);
    }
    return link;
  }

  function clearAvatar(link){
    const avatar = link.querySelector('.nav-avatar');
    if(avatar) avatar.remove();
  }

  function addAvatar(link, user){
    clearAvatar(link);
    if(user && user.photoURL){
      const img = document.createElement('img');
      img.src = user.photoURL;
      img.alt = 'Profil';
      img.referrerPolicy = 'no-referrer';
      img.className = 'nav-avatar';
      link.prepend(img);
    }
  }

  function updateLink(user){
    const link = ensureAuthLink();
    if(!link) return;
    const textEl = document.getElementById('auth-nav-text') || link.querySelector('#auth-nav-text');
    if(user){
      link.href = 'profile.html';
      link.classList.add('profile-link');
      link.classList.remove('login-link');
      if(textEl) textEl.textContent = 'Profil';
      addAvatar(link, user);
      if(window.location.pathname.endsWith('profile.html')){
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else {
      link.href = 'login.html';
      link.classList.add('login-link');
      link.classList.remove('profile-link');
      if(textEl) textEl.textContent = 'Login';
      clearAvatar(link);
      if(window.location.pathname.endsWith('login.html')){
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  }

  function waitForFirebase(attempt=0){
    if(getAuth()){
      onAuthStateChanged(getAuth(), user => updateLink(user));
      updateLink(getAuth().currentUser);
      return;
    }
    if(attempt < 40){
      setTimeout(()=>waitForFirebase(attempt+1), 100);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureAuthLink();
    waitForFirebase();
  });
})();

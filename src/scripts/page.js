import { initNavigation } from './core/navigation.js';
import { initApiStatus } from './core/api-status.js';
import { initHomePage } from './pages/home.js';
import { initProjectsPage } from './pages/projects.js';
import { initProfilePage } from './pages/profile.js';
import { initContactPage } from './pages/contact.js';

const pageInitializers = {
  home: initHomePage,
  projects: initProjectsPage,
  profile: initProfilePage,
  contact: initContactPage
};

function bootPage() {
  initNavigation();
  initApiStatus();
  const pageName = document.body.dataset.page || 'home';
  pageInitializers[pageName]?.();
  document.body.dataset.js = 'ready';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPage, { once: true });
} else {
  bootPage();
}

const emptyPortfolio = Object.freeze({
  version: '01-bases',
  mode: 'structure-only',
  navigation: [
    { id: 'home', path: '/' },
    { id: 'projects', path: '/proyectos' },
    { id: 'profile', path: '/perfil' },
    { id: 'contact', path: '/contacto' }
  ],
  sections: [
    { id: 'introduction', status: 'placeholder' },
    { id: 'projects', status: 'placeholder' },
    { id: 'profile', status: 'placeholder' },
    { id: 'contact', status: 'placeholder' }
  ],
  projects: [],
  studies: [],
  experience: []
});

export function readPortfolioStructure() {
  return structuredClone(emptyPortfolio);
}

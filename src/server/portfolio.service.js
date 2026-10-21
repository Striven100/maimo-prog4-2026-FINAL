import { readPortfolioStructure } from './portfolio.repository.js';

export function getPortfolioStructure() {
  const structure = readPortfolioStructure();
  return {
    meta: {
      version: structure.version,
      mode: structure.mode,
      generatedAt: new Date().toISOString(),
      contentStatus: 'empty-by-design'
    },
    navigation: structure.navigation,
    sections: structure.sections,
    data: {
      projects: structure.projects,
      studies: structure.studies,
      experience: structure.experience
    }
  };
}

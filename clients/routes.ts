const routes = {
  monitoring: {
    history:
      'https://etalab.github.io/statut.annuaire-entreprises.data.gouv.fr/history/',
    summary:
      'https://raw.githubusercontent.com/etalab/statut.annuaire-entreprises.data.gouv.fr/master/history/summary.json',
  },
  rnm: `https://api-rnm.artisanat.fr/v2/entreprises/`,
  rncs: {
    portail: `https://data.inpi.fr/entreprises/`,
    api: {
      login: 'https://opendata-rncs.inpi.fr/services/diffusion/login',
      imr:
        'https://opendata-rncs.inpi.fr/services/diffusion/imrs-saisis/find?siren=',
    },
  },
  sireneInsee: {
    siren: 'https://api.insee.fr/entreprises/sirene/V3/siren/',
    siret: 'https://api.insee.fr/entreprises/sirene/V3/siret/',
    siretBySiren: 'https://api.insee.fr/entreprises/sirene/V3/siret?q=siren:',
    auth: 'https://api.insee.fr/token',
    avis: 'https://avis-situation-sirene.insee.fr/AvisPdf.action',
  },
  sireneOuverte: {
    etablissement: `http://recherche.entreprise.dataeng.etalab.studio/siret?q=`,
    uniteLegale: `http://recherche.entreprise.dataeng.etalab.studio/siren?q=`,
    rechercheUniteLegale: `http://recherche.entreprise.dataeng.etalab.studio/search`,
  },
  conventionCollectives: 'https://siret2idcc.fabrique.social.gouv.fr/api/v2/',
};

export default routes;

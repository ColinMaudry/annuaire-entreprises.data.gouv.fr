import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IUniteLegale, NotASirenError, SirenNotFoundError } from '../../models';
import EntrepriseSection from '../../components/entreprise-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title, { FICHE } from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import EtablissementSection from '../../components/etablissement-section';

import NonDiffusible from '../../components/non-diffusible';
import getUniteLegale from '../../models/unite-legale';

// const structuredData = (uniteLegale: UniteLegale) => [
//   ['Quel est le SIREN de cette entreprise?', `SIREN : ${uniteLegale.siren}`],
// ];

interface IProps {
  uniteLegale: IUniteLegale;
}

const UniteLegalePage: React.FC<IProps> = ({ uniteLegale }) => (
  <Page
    small={true}
    title={`Entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`}
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title
        name={uniteLegale.nomComplet}
        siren={uniteLegale.siren}
        siret={uniteLegale.siege.siret}
        isActive={uniteLegale.siege.estActif}
        isDiffusible={uniteLegale.estDiffusible}
        ficheType={FICHE.UNITELEGALE}
      />
      {uniteLegale.estDiffusible ? (
        <>
          <EntrepriseSection uniteLegale={uniteLegale} />
          {uniteLegale.siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.siege}
              usedInEntreprisePage={true}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      ) : (
        <>
          <p>
            Cette entité est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
        </>
      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

const extractSiren = (slug: string) => {
  if (!slug) {
    return '';
  }
  const m = slug.match(/\d{9}/);

  return m ? m[0] : '';
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;
  const siren = extractSiren(slug);

  try {
    const uniteLegale = await getUniteLegale(siren);
    return {
      props: {
        uniteLegale,
      },
    };
  } catch (e) {
    if (e instanceof NotASirenError) {
      redirectPageNotFound(context.res, slug);
    } else if (e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, siren);
    } else {
      redirectServerError(context.res, e.message);
    }
    return { props: {} };
  }
};

export default UniteLegalePage;

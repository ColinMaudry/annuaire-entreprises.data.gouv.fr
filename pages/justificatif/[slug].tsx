import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSirenOrSiret } from '../../utils/helper';
import { getUniteLegale } from '../../models';
import {
  redirectPageNotFound,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import { Section } from '../../components/section';
import ButtonLink from '../../components/button';
import HorizontalSeparator from '../../components/horizontal-separator';
import { download } from '../../components/icon';
import { cma, inpi } from '../../public/static/logo';
import { TitleImmatriculation } from '../../components/title-section';
import getConventionCollective, {
  IConventions,
} from '../../clients/siret-2-idcc';
import ImmatriculationNotFound from '../../components/introuvable/immatriculation';
import { Tag } from '../../components/tag';
import Annonces from '../../components/annonces';
import { FullTable } from '../../components/table/full';
import {
  getImmatriculationLinks,
  ImmatriculationLinks,
} from '../../models/immatriculation';
import { UniteLegale } from '../../models/unite-legale';

interface IProps {
  uniteLegale: UniteLegale;
  immatriculationLinks: ImmatriculationLinks;
  conventionCollectives: IConventions[];
}

const JustificatifPage: React.FC<IProps> = ({
  uniteLegale,
  conventionCollectives,
  immatriculationLinks,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatricuation - ${uniteLegale.nom_complet}`}
    noIndex={true}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <TitleImmatriculation
        siren={uniteLegale.siren}
        name={uniteLegale.nom_complet}
      />
      {immatriculationLinks.rncsLink && (
        <Section title="Cette entité est immatriculée au RCS">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
              liste les entreprises enregistrées auprès des Greffes des
              tribunaux de commerce et centralisées par l'INPI.
            </div>
            <div className="logo-wrapper">{inpi}</div>
          </div>
          <div className="layout-center">
            {/* <ButtonLink target="_blank" href={`${hrefRNCS}?format=pdf`}>
              {download} Télécharger le justificatif
            </ButtonLink> */}
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculationLinks.rncsLink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </div>
        </Section>
      )}
      {immatriculationLinks.rncsLink && immatriculationLinks.rnmLink && (
        <HorizontalSeparator />
      )}
      {immatriculationLinks.rncsLink && (
        <Section title="Cette entité est immatriculée au RM">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Répertoire National des Métiers (RNM)</b> qui liste les
              entreprises artisanales enreigstrées auprès des Chambres des
              Métiers et de l'Artisanat (CMA France).
            </div>
            <div className="logo-wrapper">{cma}</div>
          </div>
          <div className="layout-center">
            <ButtonLink
              target="_blank"
              href={`${immatriculationLinks.rncsLink}?format=pdf`}
            >
              {download} Télécharger le justificatif
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculationLinks.rncsLink}?format=html`}
              alt
            >
              ⇢ Voir la fiche sur le site de CMA France
            </ButtonLink>
          </div>
        </Section>
      )}
      {!immatriculationLinks.rncsLink && !immatriculationLinks.rnmLink && (
        <ImmatriculationNotFound />
      )}
      <HorizontalSeparator />
      {uniteLegale.statut_diffusion !== 'N' && (
        <>
          <Section title="Conventions collectives">
            {conventionCollectives.length === 0 ? (
              <div>
                Cette entité n’a aucune convention collective enregistrée
              </div>
            ) : (
              <FullTable
                head={['SIRET', 'Titre', 'N°IDCC', 'Convention']}
                body={conventionCollectives.map((convention) => [
                  <a href={`/etablissement/${convention.siret}`}>
                    {convention.siret}
                  </a>,
                  convention.title,
                  <Tag>{convention.num}</Tag>,
                  <ButtonLink target="_blank" href={convention.url} alt small>
                    ⇢&nbsp;Consulter
                  </ButtonLink>,
                ])}
              />
            )}
          </Section>
          <HorizontalSeparator />
          <Annonces siren={uniteLegale.siren} />
        </>
      )}
    </div>
    <style jsx>{`
      .separator {
        width: 10px;
        height: 10px;
      }
      .description {
        display: flex;
        margin-bottom: 20px;
        flex-direction: row;
      }
      .logo-wrapper {
        padding-left: 20px;
        width: calc(30% - 20px);
      }
      .logo-wrapper svg {
        width: 100%;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .description {
          flex-direction: column;
        }
        .logo-wrapper {
          margin: 20px auto 0;
          padding: 0;
        }
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;

  const siren = slug ? slug.substr(slug.length - 9) : slug;

  if (!isSirenOrSiret(siren)) {
    redirectPageNotFound(context.res, siren);
    return { props: {} };
  }

  // siege social
  const uniteLegale = await getUniteLegale(siren as string);

  const conventionCollectives = await getConventionCollective(
    uniteLegale as UniteLegale
  );

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren);
    return { props: {} };
  }

  return {
    props: {
      uniteLegale,
      conventionCollectives,
      immatriculationLinks: await getImmatriculationLinks(siren),
    },
  };
};

export default JustificatifPage;

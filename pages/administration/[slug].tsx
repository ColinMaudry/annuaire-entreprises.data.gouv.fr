import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ReactMarkdown from 'react-markdown';

import {
  administrationsMetaData,
  EAdministration,
  IAdministrationMetaData,
} from '../../models/administration';
import { redirectPageNotFound } from '../../utils/redirect';
import getMonitoring, { IMonitoring } from '../../models/monitoring';
import AdministrationApiMonitoring from '../../components/administration-api-monitoring';

interface IProps extends IAdministrationMetaData {
  monitoring: IMonitoring;
}

const AdministrationPage: React.FC<IProps> = ({
  long,
  slug,
  description,
  apiGouvLink,
  dataGouvLink,
  monitoring,
}) => (
  <Page
    small={true}
    title={long}
    canonical={`https://annuaire-entreprises.data.gouv.fr/administration/${slug}`}
  >
    <div className="content-container">
      <h1>{long}</h1>
      <ReactMarkdown children={description} />
      {(apiGouvLink || dataGouvLink) && (
        <>
          <h2>Accéder aux données</h2>
          {dataGouvLink && (
            <>
              <h3>En téléchargeant un jeu de données</h3>
              <p>
                Les données brutes sont téléchargeables, sous licence open-data.
                Pour y accéder, consultez{' '}
                <a href={dataGouvLink}>la page data.gouv.fr</a>.<br />
              </p>
            </>
          )}
          {apiGouvLink && (
            <>
              <h3>Par API</h3>
              <p>
                Les données sont accessibles par API. Pour y accéder, consultez{' '}
                <a href={apiGouvLink}>la page api.gouv.fr</a>.
              </p>
            </>
          )}
          <br />
          {monitoring && <AdministrationApiMonitoring {...monitoring} />}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as EAdministration;
  const administration = Object.values(administrationsMetaData).find(
    //@ts-ignore
    (admin) => admin.slug === slug
  );
  if (administration === undefined) {
    redirectPageNotFound(
      context.res,
      `Administration ${slug} page does not exist`
    );
    return { props: {} };
  }

  const monitoring = administration.monitoringSlug
    ? await getMonitoring(administration.monitoringSlug)
    : null;

  return { props: { ...administration, monitoring } };
};

export default AdministrationPage;

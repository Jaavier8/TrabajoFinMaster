export const SEND_PROPOSAL_POLICE = (
  policeConnection,
  firstName,
  lastName,
  age,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    connection_id: policeConnection,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "lastname",
          value: lastName,
        },
        {
          name: "firstname",
          value: firstName,
        },
        {
          name: "age",
          value: age,
        },
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "PxvKxvhH1ypT5fjnstLwPH",
        schema_id: schemaId,
        schema_issuer_did: "PxvKxvhH1ypT5fjnstLwPH",
        schema_name: "passport",
        schema_version: schemaVersion,
      },
    },
  };
};

export const SEND_PROPOSAL_ACADEMY = (
  academyConnection,
  language,
  score,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    connection_id: academyConnection,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "language",
          value: language,
        },
        {
          name: "score",
          value: score,
        }
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "DA5Tgk2xpQbZG1D6uuVYsb",
        schema_id: schemaId,
        schema_issuer_did: "DA5Tgk2xpQbZG1D6uuVYsb",
        schema_name: "certificate",
        schema_version: schemaVersion,
      },
    },
  };
};

export const SEND_OFFER_POLICE = (
  firstName,
  lastName,
  age,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    counter_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "lastname",
          value: lastName,
        },
        {
          name: "firstname",
          value: firstName,
        },
        {
          name: "age",
          value: age,
        },
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "PxvKxvhH1ypT5fjnstLwPH",
        schema_id: schemaId,
        schema_issuer_did: "PxvKxvhH1ypT5fjnstLwPH",
        schema_name: "passport",
        schema_version: schemaVersion,
      },
    },
  };
};

export const SEND_OFFER_ACADEMY = (
  language,
  score,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    counter_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "language",
          value: language,
        },
        {
          name: "score",
          value: score,
        }
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "DA5Tgk2xpQbZG1D6uuVYsb",
        schema_id: schemaId,
        schema_issuer_did: "DA5Tgk2xpQbZG1D6uuVYsb",
        schema_name: "certificate",
        schema_version: schemaVersion,
      },
    },
  };
};

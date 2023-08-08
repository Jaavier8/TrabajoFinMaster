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

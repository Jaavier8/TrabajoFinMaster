export const SEND_PROPOSAL_POLICE = (
  policeConnection,
  firstName,
  lastName,
  dateOfBirth,
  idNumber,
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
          name: "dateofbirth",
          value: dateOfBirth,
        },
        {
          name: "idnumber",
          value: idNumber,
        }
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
  languageId,
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
          value: languageId,
        },
        {
          name: "score",
          value: "",
        },
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

export const SEND_PROPOSAL_UNIVERSITY = (
  universityConnection,
  degreeId,
  schoolId,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    connection_id: universityConnection,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "degree",
          value: degreeId,
        },
        {
          name: "school",
          value: schoolId,
        },
        {
          name: "finalgrade",
          value: "",
        },
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "71Fsr9SzB1pawqUJnVjmMz",
        schema_id: schemaId,
        schema_issuer_did: "71Fsr9SzB1pawqUJnVjmMz",
        schema_name: "degree",
        schema_version: schemaVersion,
      },
    },
  };
};

export const SEND_OFFER_POLICE = (
  firstName,
  lastName,
  dateOfBirth,
  idNumber,
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
          name: "dateofbirth",
          value: dateOfBirth,
        },
        {
          name: "idnumber",
          value: idNumber,
        }
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
        },
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

export const SEND_OFFER_UNIVERSITY = (
  degree,
  school,
  finalGrade,
  credId,
  schemaId,
  schemaVersion
) => {
  return {
    counter_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: [
        {
          name: "degree",
          value: degree,
        },
        {
          name: "school",
          value: school,
        },
        {
          name: "finalgrade",
          value: finalGrade,
        },
      ],
    },
    filter: {
      indy: {
        cred_def_id: credId,
        issuer_did: "71Fsr9SzB1pawqUJnVjmMz",
        schema_id: schemaId,
        schema_issuer_did: "71Fsr9SzB1pawqUJnVjmMz",
        schema_name: "degree",
        schema_version: schemaVersion,
      },
    },
  };
};

export const REVOKE_CREDENTIAL = (connId, credExId) => {
  return {
    comment: "",
    connection_id: connId,
    cred_ex_id: credExId,
    notify: false,
    publish: true,
  };
};

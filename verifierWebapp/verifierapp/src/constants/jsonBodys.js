export const SEND_PROOF_REQUEST = (
  verifierConnection,
  timestamp
) => {
  return {
    auto_verify: true,
    comment: "Prueba de estudios, edad e idiomas",
    connection_id: verifierConnection,
    proof_request: {
      name: "Prueba de estudios, edad e idiomas",
      non_revoked: {
        to: timestamp,
      },
      nonce: "1",
      requested_attributes: {
        firstName: {
          name: "firstname",
        },
      },
      requested_predicates: {
        age: {
          name: "age",
          p_type: ">=",
          p_value: 20,
          restrictions: [{}],
        },
        languageCheck1: {
          name: "language",
          p_type: ">=",
          p_value: 1,
          restrictions: [{}],
        },
        languageCheck2: {
          name: "language",
          p_type: "<=",
          p_value: 1,
          restrictions: [{}],
        },
        languageScore: {
          name: "score",
          p_type: ">=",
          p_value: 75,
          restrictions: [{}],
        },
      },
      version: "1.0",
    },
    trace: false,
  };
};

export const SEND_PRESENTATION = (
  timestamp,
  certificateCredential,
  passportCredential
) => {
  return {
    requested_attributes: {
      firstName: {
        cred_id: passportCredential,
        revealed: true,
      },
    },
    requested_predicates: {
      age: {
        cred_id: passportCredential,
        timestamp: timestamp,
      },
      languageCheck1: {
        cred_id: certificateCredential,
        timestamp: timestamp,
      },
      languageCheck2: {
        cred_id: certificateCredential,
        timestamp: timestamp,
      },
      languageScore: {
        cred_id: certificateCredential,
        timestamp: timestamp,
      },
    },
    self_attested_attributes: {},
    trace: false,
  };
};

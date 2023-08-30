export const SEND_PROOF_REQUEST = (
  verifierConnection,
  timestamp,
  ageCheck,
  passportCredId,
  certificateCredId,
  degreeCredId
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
          restrictions: [
            {
              cred_def_id: passportCredId,
            },
          ],
        },
        lastName: {
          name: "lastname",
          restrictions: [
            {
              cred_def_id: passportCredId,
            },
          ],
        },
        idNumber: {
          name: "idnumber",
          restrictions: [
            {
              cred_def_id: passportCredId,
            },
          ],
        }
      },
      requested_predicates: {
        age: {
          name: "dateofbirth",
          p_type: "<=",
          p_value: ageCheck,
          restrictions: [{
            cred_def_id: passportCredId
          }],
        },
        languageCheck1: {
          name: "languageid",
          p_type: ">=",
          p_value: 1,
          restrictions: [{
            cred_def_id: certificateCredId
          }],
        },
        languageCheck2: {
          name: "languageid",
          p_type: "<=",
          p_value: 1,
          restrictions: [{
            cred_def_id: certificateCredId
          }],
        },
        languageScore: {
          name: "score",
          p_type: ">=",
          p_value: 80,
          restrictions: [{
            cred_def_id: certificateCredId
          }],
        },
        degreeCheck1: {
          name: "degreeid",
          p_type: ">=",
          p_value: 1,
          restrictions: [{
            cred_def_id: degreeCredId
          }],
        },
        degreeCheck2: {
          name: "degreeid",
          p_type: "<=",
          p_value: 2,
          restrictions: [{
            cred_def_id: degreeCredId
          }],
        },
        degreeScore: {
          name: "finalgrade",
          p_type: ">=",
          p_value: 85,
          restrictions: [{
            cred_def_id: degreeCredId
          }],
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
  passportCredential,
  degreeCredential
) => {
  return {
    requested_attributes: {
      firstName: {
        cred_id: passportCredential,
        revealed: true,
      },
      lastName: {
        cred_id: passportCredential,
        revealed: true,
      },
      idNumber: {
        cred_id: passportCredential,
        revealed: true,
      }
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
      degreeCheck1: {
        cred_id: degreeCredential,
        timestamp: timestamp,
      },
      degreeCheck2: {
        cred_id: degreeCredential,
        timestamp: timestamp,
      },
      degreeScore: {
        cred_id: degreeCredential,
        timestamp: timestamp,
      },
    },
    self_attested_attributes: {},
    trace: false,
  };
};

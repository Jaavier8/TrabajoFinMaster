export const SEND_PROPOSAL_POLICE = (policeConnection, firstName, lastName, age) => {
    return {
        "connection_id": policeConnection,
        "credential_preview": {
            "@type": "issue-credential/2.0/credential-preview",
            "attributes": [
                {
                    "name": "lastname",
                    "value": lastName
                },
                {
                    "name": "firstname",
                    "value": firstName
                },
                {
                    "name": "age",
                    "value": age
                }
            ]
        },
        "filter": {
            "indy": {
                "cred_def_id": "PxvKxvhH1ypT5fjnstLwPH:3:CL:58:passport",
                "issuer_did": "PxvKxvhH1ypT5fjnstLwPH",
                "schema_id": "PxvKxvhH1ypT5fjnstLwPH:2:passport:0.8",
                "schema_issuer_did": "PxvKxvhH1ypT5fjnstLwPH",
                "schema_name": "passport",
                "schema_version": "0.8"
            }
        }      
    }
}
#!/bin/bash

REACT_APP_SERVER_LINK="`aws ssm get-parameter --name "REACT_APP_SERVER_LINK" --with-decryption --query 'Parameter.Value' --output text`"
REACT_APP_ENCRYPTION_SALT="`aws ssm get-parameter --name "REACT_APP_ENCRYPTION_SALT" --with-decryption --query 'Parameter.Value' --output text`"
GOOGLE_CLIENT_ID="`aws ssm get-parameter --name "GOOGLE_CLIENT_ID" --with-decryption --query 'Parameter.Value' --output text`"

jq -n --arg REACT_APP_SERVER_LINK "$REACT_APP_SERVER_LINK" --arg REACT_APP_ENCRYPTION_SALT "$REACT_APP_ENCRYPTION_SALT" --arg GOOGLE_CLIENT_ID "$GOOGLE_CLIENT
_ID" '{variables: [ {REACT_APP_SERVER_LINK:$REACT_APP_SERVER_LINK, REACT_APP_ENCRYPTION_SALT:$REACT_APP_ENCRYPTION_SALT, GOOGLE_CLIENT_ID:$GOOGLE_CLIENT_ID}]}
' > UIVariables.json
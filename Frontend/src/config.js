import AWS from "aws-sdk";
require("dotenv").config();

let config = {};
const getFromParamStore = async (envArrayElem) => {
  if (!ssmClient)
    ssmClient = new AWS.SSM({
      region: "ap-south-1",
      apiVersion: "latest"
    });

  try {
    let decryptedParameter = await ssmClient
      .getParameter({
        Name: envArrayElem,
        WithDecryption: true
      })
      .promise();
    return decryptedParameter.Parameter.Value;
  } catch (e) {
    console.log(e, "error");
  }
};

export function getEnvVariables(envs, setEnvVariablesSuccess) {
  let credentials = new AWS.CognitoIdentityCredentials({
    profile: "default",
    IdentityPoolId: "ap-south-1"
  });
  AWS.config.credentials = credentials;

  let ssmClient;
  envs.forEach(async env => {
    config[env] = await getFromParamStore(env, ssmClient);
  });
  // console.log(config);
  setTimeout(() => {
    setEnvVariablesSuccess(true);
  }, 3000);
}

export default config;

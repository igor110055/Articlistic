import AWS from "aws-sdk";
require("dotenv").config();
var ssmClient;

let config = {};

const getFromParamStore = async (envArrayElem) => {
  if (!ssmClient)
    ssmClient = new AWS.SSM({
      region: "ap-south-1",
      apiVersion: "latest"
      
    });
  // if (!ssmClient) {
  //   ssmClient = new AWS.SSM({
  //     region: "ap-south-1",
  //     apiVersion: "latest",
  //     accessKeyId: "AKIAYZ7VF2L3EXEKVYER",
  //     secretAccessKey: "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"
  //   });
  // }
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
  //   let credentials = new AWS.CognitoIdentityCredentials({
  //     profile: "default",
  //     IdentityPoolId: "ap-south-1",
  // 
  //   });

  // let credentials = new AWS.CognitoIdentityCredentials({
  //   profile: "default",
  //   IdentityPoolId: "ap-south-1",
  // });
  // AWS.config.credentials = credentials;

  // let ssmClient;
  
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

  envs.forEach(async env => {
    config[env] = await getFromParamStore(env);
  });
  // console.log(config);
  setTimeout(() => {
    setEnvVariablesSuccess(true);
  }, 5000);
}

export default config;

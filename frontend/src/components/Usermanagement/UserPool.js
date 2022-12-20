import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData ={
    UserPoolId: "us-east-1_wFu8Buamb",
    ClientId: "ienlnq59dpbkeu1hd3m26ec5g"
}
export default new CognitoUserPool(poolData);


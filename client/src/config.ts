// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '956wpxdg25'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
console.log(apiEndpoint, "el endpoint")
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-cr9isr4f.eu.auth0.com',            // Auth0 domain
  clientId: 'so2GI2QmQaak1RzPnksGTsbsX1Nx9Oxv',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

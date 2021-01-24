import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJaP2LBx1OWf5jMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi05NjV6ZGN6di51cy5hdXRoMC5jb20wHhcNMjEwMTIzMjMzMzMxWhcN
MzQxMDAyMjMzMzMxWjAkMSIwIAYDVQQDExlkZXYtOTY1emRjenYudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7fwRIF4twJ6IFuO
4eRJrPZeMrKYRfFSsO3+1wS98L/6xOtBpfufoHtlIDuWmZEp8MRUF7m3a46GOX/5
Ub3QPwSDNmTvENqnJLPtuQlAPVQhp/w6mfnTmeY8W5CkgJRTxFRYyVsigTONafVn
t4eBSrS6OzNng0RbZwNZ3iQ5pEoa1+cCwbiYT3EU0h4BhYRTW3uzpRiQ2/F+KQCp
85XHk6XeTj3Ra/RBTkF5A3+d0GA/132SfP9i5QyxSQdIeYeLd0H7WEpcHZ2hbkmA
1vg31gwTQGXEiCtbzYUHsqVMHLRNkor7pvfyiTN7m722VzDClUHJ6gV7SwReZVAG
xdMjIQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQWfDhsTaH2
8REHo+K/zLikTOobtzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AI3Kjw/tNOru+Ifzj2vBWODedKi32la0H2l9/Lj2LD9AVfVGreVGUs+c2RLxMftu
6otGGERn1bLrpshOAa3smd60zVFDRlbRdghFOhXK8Dp3qPEKdj0bjoBuH0jzFvmR
iGZN8i9PsO32kpUPeEE6D7FptgKX2moKBDeEYaYSkeMyEZjMzEPFaI1I5LfcBIQ4
+pZ9/lgvLRPgAx7kQKjFF2hysUWKd/gweSMi/h81tPayjxKx9Biq+pDXVPl18Rdo
bzI/Dvipn0ktVayi8/MyQM8+TEpKLcWaO4O5D9IxnsTvxnUwzcvxdBUpalYiZW8S
8NOSSWv01to82/6Fm45t4+I=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  return verify(token, jwksUrl, { algorithms: ['RS256'] }) as JwtPayload
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

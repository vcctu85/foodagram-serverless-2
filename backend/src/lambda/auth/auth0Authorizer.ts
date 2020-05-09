import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
//import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtToken } from '../../auth/JwtToken'

//const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJBSnziKwoVe5lMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1sczV1LXVoaC5hdXRoMC5jb20wHhcNMjAwNDIyMDAxNDUzWhcNMzMx
MjMwMDAxNDUzWjAhMR8wHQYDVQQDExZkZXYtbHM1dS11aGguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu7TxczBLHBLFNMXsmip9yPwz
4o7xUo3DjzNXBC3x1Ci8bKlBkCy0VOsDAocsGlauf8559+YzxXWFiok6h7Y2VAlv
g89f7on1vU6AzJlCFviraTdgbANH9F2y2nUd6N0DZLRs7/862utIHmi4y8/Z2R1u
QWdd1CsGwzHoNHxbJcbbO4anGLuVQBn4mwZG5KYjzvZ9Nu/KaMn5x/V+K4lUugjD
Z0Yg7NJRMIpvVlZkPVySh5UT/kqA12NYvGj67fMkwVRDoKLBX/CWQou03YkA0aDb
kd8BWAfW2pujh9zNRpTt8BebPd6+f5s/SEezS8uD2id0EuoDbucNhi6MAh5bLQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRp0EvDoGFTO4QABBNf
n+bz8QuX6DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAG5yAOKj
spOgdgOSm4f7Pinfmcv3Vz4l4Vk/hqwpc59Hgy0vcshwGjrvWobziIzxX3Gf2bN8
njjX2cSjhDR76jCjReL/heNNxcSvyRslL77swFFQChiSJ+3Ha68u6PfCm+4VxoPi
N25WznGbaBuKzk/hgZsjoeita7WJkjNoRVjvwurnLJVVQUgLxGxvhyF6CnfV6qoI
WK9C2zC7rkNKZe7PH1UfbEjk45Jw/zeZf3DwXf//QwDUohAiEx9q/fYOMMrnmpVk
DSK9PM7p2xAzslZ+c3+HECrUSgju38mko8+2gxzGRCJtoEZWXAoHHKKl/jdSfeWN
2LqEpUKrlao597E=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  //logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    //logger.info('User was authorized', jwtToken)

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
    //logger.error('User not authorized', { error: e.message })

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

async function verifyToken(authHeader: string): Promise<JwtToken> {
  // TODO: Implement token verification
  const jwtToken = getToken(authHeader)
  return verify(jwtToken, cert, { algorithms: ['RS256']}) as JwtToken
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}


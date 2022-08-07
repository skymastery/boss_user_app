import * as jose from 'jose'

export interface IAuthJwt extends jose.JWTPayload {
  sub: string
  id: string
  iat: number
  exp: number
}

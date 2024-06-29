import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})

export class JwtDecoderService {

  constructor() { }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (Error) {
      // console.log('Error decoding token:', Error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      return true;
    }
    const expiryTime = decodedToken.exp * 1000; // JWT exp is in seconds, convert to milliseconds
    return (new Date()).getTime() > expiryTime;
  }
}

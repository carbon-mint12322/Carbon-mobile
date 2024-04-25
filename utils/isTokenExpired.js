import {decode as atob} from 'base-64'
import jwtDecode from 'jwt-decode';

export default function isTokenExpired(token) {
    const expiry = JSON.parse(atob((token || '').split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
}

export function decodeToken(token) {
    const decodedToken = jwtDecode(token);
    return { claims: decodedToken }
}
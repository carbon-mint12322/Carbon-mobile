import { baseURL } from "../config/urls";

export function changeBaseUrlToApiBaseUrl(originalUrl) {
    var newBaseUrl = baseURL
    newBaseUrl = newBaseUrl.split('/')
    const urlParts = originalUrl.split('/');
    urlParts[2] = newBaseUrl[2] || '';
    const modifiedUrl = urlParts.join('/');
    return modifiedUrl;
}
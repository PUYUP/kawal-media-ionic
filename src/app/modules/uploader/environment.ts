import { environment } from '../../../environments/environment';

const baseUrl     = 'api';
const appUrl      = 'person';
const host        = environment.host;
const path        = host + '/' + baseUrl + '/' + appUrl;

export const modulenv = {
    loginUrl: path + '/token/',
    personUrl: path + '/persons/',
    attributeUrl: path + '/attributes/',
};

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// LOCAL ENV.
import { modulenv } from '../environment';

const credentialsKey = 'credentialsKey';
const tokenKey = 'tokenKey';

// REGISTER CONTEXT
interface RegisterContext {
  username?: string;
  email?: string;
  telephone?: number;
  password?: string;
}

// LOGIN CONTEXT
interface LoginContext {
  username?: string;
  password?: string;
}

// RESET PASSWORD CONTEXT
interface RecoveryPasswordContext {
  secure_code?: string;
  password1?: string;
  password2?: string;
}

interface RequestPasswordContext {
  email?: string;
  secure_code?: string;
  action?: string;
}

// OPTION CONTEXT
interface optionContext {
  person_id?: number;
  identifiers?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private storageCredentials: any | null;
  private storageToken: string | null;

  constructor(
    private httpClient: HttpClient) {

    const savedCredentials = localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this.storageCredentials = JSON.parse(savedCredentials);
    }

    const savedToken = localStorage.getItem(tokenKey);
    if (savedToken != null && savedToken !== 'undefined') {
      this.storageToken = JSON.parse(savedToken);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): any | null {
    return this.storageCredentials;
  }

  get token(): any | null {
    return this.storageToken;
  }

  /**
   * Sets the user credentials.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   */
  private setCredentials(credentials?: any) {
    this.storageCredentials = credentials || null;

    if (credentials) {
      const storage = localStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(credentialsKey);
    }
  }

  private setToken(token: any) {
    this.storageToken = token || null;

    if (token) {
      const storage = localStorage;
      storage.setItem(tokenKey, JSON.stringify(token));
    } else {
      localStorage.removeItem(tokenKey);
    }
  }

  getLocalToken(): any {
    const tokenObj = JSON.parse(localStorage.getItem(tokenKey));
    return tokenObj;
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfull
   */
  postLogout(): Observable<any> {
    const headers = this.initAuthHeaders();

    // Customize credentials invalidation here
    this.setCredentials();
    this.setToken(false);

    return this.httpClient
      .post(modulenv.personUrl + 'logout/', {}, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return {};
        })
      );
  }

  /**
   * Headers for auth token
   */
  initAuthHeaders(): HttpHeaders {
    let authCode = '1234567890';
    const data = this.getLocalToken();

    if (data) authCode = data.auth_code;

    return new HttpHeaders({
      'Authorization': authCode
    });
  }

  /***
   * Save localStorage data 
   */
  setLocalData(key: string = '', data: any = ''): void {
    if (key && data) localStorage.setItem(key, JSON.stringify(data));
  }

  /***
   * Delete localStorage data
   */
  deleteLocalData(key: string = ''): void {
    if (key) localStorage.removeItem(key);
  }

  /*** 
   * Get localStorage data 
   */
  getLocalData(key: string = ''): any {
    return JSON.parse(localStorage.getItem(key));
  }

  /*** 
   * Login action
   */
  postLogin(context: LoginContext): Observable<any> {
    return this.httpClient
      .post(modulenv.loginUrl, {
        username: context.username,
        password: context.password
      }, { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;

          this.setCredentials(result);
          this.setToken(result);
          return result;
        })
      );
  }

  /***
   * Register action
   */
  postRegister(context: RegisterContext): Observable<any> {
    return this.httpClient
      .post(modulenv.personUrl, {
        username: context.username,
        email: context.email,
        telephone: context.telephone,
        password: context.password
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  getBasicProfile(uuid: string): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .get(modulenv.personUrl + uuid + '/', { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Validate action
   */
  updateValidation(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.validationUrl + context.uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Request new password
   */
  postRequestPassord(context: RequestPasswordContext): Observable<any> {
    return this.httpClient
      .post(modulenv.personUrl + 'password-request/', {
        email: context.email,
        secure_code: context.secure_code,
        action: context.action,
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Set new password
   */
  postPasswordRecovery(context: RecoveryPasswordContext): Observable<any> {
    return this.httpClient
      .post(modulenv.personUrl + 'password-recovery/', {
        secure_code: context.secure_code,
        password1: context.password1,
        password2: context.password2,
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update attributes
   */
  postUpdateAttribute(context: any): Observable<any> {
    const headers = this.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .put(modulenv.attributeUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete attributes
   */
  deleteAttribute(context: any): Observable<any> {
    const headers = this.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .delete(modulenv.attributeUrl + uuid + '/', { params: context, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /*** 
   * Get all attributes based on person roles 
   */
  getAttributes(context: optionContext): Observable<any> {
    const headers = this.initAuthHeaders();
    const url = (context.identifiers ? modulenv.attributeUrl + '?identifiers=' + context.identifiers : modulenv.attributeUrl);

    return this.httpClient
      .get(url, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /*** 
   * Request change option action 
   */
  requestSecureCode(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.secureUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /*** 
   * Check value change used or not 
   */
  duplicateCheck(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.personUrl + 'duplicate-check/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Password check
   */
  passwordCheck(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.personUrl + 'password-check/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Updata user profile
   */
  postUpdateProfile(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .patch(modulenv.personUrl + context.uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get all validation
   */
  getValidations(context: any): Observable<any> {
    const headers = this.initAuthHeaders();
    const url = (context.identifiers ? modulenv.validationUrl + '?identifiers=' + context.identifiers : modulenv.validationUrl);
    const person_uuid = context.person_uuid;

    let params = {
      'person_uuid': person_uuid
    };

    return this.httpClient
      .get(url, { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}

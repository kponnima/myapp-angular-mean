import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('intercepted request ...' + req.url);
    //console.log('request headers ...' + req.headers);
    //console.log('request body ...' + req.body);
    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    if (req.url.match('/api/signin') || req.url.match('/api/signup') || req.url.match('/api/charge')) {
        console.log('Sending request with default headers ...');
        return next.handle(req);
    } else{
        // Get the auth token from the service.
        const authToken = this.getAuthorizationToken();

        // Clone the request and set the new header in one step.
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });
        console.log('Sending request with auth header added ...');
        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
  }

    private getAuthorizationToken() {
        return localStorage.getItem('jwtToken');
    }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheService } from '../services/cache.service';

const TTL = 60;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cacheService: CacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('intercepted request ...' + req.url);

    if(req.url.match('/api/flight-search-results')) { //Do not cache certain requests at all
      console.log('Request NOT cached for...' + req.url);
      // Get the auth token from the service.
      const authToken = this.getAuthorizationToken();

      // Clone the request and set the new header in one step.
      const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      console.log('Sending request with auth header added ...');
      // send cloned request with header to the next handler.
      return next.handle(authReq)
    }else{
      const cachedResponse = this.cacheService.get(req.url);
      return cachedResponse
        ? of(cachedResponse)
        : this.sendRequest(req, next);
    }
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.match('/api/signin') || req.url.match('/api/signup') || req.url.match('/api/charge')) {
      console.log('Sending request with default headers ...');
      return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.cacheService.set(req.url, event, TTL);
          }
        })
      );
    } else {
      // Get the auth token from the service.
      const authToken = this.getAuthorizationToken();

      // Clone the request and set the new header in one step.
      const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      console.log('Sending request with auth header added ...');
      // send cloned request with header to the next handler.
      return next.handle(authReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.cacheService.set(req.url, event, TTL);
          }
        })
      );
    }
  }

  getAuthorizationToken() {
    return localStorage.getItem('jwtToken');
  }
}

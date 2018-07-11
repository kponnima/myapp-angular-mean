# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

MongoDB 
	- Stores user data
	- Sends user data back when requested
Express API
	 - Create, Read, Update, Delete
	- Generates JWT token upon registration/login and passes to Angular Application
		: /api/register (POST)
		: /api/login (POST)
		: /api/profile/USERID (GET)
Angular App
	- Calls API and deals with responses  [Passes JWT token for protected routes]
	- Stores JWT in order to maintain user's session
	- Checks the validity of JWT when displaying protected views

![Alt text](https://github.com/kponnima/myapp-angular-mean/screenshots/loading.jpg?raw=true "Loading Screen")
![Alt text](https://github.com/kponnima/myapp-angular-mean/screenshots/login.jpg?raw=true "Login Screen")
![Alt text](https://github.com/kponnima/myapp-angular-mean/screenshots/home.jpg?raw=true "Home Screen")

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

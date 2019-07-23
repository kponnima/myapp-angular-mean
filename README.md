# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

## Key components
`MongoDB` :
* Stores user data
* Sends user data back when requested

`Express API`
* Create, Read, Update, Delete
* Generates JWT token upon registration/login and passes to Angular Application
* /api/register (POST)
* /api/login (POST)
* /api/home/USERNAME (GET)

`Angular App`
* Calls API and deals with responses  [Passes JWT token for protected routes]
* Stores JWT in order to maintain user's session
* Checks the validity of JWT when displaying protected views

`Stripe`
* Stripe API integration for payment processing
* Token validation and saving the charge/payment details to dB

## Installation
`Development Platform - VS Code`

1] Clone this repository and import it to VS Code [repository](https://github.com/kponnima/myapp-angular-mean.git)

2] MongoDB -Install [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) and start server

3] Update your database configuration in `database.js` under `\config`

4] Start `NodeJS/Express/Moongoose` connection server using `start-server` npm-script

5] `Proxy Serve` Angular app using `serve-proxy` npm-script

6] Browser should automatically serve the website on `http://localhost:4200/`.  Else fire up a browser and launch the app using the url.

### Startup Screen
![Alt text](/screenshots/loading.jpg?raw=true "Loading Screen")
### Login Screen
![Alt text](/screenshots/login.jpg?raw=true "Login Screen")
### Home Screen
![Alt text](/screenshots/home.jpg?raw=true "Home Screen")

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Alternate `npx @angular/cli serve`

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

#To change default style extension
`ng config defaults.styleExt=scss`
`ng config schematics.@schematics/angular:component.styleext scss`

#Build test
`ng build --watch --progress=true`
`lite-server --baseDir='dist'`
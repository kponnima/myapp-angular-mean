import { browser, by, element } from 'protractor';

export class LoginPage {

    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-login h1')).getText();
    }

    getUserNameElement() {
        return element(by.id('username'));
    }

    getPasswordElement() {
        return element(by.id('password'));
    }

    getSignInButtonElement() {
        return element(by.id('signinbutton'));
    }

    setUserName(user) {
        return this.getUserNameElement().sendKeys(user);
    }

    setPassword(pass) {
        return this.getPasswordElement().sendKeys(pass);
    }

    clickLogin() {
        return this.getSignInButtonElement().click();
    }
}
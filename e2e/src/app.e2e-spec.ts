import { AppPage } from './po/app.po';
import { LoginPage } from './po/login.po';

/* START THE TEST */
describe('myApp - Complete E2E Test: ', () => {
  let loginpage: LoginPage;

  beforeEach(() => {
    loginpage = new LoginPage();
  });

  it('should display header message', async () => {
    await loginpage.navigateTo();
    expect(loginpage.getParagraphText()).toEqual('Sign In');
  });

  it('should display username input field', () => {
    expect(loginpage.getUserNameElement()).toBeTruthy();
  });

  it('should display password input field', () => {
    expect(loginpage.getPasswordElement()).toBeTruthy();
  });

  it('user should be able to login to the app', async () => {
    await loginpage.setUserName('kponnima86');
    await loginpage.setPassword('Kushal@86');
    expect(loginpage.getSignInButtonElement()).toBeTruthy();
    await loginpage.clickLogin();
  });

});

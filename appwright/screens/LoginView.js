
import { LoginViewSelectors } from '../../e2e/selectors/wallet/LoginView.selectors';
import { CommonScreen } from './CommonScreen';

export class LoginScreen extends CommonScreen {
  get loginScreen() {
    return LoginViewSelectors.CONTAINER;
  }

  get resetWalletButton() {
    return LoginViewSelectors.RESET_WALLET;
  }

  get passwordInput() {
    return LoginViewSelectors.PASSWORD_INPUT;
  }

  get unlockButton() {
    return LoginViewSelectors.UNLOCK_BUTTON;
  }

  get title() {
    return LoginViewSelectors.TITLE_ID;
  }

  get rememberMeToggle() {
    return LoginViewSelectors.REMEMBER_ME_SWITCH;
  }

  async isLoginScreenVisible() {
    await this.isElementByIdVisible(this.loginScreen);
  }

  async tapResetWalletButton() {
    await this.tapOnElement(this.resetWalletButton);
  }

  async typePassword(password) {
    await this.fillInput(this.passwordInput, password);
  }

  async tapUnlockButton() {
    await this.tapOnElement(this.unlockButton);
  }

  async tapTitle() {
    await this.tapOnElement(this.title);
  }

  async tapRememberMeToggle() {
    await this.tapOnElement(this.rememberMeToggle);
  }
}

export default new LoginScreen();

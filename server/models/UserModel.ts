export default class CookiesModel {
  email?: string;

  constructor(options: { email: string; }) {
    this.email = options.email;
  }
}
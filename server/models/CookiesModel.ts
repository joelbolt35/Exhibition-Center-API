import UserModel from './UserModel';

export default class CookiesModel {
  user: UserModel;

  constructor(options: { user: UserModel }) {
    this.user = options.user;
  }
}
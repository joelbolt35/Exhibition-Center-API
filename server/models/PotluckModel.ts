export default class CookiesModel {
  id?: number;
  name?: string;
  food?: string;
  confirmed?: 'Y' | 'N';
  signup_date?: Date;

  constructor(options: { id: number; name: string; food: string; confirmed: 'Y' | 'N'; signup_date: Date; }) {
    this.id = options.id;
    this.name = options.name;
    this.food = options.food;
    this.confirmed = options.confirmed;
    this.signup_date = options.signup_date;
    this.id = options.id;
  }
}
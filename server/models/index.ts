export type PotluckModel = Partial<{ id: number; name: string; food: string; confirmed: 'Y' | 'N'; signup_date: Date; }>
export type UserModel = Partial<{ email: string; }>
export type AuthModel = Partial<{ email: string; password: string; }>
export type CookiesModel = Partial<{ user: UserModel; }>

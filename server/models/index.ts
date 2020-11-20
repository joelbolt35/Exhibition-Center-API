export type PotluckModel = Partial<{ id: number; name: string; food: string; confirmed: 'Y' | 'N'; signup_date: Date; }>
export type UserModel = Partial<{ id: number; username: string; password: string; rank: number; }>
export type AuthModel = Partial<{ username: string; password: string; }>
export type CookiesModel = Partial<{ user: number; }>

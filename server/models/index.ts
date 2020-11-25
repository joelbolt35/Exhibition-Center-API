export type PotluckModel = { id: number; name: string; food: string; confirmed: "Y" | "N"; signup_date: Date; }
export type UserModel = { id: number; username: string; password: string; rank: number; }
export type AuthModel = { username: string; password: string; }
export type CookiesModel = { userID: number; }

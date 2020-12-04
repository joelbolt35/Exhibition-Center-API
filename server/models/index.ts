export type PotluckModel = { id: number; name: string; food: string; confirmed: "Y" | "N"; signup_date: Date; }
export type UserModel = { id: number; username: string; password: string; rank: 1 | 2; }
export type AuthModel = { username: string; password: string; }
export type CookiesModel = { userID: number; }
export type EventModel = {
	id: number,
	created_by: number,
	name: string,
	description: string,
	start: Date,
	end: Date,
	url: string,
	address: string,
	address2: string,
	city: string,
	state: string,
	zipCode: string,
}

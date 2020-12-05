export type PotluckModel = { id: number; name: string; food: string; confirmed: "Y" | "N"; signup_date: Date; }
export type UserModel = {
	id: number;
	username: string;
	password: string;
	rank: 1 | 2;
	participating: EventModel[], // Filled in by server on superadmin page
	created: EventModel[], // Filled in by server on superadmin page
}
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
	registered: boolean; // Not stored in DB, filled in by the server on the event page if the user is registered
}

export type EventUserModel = {
	event_ID: number;
	user_ID: number;
}

export function cleanEvent(event: EventModel): EventModel {
	event.zipCode = event.zipCode.trim();
	event.city = event.city.trim();
	event.address = event.address.trim();
	event.name = event.name.trim();
	event.address2 = event.address2.trim();
	event.description = event.description.trim();
	event.state = event.state.trim();
	event.url = event.url.trim();
	return event;
}

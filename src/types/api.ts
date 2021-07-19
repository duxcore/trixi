import { InteractionMethod } from './interaction';

export interface ApiResponse {
	status?: number; // What is the status code returned with the api response.
	message?: string; // A message attached to the api response.
	data?: any; // The data returned with the api reponse (if any).
	successful?: boolean; // Was the api response successful?
	meta?: any; // Meta data sent along with the api response
}

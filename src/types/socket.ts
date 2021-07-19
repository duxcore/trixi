export interface RawSocketObject {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	payload?: any | null;
	headers: {
		[name: string]: string;
	};
	url: string;
	query?: {
		[key: string]: string | string[];
	};
	params?: {
		[key: string]: string;
	};
	operator: string;
	reference: string;
}

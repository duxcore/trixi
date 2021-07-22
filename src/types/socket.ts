export interface RawSocketObject {
  uri: string;
  status?: number;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	data?: any | null;
	headers: {
		[name: string]: string;
	};
	operator?: string;
	reference: string;
}
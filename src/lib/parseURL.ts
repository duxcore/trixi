export default function parseURL(url: string): {
	parts: string[];
	query: {
		[key: string]: string[];
	};
} {
	const pqs = url.replace(/[^a-z0-9\$\–\_\.\+\!\*\(\)\,\?\&\=\/\%]/gi, '');
	const [ps, qs] = [...pqs.split(/\?/), ''];
	const parts = ps.split(/[\\\/]/gi).filter((a) => a);
	const query: {
		[k: string]: string[];
	} = {};
	if (qs) {
		let qparts = qs.split(/[\&]/g);
		for (const qp of qparts) {
			const [k, v] = [...qp.split('='), ''];
			query[k] ? query[k].push(v) : (query[k] = [v]);
		}
	}
	return { parts, query };
}
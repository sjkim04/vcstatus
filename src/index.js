import {
	bot
} from './bot';

export default {
	async fetch(request, env, ctx) {
		const pathname = new URL(request.url).pathname;

		if(request.method === 'POST' && pathname === '/') return bot(request, env, ctx);

		return new Response('Not found', { status: 404 });
	}
};

const CACHE_NAME = `qr-code-tools-v0.0.38107024`;

addEventListener("install", event => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		cache.addAll([
			"/",
			"/sw.js",
			"/html5-qrcode/html5-qrcode"
		]);
	})());
});

addEventListener("fetch", event => {
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);

		const cachedResponse = await cache.match(event.request);
		if (cachedResponse) {
			return cachedResponse;
		}
		try {
			const fetchResponse = await fetch(event.request);

			cache.put(event.request, fetchResponse.clone());
			return fetchResponse;
		} catch (exception) {
			console.error(exception);
		}
	})());
});

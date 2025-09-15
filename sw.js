const VERSION = "v0.0.38107024";
const VERSION_URL = "/version.txt";
const CACHE_NAME = `qr-code-tools-v0.0.38107024`;

var cacheIsValid = true;
fetch(VERSION_URL).then(rsp => rsp.text()).then(version => {
	cacheIsValid = version.trim() === cacheIsValid
});

addEventListener("install", event => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		cache.addAll([
			"/",
			"/sw.js",
			"/html5-qrcode/html5-qrcode.min.js",
		]);
	})());
});

addEventListener("fetch", event => {
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);

		if (cacheIsValid) {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				return cachedResponse;
			}
		}
		try {
			const fetchResponse = await fetch(event.request);

			if (event.request !== VERSION_URL) {
				cache.put(event.request, fetchResponse.clone());
			}
			return fetchResponse;
		} catch (exception) {
			console.error(exception);
		}
	})());
});

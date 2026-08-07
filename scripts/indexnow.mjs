// Ping IndexNow so Bing / Yandex / DuckDuckGo (and the AI search engines that
// read Bing's index, e.g. ChatGPT & Copilot) re-crawl immediately after a
// production deploy. Google does NOT participate in IndexNow — Google discovery
// is handled by the sitemap + Search Console.
//
// Run after `vercel --prod` (see the `deploy` npm script). No auth/credentials
// needed beyond the key file served at /<key>.txt.

const HOST = 'www.synquanta.com';
const KEY = '92c0eb543a99c29c906522d60f53c711';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urlList = [
  '/',
  '/services',
  '/portfolio',
  '/about',
  '/faq',
  '/contact',
  // '/hvac',  ← hidden until the AI Receptionist ships
  '/terms',
  '/privacy',
].map((p) => `https://${HOST}${p}`);

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(`IndexNow → HTTP ${res.status} ${res.statusText} ${text ? `· ${text}` : ''}`);
console.log(`Submitted ${urlList.length} URLs for ${HOST}`);

// 200 = accepted, 202 = accepted/pending validation. Anything else is a failure.
if (res.status !== 200 && res.status !== 202) {
  console.error('IndexNow ping failed.');
  process.exit(1);
}

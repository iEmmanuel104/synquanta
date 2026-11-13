// Runs before every request on Cloudflare Pages (replaces vercel.json's host redirect).
// synquanta.com (apex) → https://www.synquanta.com, path kept. Static files skip this (public/_routes.json).
export const onRequest = async ({ request, next }: { request: Request; next: () => Promise<Response> }) => {
  const url = new URL(request.url);
  if (url.hostname === 'synquanta.com') {
    url.hostname = 'www.synquanta.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
};

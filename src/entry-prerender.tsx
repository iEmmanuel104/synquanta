// Build-only SSG entry consumed by vite-prerender-plugin. Renders each route to
// static HTML (browser-free, via react-dom/server) and serializes the
// react-helmet-async <head> (title, meta, canonical, OG/Twitter, JSON-LD) into
// the prerendered file's <head> so non-JS crawlers (Bing/LinkedIn/Slack/AI) see
// correct per-page content + cards. NOT imported by the client bundle — and it
// imports App, not main.tsx, so PostHog never initialises at build time.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import type { ReactElement } from 'react';
import App from './App';

interface HeadEl {
  type: string;
  props: Record<string, unknown>;
  children?: string;
}

/** Convert react-helmet-async server-rendered components into the plugin's head-element shape. */
function toHeadElements(parts: Array<{ toComponent(): ReactElement[] }>): HeadEl[] {
  const out: HeadEl[] = [];
  for (const part of parts) {
    for (const el of part.toComponent()) {
      const props = el.props as Record<string, unknown>;
      const clean: Record<string, unknown> = {};
      let children: string | undefined;
      for (const [k, v] of Object.entries(props)) {
        if (k === 'key' || k.startsWith('data-rh')) continue;
        if (k === 'dangerouslySetInnerHTML') children = (v as { __html?: string })?.__html;
        else if (k === 'children') { if (typeof v === 'string') children = v; }
        else clean[k] = v;
      }
      out.push({ type: el.type as string, props: clean, ...(children != null ? { children } : {}) });
    }
  }
  return out;
}

const ROUTES = ['/', '/services', '/portfolio', '/about', '/faq', '/contact'];

export async function prerender(data: { url: string }) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={data.url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  );

  const h = helmetContext.helmet;
  const elements = new Set<HeadEl>(h ? toHeadElements([h.meta, h.link, h.script]) : []);
  // h.title.toString() returns HTML — its text is already entity-escaped (e.g.
  // "&" → "&amp;"). The prerender plugin escapes head.title AGAIN when it writes
  // the <title>, which produced "&amp;amp;". Decode helmet's entities once here
  // so the plugin's single re-escape yields correct output. Decode &amp; LAST.
  const title = h?.title
    .toString()
    .replace(/<\/?title[^>]*>/g, '')
    .trim()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&amp;/g, '&');

  const { parseLinks } = await import('vite-prerender-plugin/parse');

  return {
    html,
    links: new Set<string>([...ROUTES, ...parseLinks(html)]),
    head: { lang: 'en', title, elements },
  };
}

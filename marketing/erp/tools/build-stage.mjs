// Builds erp/stage.html: one self-contained page (fonts, logos, EstateOS screenshots inlined)
// that tools/render.mjs drives frame by frame. No dependencies.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONT_CSS, logoWhite, WEBSITE } from '../../lib/brand.mjs';

const ERP = join(dirname(fileURLToPath(import.meta.url)), '..');
const kit = (f) => readFileSync(join(WEBSITE, 'public', 'brand-kit', f), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const MARK_INNER = kit('orbit-atom-logomark.svg').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const logoPrimary = (w) => kit('orbit-atom-logo-primary.svg').replace(/width="430" height="104"/, `width="${w}" height="${Math.round((w / 430) * 104)}"`);
const png = (f) => 'data:image/png;base64,' + readFileSync(join(ERP, 'assets', f)).toString('base64');

const css = `
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden;background:#F8FAF9}
body{position:relative;font-family:Inter,sans-serif;color:#1B4332}
body.f916{width:1080px;height:1920px} body.f45{width:1080px;height:1350px} body.f169{width:1920px;height:1080px}
#bg{position:absolute;inset:0;background:
  radial-gradient(900px 700px at 100% 0%, rgba(216,243,220,.9), transparent 60%),
  radial-gradient(800px 700px at 0% 100%, rgba(149,213,178,.35), transparent 60%), #F8FAF9}
#safe{position:absolute;display:flex;flex-direction:column;align-items:center}
.f916 #safe{left:65px;right:65px;top:262px;height:1000px}
.f45 #safe{left:56px;right:56px;top:46px;bottom:46px}
.f169 #safe{left:80px;right:80px;top:44px;bottom:40px}
#brand{align-self:flex-start;height:52px;opacity:.9}
.f169 #brand{position:absolute;left:0;top:6px}
#head{text-align:center;display:flex;flex-direction:column;justify-content:center}
.f916 #head{height:200px} .f45 #head{height:170px} .f169 #head{height:130px}
#hl{font-family:'Clash Display',Inter;font-weight:600;letter-spacing:-.5px;line-height:1.08;color:#1B4332}
.f916 #hl{font-size:62px} .f45 #hl{font-size:56px} .f169 #hl{font-size:60px}
.f916 #hl.long{font-size:52px} .f45 #hl.long{font-size:48px} .f169 #hl.long{font-size:54px}
#sub{font-weight:600;color:#40916C;margin-top:8px}
.f916 #sub,.f45 #sub{font-size:30px} .f169 #sub{font-size:28px}
#stage{flex:1;width:100%;min-height:0}
#cap{display:flex;align-items:center;justify-content:center;width:100%}
.f916 #cap{height:150px} .f45 #cap{height:120px} .f169 #cap{height:104px}
#capt{background:rgba(27,67,50,.94);color:#fff;font-weight:600;border-radius:18px;padding:12px 26px;line-height:1.28;text-align:center;max-width:94%}
.f916 #capt{font-size:42px} .f45 #capt{font-size:38px} .f169 #capt{font-size:36px}
#ui{position:absolute;display:none;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 18px 50px rgba(27,67,50,.22);border:2px solid #D8F3DC}
#ui .bar{height:34px;background:#EEF1EF;display:flex;align-items:center;gap:8px;padding-left:14px}
#ui .bar i{width:12px;height:12px;border-radius:50%;background:#C9D0CB;display:block}
#ui .vp{position:absolute;top:34px;left:0;right:0;bottom:0;overflow:hidden}
#ui img{position:absolute;top:0;left:0;width:100%;transform-origin:30% 20%}
#uitag{position:absolute;left:18px;bottom:16px;background:#1B4332;color:#fff;font-weight:700;font-size:22px;padding:8px 18px;border-radius:999px}
#end{position:absolute;inset:0;opacity:0;background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%)}
#end:after{content:'';position:absolute;inset:0;background:radial-gradient(700px 600px at 85% 15%,rgba(82,183,136,.25),transparent 60%)}
#ein{position:absolute;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;gap:34px}
.f916 #ein{left:65px;right:65px;top:270px;height:980px} .f45 #ein{inset:60px} .f169 #ein{inset:60px 120px}
#ehl{font-family:'Clash Display',Inter;font-weight:600;line-height:1.1;letter-spacing:-.5px}
.f916 #ehl,.f45 #ehl{font-size:52px} .f169 #ehl{font-size:62px}
#ecta{display:flex;flex-direction:column;align-items:center;gap:18px}
.pill{background:#95D5B2;color:#1B4332;font-weight:700;border-radius:999px;padding:18px 36px;font-size:40px}
.url{font-family:'Clash Display',Inter;font-weight:600;font-size:52px}
.cat{font-size:26px;color:#95D5B2;font-weight:600;letter-spacing:.5px}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="f916">
<div id="bg"></div>
<div id="safe"><div id="brand">${logoPrimary(210)}</div><div id="head"><div id="hl"></div><div id="sub"></div></div>
<svg id="stage" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet"></svg>
<div id="cap"><span id="capt"></span></div></div>
<div id="ui"><div class="bar"><i></i><i></i><i></i></div><div class="vp"><img src="${png('eos-leads.png')}"><img src="${png('eos-sale.png')}"></div><div id="uitag">Designed by SynQuanta</div></div>
<div id="end"><div id="ein">${logoWhite(470)}<div id="ehl"></div><div id="ecta"><div class="pill">Tell us about your business</div><div class="url">synquanta.com/erp</div><div class="cat">Custom business systems (ERP)</div></div></div></div>
<script>window.__MARK=${JSON.stringify(MARK_INNER)};</script>
<script>${readFileSync(join(ERP, 'tools', 'stage.js'), 'utf8')}</script>
</body></html>`;
writeFileSync(join(ERP, 'stage.html'), html);
console.log('stage.html', (html.length / 1024).toFixed(0), 'KB');

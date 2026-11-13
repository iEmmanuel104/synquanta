import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Searchable country picker: flag + name. No dependency: names come from
 * Intl.DisplayNames, flags are small SVGs from flagcdn.com (emoji flags don't
 * render on Windows). The stored value is the English country name.
 */
const CODES =
  'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(' ');

// Markets we hear from most, shown first.
const TOP = ['NG', 'GB', 'US', 'AE', 'GH', 'KE', 'ZA', 'CA'];

const names = (() => {
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    /* very old browser: fall back to codes */
  }
  return Object.fromEntries(CODES.map((c) => [c, dn?.of(c) ?? c])) as Record<string, string>;
})();

const SORTED = [...CODES].sort((a, b) => names[a].localeCompare(names[b]));

/** Best guess from the browser locale, e.g. en-NG → NG. */
const guess = () => {
  try {
    for (const l of navigator.languages ?? [navigator.language]) {
      const r = new Intl.Locale(l).maximize().region;
      if (r && names[r]) return r;
    }
  } catch {
    /* ignore */
  }
  return '';
};

const Flag = ({ code }: { code: string }) => (
  <img
    src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
    alt=""
    width={22}
    height={16}
    loading="lazy"
    className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover ring-1 ring-black/10"
  />
);

export const CountrySelect = ({
  value,
  onChange,
  label,
  optional,
  autoDetect = true,
}: {
  value: string;
  onChange: (name: string, auto?: boolean) => void;
  label: string;
  optional?: boolean;
  autoDetect?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  const code = useMemo(() => CODES.find((c) => names[c] === value) ?? '', [value]);

  // Pre-fill once from the browser locale (client only, so prerender stays stable).
  useEffect(() => {
    if (autoDetect && !value) {
      const g = guess();
      if (g) onChange(names[g], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s) return SORTED.filter((c) => names[c].toLowerCase().includes(s) || c.toLowerCase() === s);
    return [...TOP, ...SORTED.filter((c) => !TOP.includes(c))];
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    requestAnimationFrame(() => search.current?.focus());
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const pick = (c: string) => {
    onChange(names[c]);
    setOpen(false);
    setQ('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (options[active]) pick(options[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative mb-4 flex flex-col gap-[7px]">
      <span id={`${id}-l`} className="text-[13px] font-semibold text-neutral-charcoal">
        {label} {optional && <span className="font-normal text-neutral-light-gray">(optional)</span>}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-l`}
        onClick={() => {
          setOpen((o) => !o);
          setActive(0);
        }}
        className="flex w-full items-center gap-3 rounded-sq-lg border-[1.5px] border-cream-green bg-neutral-off-white px-3.5 py-3 text-left text-[15px] text-forest-deep outline-none transition-all duration-200 focus:border-sage-medium focus:bg-white focus:ring-4 focus:ring-sage-light/20"
      >
        {code ? <Flag code={code} /> : null}
        <span className={`flex-1 truncate ${code ? '' : 'text-neutral-light-gray'}`}>{code ? names[code] : 'Select your country'}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-neutral-medium-gray transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="overflow-hidden rounded-sq-lg border border-cream-green bg-white shadow-sq">
          <div className="border-b border-cream-green p-2">
            <input
              ref={search}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKey}
              placeholder="Search countries"
              aria-label="Search countries"
              aria-controls={`${id}-list`}
              aria-activedescendant={options[active] ? `${id}-${options[active]}` : undefined}
              className="w-full rounded-lg bg-neutral-off-white px-3 py-2.5 text-[15px] text-forest-deep outline-none placeholder:text-neutral-light-gray focus:ring-2 focus:ring-sage-light/40"
            />
          </div>
          <ul ref={list} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-l`} className="max-h-64 overflow-y-auto py-1">
            {options.length === 0 && <li className="px-4 py-3 text-sm text-neutral-medium-gray">No match</li>}
            {options.map((c, i) => (
              <li
                key={c}
                id={`${id}-${c}`}
                data-i={i}
                role="option"
                aria-selected={c === code}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(c)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] ${
                  i === active ? 'bg-mint-pale/60' : ''
                } ${c === code ? 'font-semibold text-forest-deep' : 'text-neutral-charcoal'} ${
                  !q && i === TOP.length - 1 ? 'border-b border-cream-green' : ''
                }`}
              >
                <Flag code={c} />
                <span className="truncate">{names[c]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

# Client logos

The five marks shown in the `RecentWork` strip on the home page. Each was taken
from that company's own website.

| File | Client | Notes |
|---|---|---|
| `fundedforge.png` | Funded Forge | Gold mark and wordmark |
| `gritgateway.svg` | GritGateway | Circular icon, not a wordmark |
| `blkat.svg` | BlackAt | Black "BLK" + red "@" |
| `busy2shop.png` | Busy2Shop | Full colour |
| `nevelline.png` | Nevelline | Black wordmark |

## These are not our marks

They belong to the clients. They appear here to identify work we did, which is
what `/terms` §3 says. That is the whole basis for showing them — nothing here
implies endorsement, and none of these companies is a party to our terms. If any
of them asks us to stop, remove the file and drop the `logo` field from that
entry in `src/constants/portfolio.ts`.

## Why white tiles

The set has mixed polarity: BlackAt's mark is black-and-red, Funded Forge's is
gold, Nevelline's is a black wordmark. A white tile is the one background all
five read against, and it avoids recolouring anyone's mark to force visual
consistency. Do not put these directly on the section background.

**Use `blkat.svg`, never a white/reversed BlackAt variant.** A `blkat-light.png`
was downloaded alongside it and deleted: it is white-on-transparent, so it
disappears completely on the white tiles. Same reasoning for GritGateway — the
`.svg` is used; a dark-circle `.png` variant was removed to stop anyone reaching
for the wrong file.

## Gap

Exact source URLs were not recorded when these were downloaded. Everything else
in `public/images/CREDITS.md` carries a photo page and a photographer; these do
not. If we ever need to prove where a mark came from, that has to be traced
again from each company's site.

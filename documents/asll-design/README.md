# asll-design — design pipelines

| Folder | Direction | Purpose |
|---|---|---|
| `design2figma/` | HTML board export → Figma | Imports a Claude Design board export into a Figma file page as editable layers, one capture per section, with count-based verification. Driven by the `/design-to-figma` skill. Committed. |
| `figpipeline/` | Figma `.fig` → HTML | Renders the client's Figma baseline to HTML for review and gap-closure work. Local only (confidential context). |
| `figma-batches/` | Figma scripts | `use_figma` batch scripts for the gap-closure page. Local only. |

Only `design2figma/` is tracked in git; everything else under `documents/` stays local.

# Image Credits

All images below are royalty-free and licensed for commercial use with **no attribution legally required**. Credits are recorded here for our own records and good practice. Sourced only from Unsplash, Pexels, and Pixabay.

| File | Source | Photo page | Photographer / Author | License |
|------|--------|-----------|----------------------|---------|
| `hero-abstract.jpg` | Pexels | https://www.pexels.com/photo/aurora-borealis-1933239/ | Tobias Bjørkli | Pexels License |
| `services-workspace.jpg` | Unsplash | https://unsplash.com/photos/turned-on-gray-laptop-computer-OqtafYT5kTw | Domenico Loia | Unsplash License |
| `products-stadium.jpg` | Unsplash | https://unsplash.com/photos/people-watching-soccer-game-in-stadium-during-daytime-_PriC_5bdvw | Mitch Rosen | Unsplash License |
| `products-city.jpg` | Unsplash | https://unsplash.com/photos/aerial-photography-of-city-buildings-during-golden-hour-jbtfM0XBeRc | Patrick Tomasso | Unsplash License |
| `portfolio-texture.jpg` | Pexels | https://www.pexels.com/photo/worms-eyeview-of-green-trees-957024/ | Felix Mittermeier | Pexels License |
| `faq-texture.jpg` | Pexels | https://www.pexels.com/photo/green-and-brown-forest-132428/ | Pixabay (contributor) | Pexels License |
| `contact-texture.jpg` | Unsplash | https://unsplash.com/photos/aerial-view-of-ocean-waves-hitting-the-shore-NWoBuClstZ8 | (aerial ocean waves) | Unsplash License |
| `ad/building.jpg` | Pexels | https://www.pexels.com/photo/close-up-of-hands-typing-on-keyboard-at-night-31421513/ | Abdelrahman Ahmed | Pexels License |
| `ad/planning.jpg` | Pexels | https://www.pexels.com/photo/574071/ | Lukas Blazek | Pexels License |
| `ad/workspace.jpg` | Pexels | https://www.pexels.com/photo/moody-workspace-with-keyboard-and-gadgets-34110027/ | Justin Rieta | Pexels License |

## Notes
- Images are sized and re-encoded server-side via the CDN's own width/quality parameters (Unsplash `w=&q=&fm=jpg`, Pexels `w=&auto=compress`). All files are JPEG, longest edge ≤ 2400px, and under ~500 KB. (An earlier version of this note said no image tooling was installed — that is now out of date: `sharp` is a devDependency and ImageMagick 6 is on the machine.)
- **`ad/` images** back the advertising creative in `marketing/`. Same three approved sources, plus three selection rules. The first two are hard blocks; the third is judgement, and it is where most candidates actually die:
  1. **No clearly recognisable faces.** Hands, backs of heads and out-of-focus figures are fine.
  2. **No third-party branding.** Brand logos, wordmarks, or a recognisable app interface. A phone shot showing TikTok was rejected on this. Note that a real phone photographed in real use almost always carries branding somewhere — a visible interface realistically needs a mockup, not stock.
  3. **Readable text is allowed only when it is subject matter, not a message.** Generic *code* on a monitor passes: it reads as texture and says nothing. Sticky notes and whiteboards do not — two candidates were rejected for fully readable "Testing"/"Complete"/"How-To" lettering, which competes with the ad's own words and tends to come with bright, high-key lighting the dark overlay cannot absorb.

  Rule 3 supersedes an earlier, blunter phrasing of "on-screen text must not be readable", which would have excluded the code-on-monitor shot that is actually in use.
- All chosen images avoid prominent brand logos and clearly recognizable human faces. The stadium is a distant wide shot; the city skyline is a generic aerial with no readable close-up signage.
- License summaries:
  - **Unsplash License** — free to use commercially, no permission/attribution needed; cannot sell unaltered copies or build a competing stock service.
  - **Pexels License** — free to use commercially, no attribution needed; cannot sell unaltered copies or imply endorsement by depicted people/brands.
  - **Pixabay License** — free to use commercially, no attribution needed (none of the final selection are from Pixabay, but it remains an approved source).

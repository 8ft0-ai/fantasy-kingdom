ANNALS — a living kingdom in a single file
Working title behavior: the app titles itself per seed — "The Annals of Vaelmere", "The Annals of Osterholt" — because the central conceit is that you are watching a history write itself. The kingdom is the simulation; the Chronicle is the soul.
1. Vision
A procedurally generated fantasy kingdom rendered in real-time 3D that you can watch for five minutes or five hours. Zoom from a satellite view of the whole realm down to a market stall with laundry on the line. Time runs; harvests come in; caravans crawl the roads; a queen dies without a clear heir and two great houses raise banners; plague follows the trade routes; a dragon notices the treasury has gotten large. Everything that happens is written into a scrolling Chronicle in the voice of a medieval annalist, and a cinematic auto-director flies the camera to the story as it unfolds.
Four pillars, in priority order:
Legible emergence. Systems couple visibly: drought → failed harvest → hunger → unrest → rebellion. A viewer should be able to reconstruct cause from effect just by watching.
Zoom is the reward. Every altitude has something worth seeing — political geography at 3 km, trade arteries at 800 m, street life at 40 m.
The Chronicle is the product. Named people, named places, consequences that persist (ruins, grudges, epithets). The sim generates a story you could retell.
Watchable by default. With zero input it should behave like a nature documentary about a kingdom.
2. Hard constraints
Single HTML file, vanilla JS + Three.js from CDN (write against the r128 API surface so the same file runs as a Claude artifact during development and unchanged on Netlify). No build step, no framework, no backend.
Custom camera controller (no OrbitControls dependency — we need a bespoke rig anyway, see §5).
No localStorage / sessionStorage. Persistence is the seed: URL hash #s=1234567 fully determines the generated world. "Copy link" button shares it. Optional "Export chronicle" downloads a .txt.
Deterministic worldgen via seeded sfc32 RNG with separate streams for generation and history, so intervening in history never changes the map.
Performance floor: 60 fps on a mid-tier laptop at every altitude; <250 draw calls via instancing and merged geometry; graceful degradation, never a crash.
Everything procedural — no external textures or models. Vertex colors, tiny generated canvas atlases (windows, sigils), and shader work carry the visuals.
3. World generation pipeline
Runs once per seed, in order, with a brief "forging the realm" progress line:
Terrain. 6×6 km world. fBm heightmap with domain warping; one mountain spine, rolling lowlands, ~40% of seeds get a coastline on one edge.
Hydrology. Flow accumulation carves one major river (always) plus tributaries; lakes in basins; river mouths become harbor candidates.
Biomes. Moisture × elevation → meadow, farmland-suitable plain, deciduous forest, pine upland, rocky peak, marsh. Drives tree instancing, ground vertex color, and resource nodes (farmland, forest, ore vein in rock, fishing water).
Settlement siting. Score cells by water access, flat buildable area, resource adjacency, harbor bonus. Place 1 capital (pop ~2,500), 2–3 towns (400–1,200), 3–5 villages (60–300). Capital gets a keep on defensible high ground and a walled old core.
King's roads. A* over a cost field (slope² penalty, water crossing penalty that spawns bridges, forest penalty) connecting all settlements into a network. Roads are the circulatory system — trade, armies, plague, and bandits all use them.
Streets & lots. Inside settlements, organic street growth seeded from the road entry points and the market square; lots subdivide along streets; districts assigned (market, artisan, residential, temple, keep). Villages are a crossroads, a well, and a cluster.
Buildings. ~2,500–4,500 total from 12 archetypes × 3 tiers (hovel→timber→stone): house, longhouse, shop, smithy, mill (animated wheel on watercourses), granary, tavern, temple, warehouse, tower, wall segment/gate, keep. Procedural assembly: footprint, floors, roof style, chimneys, timber-frame overlay at tier 2+, hanging signs on shops.
Names & heraldry. One coherent phonology: places from syllable banks with earthy suffixes (-mere, -ford, -holt, -caster, -wyck); people from gendered given-name banks; great houses take a place or beast name. Procedural sigils = field color pair + one charge from a bank of 16 (stag, tower, wave, oak, wolf, comet, key, sun…), rendered to a small canvas atlas and used on keep banners, army flags, and UI chips.
The cast. Crown dynasty (monarch, consort, children) + 5 great houses, each holding a region and seat. ~100–140 living notables at any time (see §7).
4. Rendering, LOD & visual style
Aesthetic: illuminated-manuscript storybook. Low-poly forms with painterly vertex-color gradients — not flat-shaded minimalism, not photorealism. The world should look like the marginalia of a chronicle came to life. One directional sun/moon light with a tight camera-tracking shadow frustum (shadows fade out above 1,500 m altitude), height + distance fog for depth, custom gradient sky dome with sun, moon, stars, and the occasional comet.
Water: gerstner-lite vertex displacement + fresnel tint on rivers, lakes, sea. Rivers visibly swell during floods.
Day/night: full cycle; nights are deep indigo with warm emissive windows (per-instance emissive flag in the bubble band), pooled torch/lamp point lights (≤12), keep braziers.
Seasons (90 days each, 360-day year): global palette lerp + effects. Spring: saturated greens, snowmelt-fat rivers. Summer: warm golds (drought pushes to straw-yellow). Autumn: russet forest ramp. Winter: snow accumulation via normal-up whitening in the ground/roof shaders, snowfall particles, frozen lake tint.
Weather: clear/overcast/rain/storm/snow state machine; rain streak particles, wet-darkened ground tint, storm lightning flashes. Weather is mechanical, not just decorative (fire spread, battle modifiers, flood meter).
Ambient life: chimney smoke curls, birds (cheap boid flock), grazing sheep sprites near farms, banner cloth idle-wave shader, market crowd murmur of villagers in the bubble band.
LOD bands (camera distance to object):
Band
Range
Buildings
Agents
Detail
Far
>2,200 m
merged/instanced color-block masses per district
armies → banner icon, caravans → moving dot
settlement name labels, territory tint
Mid
500–2,200 m
instanced archetype meshes
full low-poly agent meshes
instanced trees, roads, bridges
Near
120–500 m
+ chimneys, signs, timber overlays
walk-bob animation
wells, carts, market stalls
Bubble
<120 m
+ per-instance window glow, laundry lines, lamps
citizens spawn (≤80), individual heads turn
prop shadows, torch lights
Citizens outside the bubble do not exist as entities — they're statistics (§7). The bubble makes the zoom promise real without simulating 8,000 pedestrians.
UI skin: parchment panel (#E9DCC3) with iron-gall ink text (#2B2320), crown-gold accents (#C9A227), house colors from sigils. Chronicle set in a period serif (IM Fell English or similar via Google Fonts, with graceful serif fallback); UI labels in a clean humanist sans. Trigger buttons read like acts, sentence case, active voice: "Unleash plague," "Bless the harvest," "Contest the succession."
5. Camera & interaction
Custom rig with three modes, all sharing one smoothed spring-damper transform:
Free: orbit + pan + scroll zoom along a curved altitude path — high altitude looks steeper (map-like), low altitude tilts toward the horizon (street-like). Zoom range ~5 m to ~4,000 m. Terrain collision keeps the camera out of the ground.
Follow: click any agent (caravan, army, notable, dragon) → low tracking shot with slight lead. Click empty ground to release.
Director: see §13.
Raycast click on anything selectable opens the Inspector (§15). Hotkeys: Space pause, 1–4 speeds, H hide UI, C Watch mode, Esc deselect.
6. Simulation architecture
Clock: SimClock in fractional days. Fixed-step accumulator; 1 tick = 1 sim-day of system logic. Speeds: pause / 0.5 / 2 / 8 / 30 sim-days per real second (at max, a year passes in 12 seconds — a monarch's reign in ~10 minutes).
System order per tick: Weather → Economy → Population → Politics → Military → Threats → Growth → Chronicle flush.
Render decoupling: agents store path + departure/arrival sim-times; the render loop interpolates positions every frame from current sim-time, so motion is smooth at any speed and nothing "teleports."
Stability rule: every positive feedback loop ships with a predator. Growth ↑ → land scarcity and food pressure. Treasury ↑ → dragon and bandit attention. Military strength ↑ → upkeep drain. House power ↑ → crown suspicion events. Target: after 200 unattended sim-years at defaults, population and treasury remain within sane bounds and the realm is still interesting.
Pacing target: a Chronicle-worthy event every 15–45 sim-days at default rates (tunable via the Disaster frequency and House aggression sliders).
7. Population & notables
Two-layer model (the Crusader Kings trick):
Pools: each settlement tracks population as a number with birth/death/migration rates modified by food, plague, war, prosperity. Pools drive building growth, levy size, tax income, and bubble-band citizen density.
Notables: ~100–140 named characters — the dynasty, house heads and their families, plus flavor roles (High Priest, Master of Coin, a famous smith, a bandit king when one arises, a prophet at Myth High). Notables have: age, sex, house, 2 traits (from ~16: bold/craven, just/cruel, shrewd/dull, pious/cynical, fertile, sickly…), relationships (spouse, heirs, grudges), and an agenda line. They age, marry (arranged for alliance value), have children, and die by an age hazard curve plus event hazards (battle, plague, childbirth, the occasional hunting accident, assassination). Deaths and births are Chronicle events; important ones are Director beats.
8. Economy & trade
Legibility over realism. Seven goods: grain, fish, timber, ore, tools, cloth, wine.
Settlements produce by geography (farmland → grain, forest → timber, ore vein → ore, harbor → fish; towns convert ore+timber → tools, capital produces cloth/wine), consume by population, and store in granaries/warehouses.
Local prices from stock vs. need; caravans (mule train meshes, up to ~36 concurrent) spawn to arbitrage price gaps along roads; coastal cogs (up to 8) trade between harbor settlements. Trade volume is visible traffic — the kingdom's health readable at a glance.
Treasury: crown taxes trade and harvests (default 12%); spends on army upkeep, disaster relief, bounties, rebuilding. Treasury funds war; war disrupts trade; disrupted trade starves treasuries.
Hunger cascade: food deficit → granary drawdown → hunger → mortality up, unrest up, migration out. Drought, plague, siege, and raided caravans all feed this one legible pipeline.
9. Dynasty, houses & politics
Succession: gender-blind primogeniture. Heirs need to survive to inherit; a monarch dying with no adult heir triggers a regency (unrest up, house aggression up) or, with rival claimants, a succession crisis.
Legitimacy (0–100) on the crown: raised by coronations, victories, festivals, dragon-slaying; lowered by lost wars, famines under their rule, assassinations, dark omens at Myth High.
House loyalty (0–100 each): drifts with tax rate, shared wars, royal marriages (arranged automatically for alliance value; weddings are festival events), slights and grudges (event-driven), and monarch traits.
Unrest per settlement from hunger, taxes, war, plague, omens → riots (small fires, trade pause) → revolt (settlement flips banner) at extremes.
Civil war trigger: loyalty <30 on a house with military strength + a spark (succession crisis, famine year, tax hike, "Contest the succession" button). Houses declare for sides based on loyalty, marriages, and grudges. Territory overlay animates as banners change.
10. War
Armies: levies raised from settlement pools (strength = f(population, prosperity, walls)); an army is one entity rendered as up to ~300 instanced soldiers with banner (banner-blob icon beyond 800 m). Armies march along roads at ~15 km/sim-day, eat supply, and are gorgeous to follow in Follow cam.
Battles: armies within contact on the same route → 2-sim-day abstract resolution in three phases (skirmish/clash/rout) with visible melee shuffle, arrow arcs, dust, and casualties trickling both pools. Odds from strength × morale × terrain × weather × commander valor. Loser routs toward home; named commanders can die or win epithets ("Aldric the Ironhand").
Sieges: army adjacent to a walled settlement pitches a visible camp (tents, campfires, a trebuchet at scale). Countdown = f(walls, granary, season); sorties and assaults roll on commander boldness. A fallen settlement is sacked (prosperity hit, fire risk, chronicle lament) or occupied (banner flips).
War score from battles, sieges, and months held; at ±100 or exhaustion → peace: new dynasty, exiled house (their sigil struck through in the Houses panel), ceded territory, or a hollow status quo. Ruins and burned districts persist and rebuild over years. Battlefields get a small cairn marker with a tooltip naming the battle. Scars are content.
11. Threats & disasters
Each threat is a coupling into existing systems, not a standalone effect:
Plague: SIR-lite per settlement; imported by caravan arrivals from infected origins (the trade network is the infection network). Virulence and lethality sliders. Visible: pyre smoke columns, district desaturation, tolling pace of the Chronicle. Settlements above 15% infected refuse caravans — emergent quarantine that visibly starves trade.
Great fire: ignition (lightning, riot, sack, drunk smith, trigger) spreads through the building adjacency graph, biased by density, dryness (drought!), and wind direction; rain suppresses. Burned lots → charred ruins → rebuild timer gated on prosperity.
Flood: winter snowpack meter; heavy melt + spring storms swell the river 1.5× width, damaging riverside lots and bridges.
Drought: summer event; harvest ×0.4, grass palette to straw, fire dryness up → feeds the hunger cascade.
Earthquake: rare; camera shake, 2–8% of buildings near epicenter to rubble, secondary fires.
Bandits: camps spawn in forest far from patrol coverage when unrest is high or war rages; visible caravan ambushes (train halts, scuffle, goods lost); crown posts bounties and dispatches patrols → skirmish → camp cleared or a Bandit King notable emerges if ignored.
The dragon (Myth ≥ Low): lairs in the highest peak at worldgen. Wake probability scales with treasury size. A raid is a Director-mandatory beat: wide glide in, torches a district (reuses fire system), takes gold, returns. The crown responds per monarch valor — muster and attempt a slaying (victory = hoard windfall + "Dragonslayer" epithet + legitimacy surge; failure = a dead king) or pay tribute (treasury drain, 5 years' peace).
Omens: comet (visibly crosses the sky), eclipse (real-time lighting event), red moon, two-headed calf. At Myth Low they move unrest and flavor the Chronicle; at Myth High they have mechanical teeth (a comet year multiplies event rolls) and a wandering prophet notable may appear.
Myth dial (Off / Low / High, default Low) lets the same engine serve grounded-medieval and high-fantasy moods.
12. The Chronicle
A scrolling parchment panel writing dated entries in annalist voice via a template grammar with slots, tone variants, and occasional editorializing ("…and some say the comet foretold it"). Entry classes: births/deaths/marriages/coronations, harvests and famines, trade and founding, war declarations/battles/sieges/peaces, disasters, omens, bandit and dragon affairs, festivals.
Every entry is clickable → camera flies to the location (if it still stands; else to the ruin or cairn).
Reign headers divide the scroll: "Here begin the years of Queen Maelis, second of her name."
Filter chips (Crown / War / Trade / Fates). Export button saves the full annals as .txt — a shareable artifact of the run.
Core is fully local (no API). Optional enhancement when running as a Claude artifact: a "Illuminate this entry" button that expands one entry into a paragraph via the API — omitted from the Netlify build.
13. The auto-director
The feature that makes it fascinating to watch. An event bus emits beats with priorities (dragon raid 10, war declared 10, coronation 9, battle 8, great fire 8, plague arrival 7, royal wedding 6, founding 6, caravan ambush 5, festival 3). The director:
Holds shots 8–20 s with eased fly-to transitions; per-category cooldowns prevent fire-fixation; higher priority interrupts lower.
Uses shot grammar: wide establishing → push-in on the subject; low tracking shots for marches and caravans; slow orbit for sieges and festivals; high wide for territory flips.
When idle, drifts between golden-hour establishing orbits of settlements.
Renders a lower-third beat card with the Chronicle line for the current shot.
Watch mode (C): hides all panels except the date and beat card. This is the screensaver-documentary mode — the whole app collapses to pure spectacle. Any manual camera input politely suspends the director for 30 s.
14. Control panel
Left drawer, four tabs.
Time (always visible in HUD): ⏸ ▶ ▶▶ ▶▶▶ ▶▶▶▶ mapping to 0 / 0.5 / 2 / 8 / 30 sim-days per second.
Rates — sliders, ×0.25–×4.0 multipliers, default ×1.0 unless noted:
Slider
Governs
Harvest yield
food production
Birth rate / Mortality
population pool dynamics
Trade volume
caravan/cog spawn rate
Tax rate (5–30%, default 12%)
treasury vs. loyalty & unrest
Plague virulence / lethality
β and death fraction
Disaster frequency
lightning, quake, flood, drought rolls
Bandit activity
camp spawn & raid rate
House aggression
loyalty drift & war appetite
Royal fertility
dynasty robustness (low = succession drama)
Myth
Off / Low / High
Acts — trigger buttons (⌖ enters cursor-placement mode): Unleash plague ⌖ · Start a great fire ⌖ · Flood the river · Declare a drought · Earthquake ⌖ · Wake the dragon · Raise a bandit camp ⌖ · Assassinate the monarch · Contest the succession · Arrange a royal marriage · Bless the harvest · Send a comet · Found a village ⌖ · Grant 5,000 gold · Raze building ⌖.
Overlays (one at a time, ground-projected tint + line layers): Territories (house colors, borders animate during war) · Trade (flow lines, width = volume) · Prosperity heat · Plague spread · Unrest · Terrain.
World: seed field + Reforge · Copy share link · Export chronicle · Toggle labels · Watch mode.
15. HUD & inspector
Top strip: date & season glyph · weather icon · monarch name + sigil chip · treasury · realm population · time controls. Right: the Chronicle scroll. Left: control drawer (collapsible). Everything hides with H.
Inspector card (raycast click): buildings (name, type, tier, household count, stored goods); settlements (population, prosperity, unrest, food stores, walls, garrison, banner); notables (sigil, age, traits, spouse/heirs, grudges, current agenda); armies (strength, morale, supply, commander); caravans (route, cargo, value); the dragon (name it — dragons deserve names — mood, hoard). A compact Houses panel shows the five sigils, loyalty bars, and the line of succession — enough dynastic legibility without a full family-tree UI.
16. Data model sketch
Plain objects, no classes-for-their-own-sake:
World { seed, heightmap, biomes, rivers[], settlements[], roads[], houses[], notables[], armies[], caravans[], threats[], clock, treasury, legitimacy }
Settlement { name, pos, pop, prosperity, unrest, stores{7}, walls, district[], buildings[], owner(house), infected{S,I,R} }
Building { archetype, tier, lot, state(sound|burning|ruin|rubble), emissive }
House { name, sigil, seatSettlement, loyalty, might, wealth, grudges{} }
Notable { name, house, age, sex, traits[2], spouse, heirs[], role, agenda, alive }
Army { house, strength, morale, supply, commander, path, departT, arriveT }
Caravan/Cog { origin, dest, cargo, value, path, departT, arriveT }
Event { day, class, priority, pos, actors[], text } → feeds Chronicle + Director.
Systems are pure-ish functions over World called in tick order. One rand(stream) gateway for all stochastic draws.
17. Explicit non-goals (cut list)
No per-commoner simulation beyond bubble ambience. No naval combat (cogs are traders). No building interiors. No history replay or save-states (the seed regenerates year 0; the exported chronicle is the record). No diplomacy UI beyond marriages and loyalty. No frameworks, no server, no assets. Battles resolve abstractly under good visual dressing — this is a chronicle, not a wargame.
18. Build phases (each ships a runnable artifact)
Phase
Scope
Acceptance
1 — The Land
Gen pipeline, terrain/water/sky, roads & bridges, buildings + full LOD, camera rig, day/night, seasons, seed URL
Fly from 3 km to a market stall at 60 fps; two seeds feel like different countries
2 — The Wheel
Clock & speeds, economy, caravans & cogs, population pools, settlement growth/decay, HUD, inspector, Chronicle v1, Rates panel
Left at ▶▶▶ for 10 min: visible growth, ≥15 chronicle entries, no runaway values
3 — The Crown
Notables & dynasty, houses & heraldry, loyalty/legitimacy/unrest, succession, civil war, armies/battles/sieges, territory overlay, political Acts
"Assassinate the monarch" with rival heirs → war within a sim-year, visible marches, a peace, and a coherent chronicle arc
4 — The Fates
Disaster suite, bandits, dragon & Myth dial, omens, auto-director + Watch mode, remaining Acts/overlays, ambient audio (optional), perf pass
The five-minute test
19. Acceptance: the five-minute test
Defaults, speed ▶▶▶, no input. Within 5 minutes a viewer sees: a season change; ≥8 chronicle entries including ≥1 named-character event; ≥1 visible incident (fire, ambush, omen, festival) that the director covers; and at least one district visibly grow. Within 30 minutes: a succession or a war. After 200 unattended sim-years: population, treasury, and house count remain in sane bounds and the realm is still producing story.
If the five-minute test passes, the thing is fascinating to watch. Everything above serves that sentence.

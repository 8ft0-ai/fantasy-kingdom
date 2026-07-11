# Issue #12 validation

This document maps the completed economy implementation to the issue acceptance criteria. The work builds on the seven-goods and road-caravan slice already delivered in PR #54.

## Existing implementation retained

- Seven goods per settlement: grain, fish, timber, ore, tools, cloth and wine.
- Geography-driven grain, fish, timber and ore production.
- Capital and town production of cloth and wine.
- Stores, needs, stock-sensitive prices and road-based arbitrage.
- Bounded caravan records and visible moving markers.
- Customs revenue, settlement inspection and Chronicle shortages.
- Drought production penalties, plague quarantine and bandit cargo loss.

## Completion work

### Production and conversion

- Tool output now consumes actual ore and timber inputs.
- Conversion retains local reserves before consuming raw materials.
- Conversion totals expose tools produced, ore consumed and timber consumed.
- Cloth and wine remain bounded settlement-type luxury production.

### Road caravans and coastal cogs

- Road candidates continue to use price spread, surplus, deficit and route length.
- Cog candidates use the same stock and price logic between cog-capable coastal settlements.
- Cogs follow a procedural offshore route and are rendered with a generated hull, mast and sail.
- Trade records identify road or cog mode, departure spread, cargo, progress and disruptions.
- Road and cog arrivals share customs, plague transmission and bounded registry behaviour.

### Taxation and spending

- Trade customs continue to collect at the configured tax rate.
- An annual autumn harvest tithe taxes physical grain and fish production into the crown treasury.
- Tax rates above the baseline raise settlement unrest and reduce non-ruling-house loyalty.
- Low rates apply modest loyalty relief.
- Spending accounts track:
  - army upkeep and provisioning;
  - grain relief;
  - bandit bounties and patrols;
  - rebuilding costs.
- Underfunded armies lose supply and morale.

### Hunger cascade

- Food cover is measured in days against grain and fish need.
- Severe deficits produce mortality, migration and additional unrest.
- Migrants prefer connected settlements with stronger food cover and open gates.
- Chronicle entries record the source settlement, destination and material consequences.
- Population and stores remain clamped to existing world bounds.

### Disruption

- Drought reduces food production.
- Plague quarantine prevents new trade and records economic disruption.
- Bandit camps remove cargo and delay road deliveries.
- Active wars consume treasury, grain and tools, and can remove cargo and delay road or sea trade.
- Disruption totals remain inspectable by type.

## User-visible acceptance

Settlement inspection shows:

- all seven stores and prices;
- production and daily need for every good;
- food-cover days;
- road-only or cog-capable port status.

Trade inspection shows:

- caravan or cog mode;
- route and cargo;
- departure price gap;
- arrival date and progress;
- war, bandit or plague-related disruption flags.

The Rates panel shows:

- trade-tax control;
- treasury and customs;
- harvest-tax revenue;
- road and cog arrivals;
- spending by category;
- migration and mortality;
- disruption counts.

## Automated acceptance

`.github/scripts/economy-smoke.mjs` runs the economy for 18,000 simulated days—50 years—on seeds:

- `1234567`
- `987654`
- `424242`

For each seed it requires:

- exactly the seven defined goods;
- finite stores, prices, treasury and population values;
- store, price, population and trade-registry bounds;
- at least one completed road caravan and high-value arbitrage arrival;
- a completed cog voyage when the realm has at least two ports;
- real ore and timber consumption for tools;
- hunger mortality and migration;
- harvest-tax revenue and treasury spending;
- war, plague, bandit and drought disruption evidence;
- higher tax revenue accompanied by lower loyalty and higher unrest;
- complete settlement and Rates-panel UI fields;
- no console or page errors.

Across the maintained seeds, at least one naturally generated two-port coastal realm must complete a cog voyage.

## Repository checks

The closure PR must pass:

1. Verify generated runtime.
2. Browser smoke, including the 50-year economy pass.
3. Chronicle regression.
4. Long-run soak through 200 years.

## Constraints preserved

- One generated `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No framework, backend, persistence or external media assets.
- Deterministic URL-seed behaviour.
- Bounded trade, Chronicle and simulation registries.
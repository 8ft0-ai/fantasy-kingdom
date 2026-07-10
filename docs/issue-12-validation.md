# Issue #12 validation

This PR delivers a partial but coherent economy slice.

- Seven goods are stored and priced per settlement: grain, fish, timber, ore, tools, cloth and wine.
- Production is tied to nearby farmland, fishing water, forest, ore and settlement type.
- Tools consume ore and timber; capital and towns produce cloth and wine.
- Bounded caravans move goods from surplus to deficit settlements over existing roads.
- Trade arrivals increase destination stores and collect customs into the treasury.
- Food scarcity raises prices, hunger and unrest and emits Chronicle consequences.
- Settlement inspection shows all stores and prices.
- Headless summaries expose treasury, trade counts, bounds, stores and prices.

Follow-up scope remains for coastal cogs, user-adjustable tax controls, war/plague/bandit disruption and a dedicated 50-year economy soak workflow.

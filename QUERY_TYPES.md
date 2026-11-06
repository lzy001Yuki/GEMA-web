# Con-Q query-type provenance

Website query types were audited against the supplied benchmark generators, rather than inferred from result plots.

## Sequential / LIBERO Goal3

Source: `../benchmarks/Agentic-Eval/scripts/goal3_query_stream.py`, especially `query()` and `next_chunk()`, and `generate_goal3_nested_queries.py` for the bootstrap.

- `drawer_move`: store from table, retrieve to table, transfer between drawers. Wording may refer to the drawer containing another object or where the item was last stored.
- `plate_put`: put the selected object on the plate.
- `plate_return`: return to its original table spot or the drawer it came from.
- Interruption/resumption are event sequences, not an additional `kind`: pause a parent drawer task, execute plate placement and return, resume the parent. The bootstrap includes nested interruptions.

The website example is a direct instance of the English `plate_return` template.

## Spatial / LIBERO dual cabinet

Source: `../benchmarks/Agentic-Eval/scripts/generate_dual_cabinet_queries.py`, `generate()`.

This generator stores object/from/to and event metadata rather than a query-kind enum. The website groups its instruction templates:

- Store, retrieve, and relocate among two cabinets / six drawers, object-specific home positions, and the fixed plate (plate targets are limited to butter and chocolate pudding).
- Paired return to the location before plate placement (`return_of`).
- Historical destination references: the drawer just vacated by another object or vacated in a numbered earlier query.
- Nested interruption/resumption, encoded in parent links and events.

The website example translates Q11: 把蓝碗移到红碗刚刚腾出的那层抽屉，关好涉及的抽屉。

## Semantic / RoboCasa orders

Source: `../benchmarks/Agentic-Eval/scripts/generate_robocasa_order_queries.py`, `iter_queries()` / `execute()`.

Six exact `kind` values: `add`, `remove`, `transfer`, `cancel`, `restock`, `restore`. The website groups add/remove and transfer/cancel for readability. `restore` recovers an order's item set at a specified prior completed query, removes excess items to returns, restores missing items, and preserves the other order. It does not require exact historical poses. This setting has no interruption events.

## Scope

These describe the available generator grammar, not frequencies in an evaluated cohort or claims of qualified physical execution. The curated dual-cabinet generator identifies its validation as logical only. Unlike older figure labels, these supplied generators do not define separate offset-placement or drawer-swap query types; the website does not list them.

# Technical catalog review

All 10,435 original SKUs are processed individually by productTechnicalData.ts. Original names, sizes, warehouse codes, financial fields and image bindings are preserved.

Coverage: 948 SKUs with matching profile-reference enrichment; 4,387 with a readable model/designation extracted from the catalog; 5,100 requiring model identification. None of these counts certifies the actual manufacturer's product.

Classification paths include category, subgroup, technical type and model where readable. Narrow V belts, classical V belts, ribbed belts, timing belts, bearing bore codes and B-series chain pitches use separate rules. Other parts retain explicit material/color/construction/dimension descriptions. Unitless dimensions remain unitless.

Each SKU contains sources and per-field evidence, displayed in the product page and admin editor. The admin products screen downloads the full technical review as JSON. CLI: node --import tsx scripts/audit-product-technical-data.ts --records

Do not turn warehouse SKUs into manufacturer part numbers. Do not infer load, speed, temperature, chemical resistance, bearing outer diameter/width, belt inside/outside lengths, exact compounds or certification from generic names. Timing tooth geometry cannot be identified by pitch alone. Manufacturer datasheets or readable markings/drawings are required to resolve these gaps.

Reference dimensions describe the referenced profile rather than a guarantee about the stocked product. Manual specifications override extracted values; changed admin values are identified as admin evidence.

# Technical catalog review

All 10,435 original SKUs are processed individually by productTechnicalData.ts. Original names, sizes, warehouse codes, financial fields and image bindings are preserved.

Coverage: 2,465 SKUs with matching profile-reference enrichment; 5,512 with a readable model/designation or explicitly labelled catalog part code; 2,458 requiring model identification. None of these counts certifies the actual manufacturer's product.

Classification paths include category, subgroup, technical type and model where readable. Narrow V belts, classical V belts, ribbed belts, timing belts, bearing bore codes and B-series chain pitches use separate rules. Other parts retain explicit material/color/construction/dimension descriptions. Unitless dimensions remain unitless.

Each SKU contains sources and per-field evidence, displayed in the product page and admin editor. The admin products screen downloads the full technical review as JSON. CLI: node --import tsx scripts/audit-product-technical-data.ts --records

Do not turn warehouse SKUs into manufacturer part numbers. Do not infer load, speed, temperature, chemical resistance, bearing outer diameter/width, belt inside/outside lengths, exact compounds or certification from generic names. Timing tooth geometry cannot be identified by pitch alone. Manufacturer datasheets or readable markings/drawings are required to resolve these gaps.

Reference dimensions describe the referenced profile rather than a guarantee about the stocked product. Manual specifications override extracted values; changed admin values are identified as admin evidence.

## Second research pass, 2026-10-19

Of the original 5,100 unresolved SKUs, 2,642 now have a readable catalog part code or interpretable designation; 2,458 remain unidentified. No previously identified SKU was silently relabelled unidentified in this pass. All 10,435 SKUs remain intact.

New rules distinguish proprietary catalog markings from manufacturer standard designations, decode imperial timing profiles H/L/XL/XH and double-sided DH/DL/DXL, and classify the leading part noun rather than a secondary word (a pulley for a belt is not a belt). For 1000H100, the reference convention gives pitch length 2540 mm, width 25.4 mm and 200 teeth. If a rounded historical length would produce a fractional tooth count, a length is not published.

The current standard reference for imperial trapezoidal synchronous drives is ISO 19347:2015. ISO 5296:2012 is withdrawn and is not presented as a current conformity standard. ISO 3601-1, ISO 7089 and ISO 606 appear only as conditional comparison references for relevant part types. Their presence never claims that the stocked part conforms. KTR ROTEX references are only added when that name is explicitly present; spider material, hardness and authenticity are not inferred from color.

405 unresolved photos were reviewed as 25 visual morphology groups. Each file now has a shape description, required measurements, an unchanged-source checksum, and an explicit no-exact-SKU/no-standard-confirmation status. These groups do not merge the photographed items into one purchasable family or assign guessed SKUs.

Evidence is reproducible with scripts/audit-product-technical-data.ts and scripts/research-unassigned-images.py. Exact identity for unmarked proprietary shapes still requires the illustrated numbered manufacturer/owner catalog or a drawing-code crosswalk.

Primary references checked:
- https://www.iso.org/standard/64662.html
- https://www.optibelt.com/fileadmin/pdf/produkte/zahnriemen-gummi/Optibelt-TM-Rubber-Timing-Belt-Drives.pdf
- https://www.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/05/60/56001.html
- https://www.iso.org/standard/58043.html
- https://www.iso.org/standard/13666.html
- https://committee.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/06/12/61232.html
- https://www.ktr.com/us/en/products/rotex-torsionally-flexible-jaw-couplings/rotex-standard/
- https://iskbearing.com/product-details/62200

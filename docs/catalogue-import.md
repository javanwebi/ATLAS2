# Catalogue imported from the customer workbook

Source: `New Microsoft Excel Worksheet.xlsx`, Sheet1, rows 2–1384. The checksum and totals are recorded in `src/data/catalogueImport.json`.

- All 1,383 family rows and 10,435 unique SKU records are preserved in `catalogueSource.json`, including original Arabic/Persian spellings, sizes, brands, profiles, units, materials, source classification status and filter suggestions.
- Navigation uses only the main category, submenu and technical-type columns: 29 / 64 / 90. Family names and individual SKU descriptions do not populate the mega menu.
- Each family has a stable `FAM-<first SKU>` page. Its searchable, paginated table lists every original SKU, size and description. Selecting a row carries that SKU into the existing inquiry workflow. Direct SKU URLs resolve to their family and select the requested SKU.
- The source does not include prices or inventory. Products require inquiry, inventory is marked unknown, and no ratings, certifications or technical performance claims are synthesized.
- The old generated 864-product dataset and its unreliable image/name associations are replaced. Historical source remains in Git history. Old AT-E identifiers are not aliased to unrelated products.

## Image review

All 869 `e(N).png` assets (including the requested first 864) were reviewed again individually in indexed sheets. The per-file visual observations, decision, source family, rationale and SHA-256 are in `docs/product-image-review.json`; a spreadsheet-friendly list is in `docs/product-image-review.csv`.

466 images have a product-type match to 53 source families and are displayed in multi-image galleries. 403 images remain **unassigned** because their exact identity cannot be determined from an unlabelled photo. No image is shared across unrelated families. The previous incorrect green bearing-cover → bearing association was removed; the cover is now under `حفاظ یاتاقان`.

These matches verify visible product type and features, **not exact SKU, dimensions, material grade or manufacturer**. The original assets contain no readable part-number/dimension labels. Where the workbook distinguishes several near-identical names by dimensions, profile, brand or catalogue code, an exact SKU match requires the original numbered catalogue or owner confirmation. In particular, mixed belt/profile sample photos are not assigned to a specific belt profile or brand. No missing-product image is synthesized.

`catalogueImages.json` stores the reviewed files per family. Its exact family-name guard prevents stale names from silently inheriting images. The detail gallery shows all matched images with lazy-loaded thumbnails, a bounded scroll area, accessible selection labels and the explicit non-SKU-specific notice. Unmatched products retain the neutral empty-image state.

To reproduce the visual review records from the reviewed source assets:

```sh
python scripts/rebuild-image-review.py /path/to/imagesatlas
```

This script encodes human/visual review decisions; it is **not an automatic image classifier**. Adding a match requires inspecting the image and source name. Do not map by sequence number, old product name, or approximate text search. Exact-SKU image assignments are not supported by this evidence and must not be claimed.

## Reproduce and verify

```sh
python scripts/import-product-workbook.py /path/to/catalogue.xlsx
node --import tsx scripts/verify-catalogue.mjs
npm run lint
npm run build
```

The importer reads the workbook without changing it and rejects unparsed SKU lines, duplicate SKUs and mismatched row totals. The verification checks every imported family and SKU, hierarchy totals, exact source descriptions, search, image whitelist, empty-image rendering and variant selection. The existing inquiry/backend persistence behavior is unchanged.

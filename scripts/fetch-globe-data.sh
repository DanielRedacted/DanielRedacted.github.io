#!/bin/bash
# Vendors the two atlases the home-page globe draws. Run manually from the repo
# root; never part of the build:
#   bash scripts/fetch-globe-data.sh && node scripts/check-globe-data.mjs
#
# Both are unprojected lon/lat TopoJSON (NOT the pre-projected albers variants,
# which would render as a flat US on a sphere). Quantized topojson is smaller
# than expanded geojson, so it ships as-is and the page decodes it at runtime.
#   countries-110m: Natural Earth, public domain
#   states-10m:     US Census via us-atlas, ISC
set -euo pipefail
mkdir -p public/data
curl -sL --fail --max-time 30 https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json -o public/data/countries-110m.json
curl -sL --fail --max-time 30 https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json -o public/data/states-10m.json
ls -l public/data/

#!/usr/bin/env bash
# Palette extraction — CURATED corpus, HUMAN-LABELLED scenes.
#   * corpus = palette:true stills, scene-labelled via raw/images/scene-label.html
#     (.corpus.tsv = path \t terrain \t light). Includes site-excluded images
#     that kept their palette flag; junk is out.
#   * clusters come ONLY from human terrain labels. The colour-mass heuristic is
#     GONE: it was proven content-blind (it produces the same palette from the
#     photos we threw away — see design.md "What is and isn't derived"). An image
#     with no human label is SKIPPED rather than guessed at.
#   * outputs to analysis/. Informs tokens.css; does not write it.
# Real labels matter: they took the jungle signature from 4.9x to 47.9x.
set -uo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
LIST="$ROOT/design-system/.corpus.tsv"
OUT="$ROOT/design-system/analysis"
TILES="$OUT/tiles"

# ---- 0. build the corpus list from the two human-input files -----------------
# .corpus.tsv is DERIVED (path \t terrain \t light) and regenerated every run, so
# the only things that must persist are the human inputs:
#   raw/images/annotations.json  — palette flag + descriptions  (annotate.html)
#   raw/images/scene-labels.json — terrain + light + write-ins  (scene-label.html)
ANNOT="$ROOT/raw/images/annotations.json"
SCENES="$ROOT/raw/images/scene-labels.json"
for f in "$ANNOT" "$SCENES"; do
  [[ -f "$f" ]] || { echo "missing human input: $f" >&2; exit 1; }
done
python3 - "$ANNOT" "$SCENES" "$LIST" <<'PY'
import sys, json
annot  = {r['path']: r for r in json.load(open(sys.argv[1], encoding='utf-8'))}
scenes = json.load(open(sys.argv[2], encoding='utf-8'))
n = 0
with open(sys.argv[3], 'w', encoding='utf-8') as out:
    for s in scenes:
        p = s['path']
        if 'skip' in (s.get('note') or '').lower():          # honour write-in skips
            continue
        if not annot.get(p, {}).get('palette', True):        # honour the palette flag
            continue
        if not (s.get('terrain') or s.get('light')):         # unlabelled sits out; never guessed
            continue
        out.write(f"raw/images/{p}\t{s.get('terrain','')}\t{s.get('light','')}\n"); n += 1
print(f"corpus list: {n} labelled stills", file=sys.stderr)
PY
[[ -s "$LIST" ]] || { echo "corpus list is empty" >&2; exit 1; }
rm -rf "$OUT"; mkdir -p "$TILES/all"
for c in jungle desert urban indoor water other dusk landscape; do
  mkdir -p "$TILES/$c"; : > "$OUT/list_$c.txt"
done
SW="$OUT/swatches.tsv"; : > "$SW"
HPARSE='s/^ *([0-9]+):[[:space:]]*\(([0-9]+),([0-9]+),([0-9]+)[,)].*(#[0-9A-Fa-f]{6}).*/\1 \2 \3 \4 \5/p'

n=0
process(){ # $1=image path  $2=human terrain label (required)
  local f="$1" cluster="$2" tile name result
  [[ -z "$cluster" ]] && { echo "  SKIP (no human label): $f" >&2; return 0; }
  n=$((n+1)); tile="$TILES/all/$n.png"; name="$(basename "$f")"
  result=$(magick "$f" -resize 100x100 -alpha remove -alpha off +write "$tile" \
             -colors 8 -depth 8 -format %c histogram:info:- 2>/dev/null \
           | sed -nE "$HPARSE" \
           | awk -v name="$name" '
    { cnt=$1;R=$2;G=$3;B=$4;hex=$5; tot+=cnt
      r=R/255;g=G/255;b=B/255; mx=r;if(g>mx)mx=g;if(b>mx)mx=b; mn=r;if(g<mn)mn=g;if(b<mn)mn=b
      l=(mx+mn)/2; d=mx-mn
      if(d==0){hue=0;s=0}else{ s=(l>0.5)?d/(2-mx-mn):d/(mx+mn);
        if(mx==r)hue=(g-b)/d+(g<b?6:0); else if(mx==g)hue=(b-r)/d+2; else hue=(r-g)/d+4; hue*=60 }
      C[NR]=cnt; HEX[NR]=hex; HUE[NR]=hue; LT[NR]=l }
    END{ if(tot==0)exit
      for(i=1;i<=NR;i++) printf "SWATCH\t%s\t%s\t%.3f\t%.0f\t%.3f\n", name, HEX[i], C[i]/tot, HUE[i], LT[i] }')
  [[ -z "$result" ]] && return 0
  printf '%s\n' "$result" | awk -F'\t' -v c="$cluster" '$1=="SWATCH"{print $2"\t"c"\t"$3"\t"$4"\t"$5"\t"$6}' >> "$SW"
  cp "$tile" "$TILES/$cluster/$n.png"
  echo "$TILES/$cluster/$n.png" >> "$OUT/list_$cluster.txt"
}

# .corpus.tsv is now: path \t terrain \t light  — real human scene labels from
# raw/images/scene-label.html (NOT regex guesses, and never colour heuristics).
# Terrain is the env grouping; light is carried for the separate light-axis
# derivation. Two axes because "evening desert" is both, and forcing one label
# was what starved the dusk group.
echo "Scanning curated corpus..." >&2
while IFS=$'\t' read -r path terrain light; do
  [[ -z "$path" ]] && continue
  [[ -f "$path" ]] && process "$path" "$terrain" || echo "  MISSING: $path" >&2
done < "$LIST"
echo "Processed $n images." >&2

# ---- aggregate weighted palette per cluster ----
CL="$OUT/clusters.tsv"; : > "$CL"
agg(){ local c="$1" k="$2" hist tot line; local files=()
  while IFS= read -r line; do [[ -n "$line" ]] && files+=("$line"); done < "$OUT/list_$c.txt"
  [[ ${#files[@]} -eq 0 ]] && return 0
  hist=$(magick "${files[@]}" -append -colors "$k" -depth 8 -format %c histogram:info:- 2>/dev/null)
  tot=$(printf '%s\n' "$hist" | sed -nE 's/^ *([0-9]+):.*#[0-9A-Fa-f]{6}.*/\1/p' | awk '{s+=$1}END{print s}')
  printf '%s\n' "$hist" | sed -nE 's/^ *([0-9]+):.*(#[0-9A-Fa-f]{6}).*/\1 \2/p' \
    | sort -rn | awk -v c="$c" -v t="$tot" '{printf "%s\t%d\t%s\t%.3f\n", c, NR, toupper($2), $1/t}' >> "$CL"
}
for c in jungle desert urban indoor water other dusk landscape; do agg "$c" 12; done
cat "$OUT"/list_*.txt > "$OUT/list_all.txt"
agg_all(){ local hist tot line; local files=()
  while IFS= read -r line; do [[ -n "$line" ]] && files+=("$line"); done < "$OUT/list_all.txt"
  hist=$(magick "${files[@]}" -append -colors 16 -depth 8 -format %c histogram:info:- 2>/dev/null)
  tot=$(printf '%s\n' "$hist" | sed -nE 's/^ *([0-9]+):.*#[0-9A-Fa-f]{6}.*/\1/p' | awk '{s+=$1}END{print s}')
  printf '%s\n' "$hist" | sed -nE 's/^ *([0-9]+):.*(#[0-9A-Fa-f]{6}).*/\1 \2/p' \
    | sort -rn | awk -v t="$tot" '{printf "all\t%d\t%s\t%.3f\n", NR, toupper($2), $1/t}' >> "$CL"; }
agg_all

# ---- summary ----
SUM="$OUT/summary.txt"
{
  echo "Palette extraction — $n human-labelled stills"
  echo "Clusters from HUMAN terrain labels only. No colour heuristic (content-blind)."
  echo
  echo "Cluster sizes (images):"
  for c in jungle desert urban indoor water other dusk landscape; do
    cnt=$(wc -l < "$OUT/list_$c.txt" 2>/dev/null | tr -d " ")
    [[ "${cnt:-0}" -gt 0 ]] && printf "  %-10s %s\n" "$c" "$cnt"
  done
  echo
  for c in jungle desert urban indoor water other dusk landscape all; do
    awk -F"\t" -v c="$c" '$1==c{if(!h){print "["c"] top colours:"; h=1} printf "  %s %s\n",$3,$4}' "$CL"
    awk -F"\t" -v c="$c" '$1==c{f=1} END{if(f)print ""}' "$CL"
  done
} > "$SUM"
echo "Done. See $SUM" >&2

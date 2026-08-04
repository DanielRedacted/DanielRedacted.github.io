#!/bin/bash
# Fetches each tool mark from its source and emits src/data/tools.js.
# To change what /compute lists, edit MODELS / GROUPS / HARDWARE / RUNTIME / NETWORK below and rerun:
#   bash scripts/gen-tools.sh   (from the repo root)
set -euo pipefail
D="$(mktemp -d)"
trap 'rm -rf "$D"' EXIT
mkdir -p "$D"
SI=https://cdn.jsdelivr.net/npm/simple-icons@latest/icons
LH=https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.94.0/icons

fetch() { curl -sL --fail --max-time 20 "$2" -o "$D/$1.svg" || { echo "FETCH FAIL: $1" >&2; exit 1; }; }

for s in jupyter langchain haystack gradio streamlit dify n8n cline opencode searxng \
         huggingface nvidia amd linux docker vllm openai perplexity zapier claude \
         notebooklm tailscale raspberrypi openvpn wireguard github forgejo;         do fetch "$s" "$SI/$s.svg"; done
for s in openwebui openhands llamaindex goose kilocode meta qwen deepseek mistral gemma \
         cherrystudio langfuse cursor devin langsmith;                                   do fetch "$s" "$LH/$s.svg"; done
fetch onyx "https://raw.githubusercontent.com/onyx-dot-app/onyx/HEAD/web/public/logo.svg"
# OpenMed's glyph is the icon-only lockup; the full mark bakes in a dark rounded tile.
fetch openmed "https://raw.githubusercontent.com/maziyarpanahi/openmed/HEAD/docs/brand/assets/logo/openmed-glyph.svg"
# Meshtastic isn't in either icon CDN; this is the small mark from their own design repo.
fetch meshtastic "https://raw.githubusercontent.com/meshtastic/design/HEAD/logo/svg/Mesh_Logo_Black_Small.svg"
# openSenseMap isn't in either icon CDN either; this is their Safari pinned-tab mask icon,
# a clean single-colour mark meant for exactly this kind of monochrome use. The filename is
# a build hash, so it will drift on their next deploy; regrab it from openSenseMap.org's
# rel="mask-icon" link tag if this fetch starts failing.
fetch opensensemap "https://opensensemap.org/images/c20303af.safari-pinned-tab.svg"

# AP0110's own mark is not on any CDN; it comes from the brand favicon in the sibling
# AP0110.com repo. That file also carries three display:none colour variants and an
# "AP0110" wordmark set in Menlo-Bold, which we cannot ship and which would be illegible
# at icon size, so distil it to the two visible mark paths.
# Override the path with AP0110_LOGO= if the checkout lives elsewhere.
AP_SRC="${AP0110_LOGO:-../AP0110.com/public/favicons/favicon.svg}"
[ -f "$AP_SRC" ] || { echo "missing AP0110 mark: $AP_SRC" >&2; exit 1; }
python3 - "$AP_SRC" "$D/ap0110.svg" <<'PY'
import sys, xml.etree.ElementTree as ET
NS = "{http://www.w3.org/2000/svg}"
root = ET.parse(sys.argv[1]).getroot()
ds = []
def walk(el, hidden=False):
    hidden = hidden or el.get("display") == "none"
    if el.tag == NS + "path" and not hidden and (el.get("fill") or "").startswith("var(--icon"):
        ds.append(el.get("d"))
    for child in el:
        walk(child, hidden)
walk(root)
if len(ds) != 2:
    raise SystemExit(f"AP0110 mark: expected 2 visible paths, got {len(ds)}")
vb = " ".join(root.get("viewBox").replace(",", " ").split())
open(sys.argv[2], "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">'
    + "".join(f'<path d="{d}"/>' for d in ds) + "</svg>")
PY

python3 - "$D" <<'PY'
import re, sys, pathlib, json

d = pathlib.Path(sys.argv[1])

# llama.com and ai.meta.com/llama both 400, so Llama points at the weights on the hub.
MODELS = [
    ("huggingface", "Hugging Face", "https://huggingface.co"),
    ("meta",        "Llama",        "https://huggingface.co/meta-llama"),
    ("qwen",        "Qwen",         "https://qwen.ai"),
    ("deepseek",    "DeepSeek",     "https://deepseek.com"),
    ("mistral",     "Mistral",      "https://mistral.ai"),
    ("gemma",       "Gemma",        "https://deepmind.google/models/gemma/"),
    # OpenMed is Apache-2.0 open weights, but clinical encoders run locally rather than
    # behind an endpoint, so it sits here rather than under "Works with".
    ("openmed",     "OpenMed",      "https://openmed.life"),
]

HARDWARE = [
    ("nvidia",      "NVIDIA",      "https://nvidia.com"),
    ("amd",         "AMD",         "https://amd.com"),
    ("raspberrypi", "Raspberry Pi", "https://raspberrypi.com"),
]

RUNTIME = [
    ("linux",  "Linux",  "https://kernel.org"),
    ("docker", "Docker", "https://docker.com"),
    ("vllm",   "vLLM",   "https://vllm.ai"),
    ("ap0110", "AP0110", "https://AP0110.com"),
]

NETWORK = [
    ("meshtastic",   "Meshtastic",   "https://meshtastic.org"),
    ("tailscale",    "Tailscale",    "https://tailscale.com"),
    ("openvpn",      "OpenVPN",      "https://openvpn.net"),
    ("wireguard",    "WireGuard",    "https://wireguard.com"),
    ("opensensemap", "openSenseMap", "https://opensensemap.org"),
]

# Subscription service on the left, the open tool we actually run on the right. Each
# open-side slug must also appear in GROUPS above; the page cross-links them.
PAIRS = [
    ("openai",     "ChatGPT",    "https://chatgpt.com",         "openwebui", "Open WebUI", "https://openwebui.com"),
    ("perplexity", "Perplexity", "https://perplexity.ai",       "searxng",   "SearXNG",    "https://searxng.org"),
    ("cursor",     "Cursor",     "https://cursor.com",          "cline",     "Cline",      "https://cline.bot"),
    ("devin",      "Devin",      "https://devin.ai",            "openhands", "OpenHands",  "https://openhands.dev"),
    ("zapier",     "Zapier",     "https://zapier.com",          "n8n",       "n8n",        "https://n8n.io"),
    ("langsmith",  "LangSmith",  "https://smith.langchain.com", "langfuse",  "Langfuse",   "https://langfuse.com"),
    ("claude",     "Claude",     "https://claude.ai",           "goose",     "Goose",      "https://goose-docs.ai"),
    ("notebooklm", "NotebookLM", "https://notebooklm.google",   "onyx",      "Onyx",       "https://onyx.app"),
    # Forgejo over Gitea deliberately: it is the fork the maintainers made when Gitea's
    # stewardship moved into a company, which is the argument the /compute page is making.
    ("github",     "GitHub",     "https://github.com",          "forgejo",   "Forgejo",    "https://forgejo.org"),
]

GROUPS = [
    ("Ask and search", [
        ("openwebui",    "Open WebUI",    "https://openwebui.com"),
        ("cherrystudio", "Cherry Studio", "https://cherryai.com"),
        ("onyx",         "Onyx",          "https://onyx.app"),
        ("searxng",      "SearXNG",       "https://searxng.org"),
    ]),
    # Roo Code was dropped here: its repo is archived and roocode.com now redirects
    # to a different product. Kilo Code is the maintained tool in that slot.
    ("Write code", [
        ("openhands", "OpenHands", "https://openhands.dev"),
        ("opencode",  "opencode",  "https://opencode.ai"),
        ("cline",     "Cline",     "https://cline.bot"),
        ("goose",     "Goose",     "https://goose-docs.ai"),
        ("kilocode",  "Kilo Code", "https://kilo.ai"),
    ]),
    ("Build your own", [
        ("jupyter",    "Jupyter",    "https://jupyter.org"),
        ("langchain",  "LangChain",  "https://langchain.com"),
        ("llamaindex", "LlamaIndex", "https://llamaindex.ai"),
        ("haystack",   "Haystack",   "https://haystack.deepset.ai"),
        ("gradio",     "Gradio",     "https://gradio.app"),
        ("streamlit",  "Streamlit",  "https://streamlit.io"),
        ("dify",       "Dify",       "https://dify.ai"),
        ("n8n",        "n8n",        "https://n8n.io"),
        ("langfuse",   "Langfuse",   "https://langfuse.com"),
    ]),
]

def extract(slug):
    src = (d / f"{slug}.svg").read_text()
    root = re.search(r"<svg[^>]*>", src, flags=re.S)
    if not root:
        raise SystemExit(f"{slug}: no <svg> root")
    vb = re.search(r'viewBox="([^"]+)"', root.group(0))
    if not vb:
        raise SystemExit(f"{slug}: no viewBox")
    # fill-rule/clip-rule frequently sit on the root, as either an XML attribute or
    # inside a CSS style="" block (Meshtastic does the latter), and are inherited by
    # the paths. Dropping the root silently changes the shape: Gemma fills in solid
    # without it.
    carried_parts = [m.group(0).strip()
                      for m in re.finditer(r'\s(?:fill|clip)-rule="[^"]*"', root.group(0))]
    style = re.search(r'\sstyle="([^"]*)"', root.group(0))
    if style:
        for prop in ("fill-rule", "clip-rule"):
            m = re.search(rf'{prop}\s*:\s*([\w-]+)', style.group(1))
            if m:
                carried_parts.append(f'{prop}="{m.group(1)}"')
    carried = " ".join(carried_parts)
    inner = re.sub(r"<\?xml.*?\?>|<!--.*?-->|<!DOCTYPE.*?>|<title>.*?</title>|<desc>.*?</desc>", "", src, flags=re.S)
    inner = re.sub(r"^.*?<svg[^>]*>|</svg>\s*$", "", inner, flags=re.S)
    inner = re.sub(r'\sfill="[^"]*"', "", inner)          # let currentColor win; keeps fill-rule
    inner = re.sub(r"\s+", " ", inner).strip()
    # most marks are a single path, but some (OpenMed) are built from primitives, and
    # some (Meshtastic) wrap their paths in nested <g transform> groups
    if not re.match(r"<(path|rect|circle|ellipse|polygon|polyline|g)\b", inner):
        raise SystemExit(f"{slug}: unexpected markup {inner[:60]!r}")
    if carried:
        inner = f"<g {carried}>{inner}</g>"
    return vb.group(1), inner

def emit(items, indent):
    for slug, label, url in items:
        vb, inner = extract(slug)
        yield (f"{indent}{{ label: {json.dumps(label)}, url: {json.dumps(url)}, "
               f"vb: {json.dumps(vb)}, svg: {json.dumps(inner)} }},")

def mark_literal(slug, label, url):
    vb, inner = extract(slug)
    return (f"{{ label: {json.dumps(label)}, url: {json.dumps(url)}, "
            f"vb: {json.dumps(vb)}, svg: {json.dumps(inner)} }}")

def emit_pairs(items, indent):
    for cslug, clabel, curl, oslug, olabel, ourl in items:
        closed = mark_literal(cslug, clabel, curl)
        open_ = mark_literal(oslug, olabel, ourl)
        yield f"{indent}{{ closed: {closed}, open: {open_} }},"

out = ["// Generated by scripts/gen-tools.sh, do not hand edit. Marks come from Simple Icons (CC0) and",
       "// @lobehub/icons-static-svg, except Onyx which is taken from its own repo.",
       "// Brands are their owners' trademarks; listed here as compatible tools.",
       "export const models = ["]
out += list(emit(MODELS, "  "))
out += ["];", "", "export const toolGroups = ["]
for title, tools in GROUPS:
    out.append(f"  {{")
    out.append(f"    title: {json.dumps(title)},")
    out.append(f"    tools: [")
    out += list(emit(tools, "      "))
    out.append(f"    ],")
    out.append(f"  }},")
out += ["];", "", "export const hardware = ["]
out += list(emit(HARDWARE, "  "))
out += ["];", "", "export const runtime = ["]
out += list(emit(RUNTIME, "  "))
out += ["];", "", "export const network = ["]
out += list(emit(NETWORK, "  "))
out += ["];", "", "export const alternatives = ["]
out += list(emit_pairs(PAIRS, "  "))
out.append("];")

target = pathlib.Path("src/data/tools.js")
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text("\n".join(out) + "\n")
n = len(MODELS) + sum(len(t) for _, t in GROUPS) + len(HARDWARE) + len(RUNTIME) + len(NETWORK) + len(PAIRS) * 2
print(f"wrote {target}: {len(MODELS)} models, "
      f"{sum(len(t) for _, t in GROUPS)} tools in {len(GROUPS)} groups, "
      f"{len(HARDWARE)} hardware, {len(RUNTIME)} runtime, {len(NETWORK)} network, "
      f"{len(PAIRS)} subscription→open pairs ({n} marks)")
PY

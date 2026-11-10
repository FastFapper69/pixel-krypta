#!/usr/bin/env bash
# 10g: ověření nasazení na GitHub Pages ze sandboxu. Stránka *.github.io ani API cesta /pages přes proxy nejdou,
# ale běh „pages build and deployment“ (actions/runs) a jeho check-runs ano.
# bash tests/tools/pagescheck.sh [commit]   (výchozí HEAD) – čeká max ~5 min, skončí 0 = nasazeno, 1 = chyba/nedoběhlo
SHA=$(git -C "$(dirname "$0")/../.." rev-parse "${1:-HEAD}")
R=repos/FastFapper69/pixel-krypta
for i in $(seq 1 30); do
  L=$(gh api "$R/actions/runs?head_sha=$SHA&per_page=5" --jq '.workflow_runs[]|select(.name=="pages build and deployment")|.status+" "+(.conclusion//"-")' 2>/dev/null | head -1)
  case "$L" in
    "completed success") echo "Pages nasazené: ${SHA:0:7}"; exit 0;;
    completed*) echo "Pages SELHALO: ${SHA:0:7} ($L)"; gh api "$R/commits/$SHA/check-runs" --jq '.check_runs[]|.name+": "+(.conclusion//.status)'; exit 1;;
  esac
  sleep 10
done
echo "Pages ještě nedoběhlo pro ${SHA:0:7} (stav: ${L:-zatím bez běhu})"; exit 1

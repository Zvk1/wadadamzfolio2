#!/bin/zsh
cd -- "${0:A:h}" || exit 1
if command -v node >/dev/null 2>&1; then
  exec node scripts/serve.mjs
elif [[ -x /Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node ]]; then
  exec /Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node scripts/serve.mjs
else
  print 'Install Node.js 22.12+ to preview this portfolio.'
  read -r '?Press Return to close.'
fi

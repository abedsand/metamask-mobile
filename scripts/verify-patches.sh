#!/bin/bash

# Script to verify that patches are applied correctly
set -e

echo "🔍 Verifying patches are applied..."

# Check if appwright patch is applied
if grep -q "local: true," node_modules/appwright/dist/providers/browserstack/index.js; then
    echo "✅ Appwright patch is applied (local: true found)"
else
    echo "❌ Appwright patch is NOT applied (local: true not found)"
    exit 1
fi

if grep -q "appProfiling: true," node_modules/appwright/dist/providers/browserstack/index.js; then
    echo "✅ Appwright patch is applied (appProfiling: true found)"
else
    echo "❌ Appwright patch is NOT applied (appProfiling: true not found)"
    exit 1
fi

echo "✅ All patches verified successfully!" 
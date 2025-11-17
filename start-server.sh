#!/bin/bash

echo "🚀 Starting BiblioKit (Netlify Dev proxy → Vite)"
echo "   Proxy: http://localhost:9989  |  Vite: http://127.0.0.1:53173"
echo "   Stop with Ctrl+C"

exec npx netlify dev

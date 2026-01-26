#!/bin/bash
# AWS SSO Login Helper Script
# This script helps automate AWS SSO login by capturing the device code URL

set -e

SSO_SESSION="${1:-structa}"

echo "🔐 Starting AWS SSO login for session: $SSO_SESSION"
echo ""

# Run AWS SSO login and capture output
OUTPUT=$(aws sso login --sso-session="$SSO_SESSION" --no-browser --use-device-code 2>&1) || true

# Extract the device URL and code
DEVICE_URL=$(echo "$OUTPUT" | grep -oP 'https://[^\s]+device\?user_code=[A-Z0-9-]+' | head -1)
CODE=$(echo "$OUTPUT" | grep -oP 'user_code=[A-Z0-9-]+' | head -1 | cut -d= -f2)

if [ -z "$DEVICE_URL" ]; then
    echo "❌ Failed to extract device URL from AWS SSO output"
    echo "$OUTPUT"
    exit 1
fi

echo "✅ Device URL: $DEVICE_URL"
echo "📋 Device Code: $CODE"
echo ""
echo "🌐 Opening browser for authentication..."
echo ""

# Output structured data for agent consumption
cat <<EOF
{
  "device_url": "$DEVICE_URL",
  "device_code": "$CODE",
  "sso_session": "$SSO_SESSION",
  "email": "harrison@structa.so",
  "instructions": "Navigate to the URL and sign in. The browser should auto-fill credentials if saved."
}
EOF

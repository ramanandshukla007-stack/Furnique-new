#!/usr/bin/env bash
# Send completion email via SendGrid API using environment variable SENDGRID_API_KEY
# Usage:
#   export SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
#   ./scripts/send_completion_email.sh ramanandshukla007@gmail.com
#
# This script uses curl to POST to SendGrid's v3 Mail Send API. It does not store
# the API key anywhere and expects it in the environment.

set -euo pipefail

if [ -z "${SENDGRID_API_KEY:-}" ]; then
  echo "Error: SENDGRID_API_KEY environment variable is not set."
  echo "Get an API key from https://app.sendgrid.com/settings/api_keys and export it:" 
  echo "  export SENDGRID_API_KEY=\"YOUR_KEY\""
  exit 1
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 recipient@example.com"
  exit 1
fi

RECIPIENT="$1"
FROM_EMAIL="noreply@furnique.example.com"
SUBJECT="Furnique — Calculator UI updates ready"

read -r -d '' BODY <<'EOF'
Hello,

This is an automated notification from the Furnique workspace indicating the requested calculator work is ready for you to resume/verify.

Summary of changes made so far:
- Fixed parse errors and extended `lib/calculator.ts` to include meters and sqft outputs for fabric calculations.
- Added furniture yardage rules and helpers for common items (sofas, chairs, cushions, benches, headboards, bed throws).
- Updated UI components to show metric values where appropriate:
  - `components/ProjectSummary.tsx` now displays grand totals in yards, meters and sqft, and uses meters for cost calculations (estimate using `estimateCost`).
  - `components/RoomYardageBreakdown.tsx` shows per-item yards and metric equivalents (meters and sqft) and room totals.
  - `components/CurtainCalculator.tsx` remains inch-based for measurements but now exposes fabric meters and track length in feet via the calculation breakdown.

Build status:
- A production build was run and completed successfully after fixing the TypeScript parse error.

Files you may want to review:
- lib/calculator.ts
- components/ProjectSummary.tsx
- components/RoomYardageBreakdown.tsx
- components/CurtainCalculator.tsx

Next steps I will take when you confirm your account rate-limit is reset:
1) Finish wiring the UI to prefer meters for cost calculations across components.
2) Verify displays for sqft (area) and ft (track/tube lengths).
3) Run a full build and tests, open a PR if requested, and notify you by email.

If you'd like this message changed (tone, extra details, attach a diff), tell me and I will update the script.

Thanks,
Furnique automation
EOF

PAYLOAD=$(jq -nc --arg to "$RECIPIENT" --arg from "$FROM_EMAIL" --arg subject "$SUBJECT" --arg text "$BODY" '{personalizations:[{to:[{email:$to}]}],from:{email:$from},subject:$subject,content:[{type:"text/plain",value:$text}] }')

# send via SendGrid
HTTP_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" -X POST \
  -H "Authorization: Bearer ${SENDGRID_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "https://api.sendgrid.com/v3/mail/send")

if [ "$HTTP_STATUS" -ge 200 -a "$HTTP_STATUS" -lt 300 ]; then
  echo "Email sent to $RECIPIENT (HTTP $HTTP_STATUS)"
  exit 0
else
  echo "Failed to send email (HTTP $HTTP_STATUS)"
  exit 2
fi

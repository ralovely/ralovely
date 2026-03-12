#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Deploy: build, sync to S3, invalidate CloudFront
# ---------------------------------------------------------------------------

BUCKET="ralovely.com"
REGION="ap-southeast-2"
S3_SYNC_FILE="$(dirname "$0")/.s3_sync"

# Parse credentials from .s3_sync (YAML-ish)
if [[ ! -f "$S3_SYNC_FILE" ]]; then
  echo "Error: $S3_SYNC_FILE not found" >&2
  exit 1
fi

export AWS_ACCESS_KEY_ID=$(grep 'aws_access_key_id' "$S3_SYNC_FILE" | awk '{print $2}')
export AWS_SECRET_ACCESS_KEY=$(grep 'aws_secret_access_key' "$S3_SYNC_FILE" | awk '{print $2}')
export AWS_DEFAULT_REGION="$REGION"

if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo "Error: could not parse credentials from $S3_SYNC_FILE" >&2
  exit 1
fi

# Build
echo "Building..."
npm run build

# Sync static assets (long cache)
echo "Syncing assets to s3://$BUCKET ..."
aws s3 sync public/ "s3://$BUCKET" \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.xml" \
  --exclude "*.text" \
  --exclude "*.txt"

# Sync HTML, XML, and text (no cache)
aws s3 sync public/ "s3://$BUCKET" \
  --delete \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.xml" \
  --include "*.text" \
  --include "*.txt"

# CloudFront invalidation
# Set CLOUDFRONT_DISTRIBUTION_ID in .s3_sync or as an env var
DIST_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
if [[ -z "$DIST_ID" ]]; then
  DIST_ID=$(grep 'cloudfront_distribution_id' "$S3_SYNC_FILE" 2>/dev/null | awk '{print $2}' || true)
fi

if [[ -n "$DIST_ID" ]]; then
  echo "Invalidating CloudFront distribution $DIST_ID ..."
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" > /dev/null
  echo "Done."
else
  echo "Warning: CLOUDFRONT_DISTRIBUTION_ID not set, skipping invalidation."
  echo "Add 'cloudfront_distribution_id: XXXXX' to .s3_sync or export CLOUDFRONT_DISTRIBUTION_ID."
fi

echo "Deploy complete."

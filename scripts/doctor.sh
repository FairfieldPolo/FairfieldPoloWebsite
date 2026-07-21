#!/usr/bin/env bash
set -Eeuo pipefail

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

pass() {
    printf 'PASS  %s\n' "$1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

warn() {
    printf 'WARN  %s\n' "$1" >&2
    WARN_COUNT=$((WARN_COUNT + 1))
}

fail() {
    printf 'FAIL  %s\n' "$1" >&2
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

section() {
    printf '\n== %s ==\n' "$1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

is_placeholder() {
    local value="${1:-}"
    [[ -z "$value" || "$value" == REPLACE_WITH_* || "$value" == your_* || "$value" == *your_* ]]
}

# First-hop only (no -L). Vanity hosts often 302; following can false-fail.
https_reachable() {
    local url="$1"
    local code

    code="$(
        curl -sS -o /dev/null -w '%{http_code}' --max-time 8 "$url" 2>/dev/null || true
    )"

    [[ "$code" =~ ^[23][0-9][0-9]$ ]]
}

env_local_get() {
    local key="$1"
    local file="$2"
    local line value

    [[ -f "$file" ]] || return 1

    line="$(grep -E "^[[:space:]]*${key}=" "$file" | tail -n 1 || true)"
    [[ -n "$line" ]] || return 1

    value="${line#*=}"
    value="${value%$'\r'}"
    # Strip matching single/double quotes
    if [[ "$value" =~ ^\"(.*)\"$ ]]; then
        value="${BASH_REMATCH[1]}"
    elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
        value="${BASH_REMATCH[1]}"
    fi
    printf '%s' "$value"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WORKSPACE_ROOT"

ENV_FILE="$WORKSPACE_ROOT/.env.infrastructure.local"
APP_ENV_FILE="$WORKSPACE_ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
    printf 'FAIL  Missing %s\n' "$ENV_FILE" >&2
    printf '      Copy .env.infrastructure.example to .env.infrastructure.local.\n' >&2
    exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

required_vars=(
    PROJECT_GITHUB_ACCOUNT
    PROJECT_GITHUB_ORG
    PROJECT_GITHUB_REPO
    PROJECT_WORKSPACE_ROOT
    PROJECT_SITE_URL
    PROJECT_SITE_HOSTNAMES
    PROJECT_CLOUDFLARE_ZONE_NAME
    PROJECT_CLOUDFLARE_HOSTNAMES
)

for variable in "${required_vars[@]}"; do
    value="${!variable:-}"

    if is_placeholder "$value"; then
        fail "$variable is missing or still contains a placeholder."
    fi
done

if (( FAIL_COUNT > 0 )); then
    printf '\nPROJECT CONTEXT FAILED\n' >&2
    exit 1
fi

section "Workspace"

if [[ "$WORKSPACE_ROOT" == "$PROJECT_WORKSPACE_ROOT" ]]; then
    pass "Workspace path is correct: $WORKSPACE_ROOT"
else
    fail "Unexpected workspace path: $WORKSPACE_ROOT (expected $PROJECT_WORKSPACE_ROOT)"
fi

if [[ -f "$WORKSPACE_ROOT/package.json" ]]; then
    pass "package.json present"
else
    fail "package.json missing"
fi

if [[ -f "$WORKSPACE_ROOT/pnpm-lock.yaml" || -f "$WORKSPACE_ROOT/package-lock.json" ]]; then
    pass "Lockfile present (pnpm-lock.yaml and/or package-lock.json)"
else
    fail "No pnpm-lock.yaml or package-lock.json"
fi

if [[ -d "$WORKSPACE_ROOT/node_modules" ]]; then
    pass "node_modules installed"
else
    warn "node_modules missing — run pnpm install or npm ci"
fi

section "Git"

if [[ -d "$WORKSPACE_ROOT/.git" ]]; then
    pass "Git repository present"
else
    fail "Not a git repository: $WORKSPACE_ROOT"
fi

actual_remote="$(git -C "$WORKSPACE_ROOT" remote get-url origin 2>/dev/null || true)"
expected_ssh="git@github.com:${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}.git"
expected_https="https://github.com/${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}.git"

if [[ "$actual_remote" == "$expected_ssh" || "$actual_remote" == "$expected_https" ]]; then
    pass "Git origin is $actual_remote"
else
    fail "Git origin mismatch. Expected ${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}. Found: ${actual_remote:-<none>}"
fi

head_sha="$(git -C "$WORKSPACE_ROOT" rev-parse --short HEAD 2>/dev/null || true)"
branch="$(git -C "$WORKSPACE_ROOT" branch --show-current 2>/dev/null || true)"
if [[ -n "$head_sha" && -n "$branch" ]]; then
    pass "HEAD $head_sha on $branch"
else
    warn "Could not report HEAD/branch"
fi

if git -C "$WORKSPACE_ROOT" rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    counts="$(git -C "$WORKSPACE_ROOT" rev-list --left-right --count '@{u}...HEAD' 2>/dev/null || echo '')"
    behind="${counts%%$'\t'*}"
    ahead="${counts##*$'\t'}"
    if [[ "$ahead" == "0" && "$behind" == "0" ]]; then
        pass "Branch is in sync with upstream"
    else
        warn "Branch ahead=$ahead behind=$behind vs upstream"
    fi
else
    warn "No upstream tracking branch"
fi

section "Required tools"

required_commands=(
    git
    gh
    node
    make
    jq
    curl
)

for cmd in "${required_commands[@]}"; do
    if command_exists "$cmd"; then
        version="$("$cmd" --version 2>/dev/null | head -n 1 || true)"
        pass "$cmd available${version:+: $version}"
    else
        fail "$cmd is not installed or not on PATH"
    fi
done

if command_exists pnpm; then
    pass "pnpm available: $(pnpm --version 2>/dev/null | head -n 1)"
elif command_exists npm; then
    pass "npm available: $(npm --version 2>/dev/null | head -n 1)"
    warn "pnpm not found — CI uses npm; local README may mention either"
else
    fail "Neither pnpm nor npm is installed"
fi

optional_commands=(
    vercel
    dig
    docker
    sanity
    cloudflared
    wrangler
)

for cmd in "${optional_commands[@]}"; do
    if command_exists "$cmd"; then
        version="$("$cmd" --version 2>/dev/null | head -n 1 || true)"
        pass "$cmd available${version:+: $version}"
    else
        warn "$cmd is not installed or not on PATH"
    fi
done

if command_exists node; then
    node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || true)"
    if [[ "${node_major:-0}" -ge 20 ]]; then
        pass "Node major version is $node_major (CI uses 24)"
    else
        warn "Node major version is ${node_major:-unknown}; prefer Node 20+"
    fi
fi

section "GitHub"

if command_exists gh; then
    actual_gh_account="$(gh api user --jq '.login' 2>/dev/null || true)"

    if [[ "$actual_gh_account" == "$PROJECT_GITHUB_ACCOUNT" ]]; then
        pass "GitHub account is $actual_gh_account"
    else
        fail "GitHub account mismatch. Found: ${actual_gh_account:-<not authenticated>}"
    fi

    if gh api "repos/${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}" --jq '.full_name' >/dev/null 2>&1; then
        pass "GitHub repo accessible: ${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}"
    else
        fail "Cannot access GitHub repo: ${PROJECT_GITHUB_ORG}/${PROJECT_GITHUB_REPO}"
    fi
fi

section "App env (.env.local)"

if [[ -f "$APP_ENV_FILE" ]]; then
    pass ".env.local present"
else
    fail "Missing .env.local — copy .env.example and fill service values"
fi

# Sanity
sanity_project_id="$(env_local_get NEXT_PUBLIC_SANITY_PROJECT_ID "$APP_ENV_FILE" || true)"
sanity_dataset="$(env_local_get NEXT_PUBLIC_SANITY_DATASET "$APP_ENV_FILE" || true)"
sanity_token="$(env_local_get SANITY_API_READ_TOKEN "$APP_ENV_FILE" || true)"

if is_placeholder "$sanity_project_id"; then
    fail "NEXT_PUBLIC_SANITY_PROJECT_ID unset or placeholder in .env.local"
else
    pass "Sanity project id set ($sanity_project_id)"
fi

if is_placeholder "$sanity_dataset"; then
    fail "NEXT_PUBLIC_SANITY_DATASET unset or placeholder in .env.local"
else
    pass "Sanity dataset set ($sanity_dataset)"
fi

if is_placeholder "$sanity_token"; then
    warn "SANITY_API_READ_TOKEN unset or placeholder (ok if dataset is public)"
else
    pass "Sanity read token set"
fi

if [[ -n "${PROJECT_SANITY_PROJECT_ID:-}" ]] && ! is_placeholder "${PROJECT_SANITY_PROJECT_ID:-}"; then
    if [[ "$sanity_project_id" == "$PROJECT_SANITY_PROJECT_ID" ]]; then
        pass "Sanity project id matches PROJECT_SANITY_PROJECT_ID"
    else
        fail "Sanity project id mismatch (.env.local=$sanity_project_id, infrastructure=$PROJECT_SANITY_PROJECT_ID)"
    fi
fi

# Medusa
medusa_url="$(env_local_get MEDUSA_BACKEND_URL "$APP_ENV_FILE" || true)"
medusa_public_url="$(env_local_get NEXT_PUBLIC_MEDUSA_BACKEND_URL "$APP_ENV_FILE" || true)"
medusa_key="$(env_local_get NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY "$APP_ENV_FILE" || true)"

if is_placeholder "$medusa_url"; then
    fail "MEDUSA_BACKEND_URL unset or placeholder in .env.local"
else
    pass "Medusa backend URL set ($medusa_url)"
fi

if is_placeholder "$medusa_public_url"; then
    fail "NEXT_PUBLIC_MEDUSA_BACKEND_URL unset or placeholder in .env.local"
else
    pass "Medusa public backend URL set"
fi

if is_placeholder "$medusa_key"; then
    fail "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY unset or placeholder in .env.local"
else
    pass "Medusa publishable key set"
fi

# Site
site_url="$(env_local_get NEXT_PUBLIC_SITE_URL "$APP_ENV_FILE" || true)"
if is_placeholder "$site_url"; then
    fail "NEXT_PUBLIC_SITE_URL unset or placeholder in .env.local"
else
    pass "Site URL set ($site_url)"
    if [[ "$site_url" == "$PROJECT_SITE_URL" ]]; then
        pass "NEXT_PUBLIC_SITE_URL matches PROJECT_SITE_URL"
    else
        warn "NEXT_PUBLIC_SITE_URL ($site_url) differs from PROJECT_SITE_URL ($PROJECT_SITE_URL)"
    fi
fi

# Resend / contact
resend_key="$(env_local_get RESEND_API_KEY "$APP_ENV_FILE" || true)"
contact_email="$(env_local_get CONTACT_EMAIL "$APP_ENV_FILE" || true)"

if is_placeholder "$resend_key"; then
    warn "RESEND_API_KEY unset — contact form email delivery will fail"
else
    pass "Resend API key set"
fi

if is_placeholder "$contact_email"; then
    warn "CONTACT_EMAIL unset — contact form has no inbox target"
else
    pass "CONTACT_EMAIL set ($contact_email)"
fi

# Mailchimp
mc_key="$(env_local_get MAILCHIMP_API_KEY "$APP_ENV_FILE" || true)"
mc_audience="$(env_local_get MAILCHIMP_AUDIENCE_ID "$APP_ENV_FILE" || true)"
mc_prefix="$(env_local_get MAILCHIMP_SERVER_PREFIX "$APP_ENV_FILE" || true)"

if is_placeholder "$mc_key" || is_placeholder "$mc_audience" || is_placeholder "$mc_prefix"; then
    warn "Mailchimp not fully configured (API key / audience / server prefix)"
else
    pass "Mailchimp newsletter vars set"
fi

# Behold / Instagram
behold_id="$(env_local_get NEXT_PUBLIC_BEHOLD_WIDGET_ID "$APP_ENV_FILE" || true)"
if is_placeholder "$behold_id"; then
    warn "NEXT_PUBLIC_BEHOLD_WIDGET_ID unset — Instagram feed widget will not render"
else
    pass "Behold Instagram widget id set"
fi

# Google Maps (optional)
maps_key="$(env_local_get NEXT_PUBLIC_GOOGLE_MAPS_API_KEY "$APP_ENV_FILE" || true)"
if is_placeholder "$maps_key"; then
    warn "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY unset (ok if maps UI unused)"
else
    pass "Google Maps API key set"
fi

section "Service reachability (read-only)"

if [[ -n "$medusa_url" ]] && ! is_placeholder "$medusa_url"; then
    medusa_health="${medusa_url%/}/health"
    if https_reachable "$medusa_health" || https_reachable "$medusa_url"; then
        pass "Medusa reachable: $medusa_url"
    else
        warn "Medusa not reachable at $medusa_url (start local Medusa or fix URL)"
    fi
fi

if command_exists curl && [[ -n "$sanity_project_id" ]] && ! is_placeholder "$sanity_project_id"; then
    dataset="${sanity_dataset:-production}"
    sanity_api="https://${sanity_project_id}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=*%5B0%5D%7B_type%7D"
    code="$(
        curl -sS -o /dev/null -w '%{http_code}' --max-time 8 \
            ${sanity_token:+-H "Authorization: Bearer ${sanity_token}"} \
            "$sanity_api" 2>/dev/null || true
    )"
    if [[ "$code" =~ ^2[0-9][0-9]$ ]]; then
        pass "Sanity API responds for project $sanity_project_id ($code)"
    elif [[ "$code" == "401" || "$code" == "403" ]]; then
        warn "Sanity API auth failed ($code) — check SANITY_API_READ_TOKEN / dataset visibility"
    else
        warn "Sanity API check failed (HTTP ${code:-none})"
    fi
fi

section "Vercel"

if [[ -d "$WORKSPACE_ROOT/.vercel" ]]; then
    pass ".vercel link directory present"
else
    warn ".vercel not linked — run vercel link when deploying from CLI"
fi

if [[ -n "${PROJECT_VERCEL_PROJECT:-}" ]] && ! is_placeholder "${PROJECT_VERCEL_PROJECT:-}"; then
    pass "PROJECT_VERCEL_PROJECT configured: $PROJECT_VERCEL_PROJECT"
else
    warn "PROJECT_VERCEL_PROJECT not set in .env.infrastructure.local"
fi

if command_exists vercel; then
    if vercel whoami >/dev/null 2>&1; then
        pass "Vercel CLI authenticated as $(vercel whoami 2>/dev/null | head -n 1)"
    else
        warn "Vercel CLI present but not authenticated"
    fi
fi

section "Cloudflare"

if [[ "$PROJECT_CLOUDFLARE_ZONE_NAME" == "fairfieldpolo.com" ]]; then
    pass "Cloudflare zone is fairfieldpolo.com"
else
    fail "Cloudflare zone must be fairfieldpolo.com (found $PROJECT_CLOUDFLARE_ZONE_NAME)"
fi

IFS=',' read -r -a CF_HOSTNAMES <<< "$PROJECT_CLOUDFLARE_HOSTNAMES"

for hostname in "${CF_HOSTNAMES[@]}"; do
    hostname="$(echo "$hostname" | xargs)"
    [[ -z "$hostname" ]] && continue

    if [[ "$hostname" == "$PROJECT_CLOUDFLARE_ZONE_NAME" ||
          "$hostname" == *".$PROJECT_CLOUDFLARE_ZONE_NAME" ]]; then
        pass "Cloudflare hostname in zone: $hostname"
    else
        fail "Cloudflare hostname outside approved zone: $hostname"
    fi
done

# Site hostnames should be covered by the Cloudflare hostname list
IFS=',' read -r -a SITE_HOSTNAMES <<< "$PROJECT_SITE_HOSTNAMES"
for hostname in "${SITE_HOSTNAMES[@]}"; do
    hostname="$(echo "$hostname" | xargs)"
    [[ -z "$hostname" ]] && continue

    covered=0
    for cf_host in "${CF_HOSTNAMES[@]}"; do
        cf_host="$(echo "$cf_host" | xargs)"
        if [[ "$hostname" == "$cf_host" ]]; then
            covered=1
            break
        fi
    done

    if (( covered == 1 )); then
        pass "Site hostname listed for Cloudflare: $hostname"
    else
        fail "Site hostname missing from PROJECT_CLOUDFLARE_HOSTNAMES: $hostname"
    fi
done

if [[ "${PROJECT_CLOUDFLARE_ACCOUNT_ID:-}" == REPLACE_WITH_* ||
      -z "${PROJECT_CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
    warn "Cloudflare account ID has not been configured"
else
    pass "Cloudflare account ID is configured"
fi

if [[ "${PROJECT_CLOUDFLARE_ZONE_ID:-}" == REPLACE_WITH_* ||
      -z "${PROJECT_CLOUDFLARE_ZONE_ID:-}" ]]; then
    warn "Cloudflare zone ID has not been configured"
else
    pass "Cloudflare zone ID is configured"
fi

# This site deploys on Vercel; tunnels are optional (email/subdomain Workers later).
if [[ -n "${PROJECT_CLOUDFLARE_TUNNEL_ID:-}" ]] &&
    [[ "${PROJECT_CLOUDFLARE_TUNNEL_ID}" != REPLACE_WITH_* ]]; then
    pass "Cloudflare tunnel ID is configured"
else
    warn "Cloudflare tunnel ID unset (ok — apex/www currently target Vercel)"
fi

if command_exists dig; then
    ns_records="$(dig +short @"1.1.1.1" "$PROJECT_CLOUDFLARE_ZONE_NAME" NS 2>/dev/null || true)"
    if printf '%s\n' "$ns_records" | grep -qi 'cloudflare\.com'; then
        pass "Authoritative NS are Cloudflare for $PROJECT_CLOUDFLARE_ZONE_NAME"
        while IFS= read -r ns; do
            [[ -z "$ns" ]] && continue
            pass "NS: $ns"
        done < <(printf '%s\n' "$ns_records" | sed '/^$/d' | sort -u)
    else
        fail "NS for $PROJECT_CLOUDFLARE_ZONE_NAME are not Cloudflare (found: ${ns_records:-<none>})"
    fi
else
    warn "dig not available; skipped Cloudflare NS check"
fi

if command_exists curl; then
    # DNS-only (grey cloud) → origin headers (Vercel). Proxied (orange) → cf-ray.
    headers="$(curl -sSI --max-time 8 "$PROJECT_SITE_URL" 2>/dev/null || true)"
    if printf '%s' "$headers" | grep -qi '^cf-ray:'; then
        pass "HTTPS response includes cf-ray (Cloudflare proxy enabled)"
    elif printf '%s' "$headers" | grep -qi '^server:[[:space:]]*Vercel'; then
        pass "HTTPS served by Vercel (Cloudflare DNS-only / not proxied — expected today)"
    elif [[ -n "$headers" ]]; then
        warn "HTTPS responded but neither cf-ray nor Vercel server header seen"
    else
        warn "Could not fetch HTTPS headers for Cloudflare/Vercel mode check"
    fi
fi

if command_exists cloudflared; then
    if cloudflared --version >/dev/null 2>&1; then
        pass "cloudflared is operational"
    else
        warn "cloudflared exists but did not return a version"
    fi
fi

section "Live DNS / HTTPS (read-only)"

IFS=',' read -r -a HOSTNAMES <<< "$PROJECT_SITE_HOSTNAMES"

if command_exists dig; then
    for hostname in "${HOSTNAMES[@]}"; do
        hostname="$(echo "$hostname" | xargs)"
        [[ -z "$hostname" ]] && continue

        if dig +short @"1.1.1.1" "$hostname" A | grep -Eq '^[0-9]'; then
            pass "DNS A via 1.1.1.1 for $hostname"
        elif dig +short @"1.1.1.1" "$hostname" CNAME | grep -q '.'; then
            pass "DNS CNAME via 1.1.1.1 for $hostname"
        else
            warn "No A/CNAME via 1.1.1.1 for $hostname"
        fi
    done

    # www should CNAME (or resolve) toward Vercel when using CF DNS → Vercel
    www_cname="$(dig +short @"1.1.1.1" "www.${PROJECT_CLOUDFLARE_ZONE_NAME}" CNAME 2>/dev/null | head -n 1 || true)"
    if [[ "$www_cname" == *vercel-dns* || "$www_cname" == *vercel.app* ]]; then
        pass "www CNAME points at Vercel ($www_cname)"
    elif [[ -n "$www_cname" ]]; then
        warn "www CNAME is $www_cname (expected vercel-dns* if DNS → Vercel)"
    fi
else
    warn "dig not available; skipped live DNS checks"
fi

if command_exists curl; then
    if https_reachable "$PROJECT_SITE_URL"; then
        pass "HTTPS reachable: $PROJECT_SITE_URL"
    else
        warn "HTTPS check failed: $PROJECT_SITE_URL"
    fi

    www_url="https://www.${PROJECT_CLOUDFLARE_ZONE_NAME}"
    if https_reachable "$www_url"; then
        pass "HTTPS reachable: $www_url"
    else
        warn "HTTPS check failed: $www_url"
    fi
else
    warn "curl not available; skipped HTTPS checks"
fi

section "Safeguards"

if git -C "$WORKSPACE_ROOT" ls-files | grep -E '(^|/)\.env\.local$|(^|/)\.env$|(^|/)\.env\.infrastructure\.local$' >/dev/null; then
    fail "Tracked secret env file(s) in git"
else
    pass "No tracked .env / .env.local / .env.infrastructure.local"
fi

if [[ -f "$WORKSPACE_ROOT/.gitignore" ]] &&
    grep -qE '(^|/)\.env\.infrastructure\.local$|\.env\.infrastructure\.local' "$WORKSPACE_ROOT/.gitignore"; then
    pass ".env.infrastructure.local is listed in .gitignore"
else
    fail ".env.infrastructure.local is not listed in .gitignore"
fi

if git -C "$WORKSPACE_ROOT" ls-files | grep -E '\.pem$|\.key$|\.pfx$' >/dev/null; then
    fail "Repo tracks certificate/key files"
else
    pass "No tracked .pem/.key/.pfx files"
fi

if [[ -f "$WORKSPACE_ROOT/.github/workflows/ci.yml" ]]; then
    pass "GitHub Actions CI workflow present"
else
    warn "No .github/workflows/ci.yml"
fi

printf '\n========================================\n'
printf 'Doctor summary\n'
printf '========================================\n'
printf 'Passed:   %d\n' "$PASS_COUNT"
printf 'Warnings: %d\n' "$WARN_COUNT"
printf 'Failed:   %d\n' "$FAIL_COUNT"

if (( FAIL_COUNT > 0 )); then
    printf '\nPROJECT CONTEXT FAILED\n' >&2
    exit 1
fi

printf '\nPROJECT CONTEXT VERIFIED\n'

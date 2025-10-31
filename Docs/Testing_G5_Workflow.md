# Testing G5: Weekly Events Auto-Update Workflow

## Quick Testing Guide

### 1. Verify GitHub Secrets Are Configured

The workflow needs these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**To check if secrets are set:**
1. Go to your GitHub repository: `https://github.com/YOUR_ORG/charlottecarshows-starter`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Verify these secrets exist:
   - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anonymous key)

**If missing:**
- Click **New repository secret**
- Add each secret with the values from your `.env.local` file

---

### 2. Manual Testing via GitHub UI

The workflow has `workflow_dispatch: {}` enabled, so you can trigger it manually:

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Select **"Weekly events export & deploy"** workflow (left sidebar)
4. Click **"Run workflow"** button (top right)
5. Select the branch (usually `main`)
6. Click **"Run workflow"**

**What to watch for:**
- ✅ Green checkmark = success
- ❌ Red X = failure (click to see error logs)

---

### 3. How to Find Error Logs

If the workflow fails, here's where to look:

1. **In GitHub Actions:**
   - Go to **Actions** tab
   - Click the failed workflow run (red X)
   - Expand each step to see error messages
   - Look for errors in:
     - "Install dependencies" step
     - "Run exporter" step (most likely place for errors)
     - "Commit updated data" step
     - "Trigger Netlify deploy hook" step

2. **Common Error Messages to Look For:**
   - `Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY` → Secrets not configured
   - `export_venues RPC failed` → Supabase RPC function issue
   - `export_events_extended RPC failed` → Supabase RPC function issue
   - `Permission denied` → Git push permission issue
   - `Unable to locate credential` → GitHub token/permission issue

---

### 4. Testing Locally (Before Pushing)

You can test the export script locally to catch errors early:

```bash
# Make sure you have .env.local with Supabase credentials
pnpm export:json

# Or directly:
node scripts/export-json.mjs
```

**Expected output:**
```
Exported X events and Y venues.
```

**If it fails locally:**
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify Supabase RPC functions exist: `export_venues` and `export_events_extended`
- Check your Supabase connection

---

### 5. What to Send Me for Debugging

If you're getting errors, send me:

1. **Screenshot or copy of the error:**
   - From GitHub Actions → failed workflow run → expanded error step
   - Or the full error message from the logs

2. **Which step failed:**
   - Install dependencies?
   - Run exporter?
   - Commit updated data?
   - Trigger Netlify deploy hook?

3. **Error message text:**
   - Copy the exact error message (e.g., "Missing NEXT_PUBLIC_SUPABASE_URL...")

4. **Quick checks:**
   - ✅ Are the secrets configured in GitHub?
   - ✅ Does `pnpm export:json` work locally?
   - ✅ Are the Supabase RPC functions working?

---

## Workflow File Reference

The workflow file is: `.github/workflows/update-events-and-deploy.yml`

**Current schedule:**
- Cron: `0 4 * * 1` (Monday 04:00 UTC = Sunday 11:00 PM ET during EST)

**What it does:**
1. Checks out code
2. Sets up Node.js and installs dependencies
3. Runs `scripts/export-json.mjs` to export events/venues from Supabase
4. Commits updated data files if changed
5. Optionally triggers Netlify deploy hook

---

## Troubleshooting Checklist

- [ ] Secrets configured in GitHub repository settings
- [ ] Local export works: `pnpm export:json`
- [ ] Supabase RPC functions exist and work
- [ ] GitHub Actions has permission to push to repository
- [ ] Workflow file syntax is valid (YAML)

---

## Next Steps After Testing

Once the workflow works:
1. Monitor it over the next few weeks to verify reliability
2. Check that it runs on schedule (Sunday night ET)
3. Verify commits are being made to the repository
4. Confirm Netlify deploys are triggered (if configured)


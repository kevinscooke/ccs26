# Testing G5: Weekly Rebuild Trigger Workflow

## Quick Testing Guide

### ✅ **No Secrets Required!**

This simplified workflow just triggers a Netlify rebuild by committing a timestamp file. No Supabase secrets needed - your `events.json` is already in the repo!

### What the Workflow Does:

1. **Updates a timestamp file** (`.github/build-trigger.txt`)
2. **Commits and pushes** it with `[ci skip]`
3. **Triggers Netlify rebuild** (via auto-deploy or deploy hook)
4. **Netlify rebuilds** with the latest `events.json` from your repo

### Optional: Netlify Deploy Hook (Optional)

If you want to trigger a Netlify build hook directly (instead of relying on auto-deploy):
1. Go to Netlify → Site settings → Build & deploy → Build hooks
2. Create a build hook (or use existing)
3. Add as GitHub secret: `NETLIFY_DEPLOY_HOOK`
4. The workflow will use it, otherwise it just relies on git push → auto-deploy

---

### 2. Manual Testing via GitHub UI

The workflow has `workflow_dispatch: {}` enabled, so you can trigger it manually:

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Select **"Weekly rebuild trigger"** workflow (left sidebar)
4. Click **"Run workflow"** button (top right)
5. Select the branch (usually `main`)
6. Click **"Run workflow"`

**What to watch for:**
- ✅ Green checkmark = success (should take ~5-10 seconds)
- ❌ Red X = failure (click to see error logs)

**Expected output:**
- Step 1: Checkout code ✅
- Step 2: Update build trigger timestamp ✅
  - Creates/updates `.github/build-trigger.txt`
  - Commits with message: "chore: weekly build trigger [ci skip]"
  - Pushes to branch
- Step 3: Trigger Netlify deploy hook (optional) ✅
  - Either calls deploy hook OR relies on auto-deploy from push

**Verify it worked:**
1. Check that `.github/build-trigger.txt` was updated in your repo
2. Check Netlify dashboard for new build triggered
3. Verify site rebuilt successfully

---

### 3. How to Find Error Logs

If the workflow fails, here's where to look:

1. **In GitHub Actions:**
   - Go to **Actions** tab
   - Click the failed workflow run (red X)
   - Expand each step to see error messages
   - Look for errors in:
     - "Checkout code" step
     - "Update build trigger timestamp" step (most likely place for errors)
     - "Trigger Netlify deploy hook" step

2. **Common Error Messages to Look For:**
   - `Permission denied` → Git push permission issue (check `persist-credentials: true`)
   - `Unable to locate credential` → GitHub token/permission issue
   - `fatal: not a git repository` → Checkout step failed
   - `NETLIFY_DEPLOY_HOOK` errors → Non-critical, just means deploy hook wasn't configured

---

### 4. Testing Locally (Before Pushing)

You can test the workflow logic locally:

```bash
# Simulate what the workflow does:
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
echo "# Weekly build trigger - $TIMESTAMP" > .github/build-trigger.txt
git add .github/build-trigger.txt
git commit -m "chore: weekly build trigger [ci skip]"
git push
```

**Expected result:**
- File `.github/build-trigger.txt` gets created/updated
- Commit is made and pushed
- Netlify should trigger a rebuild (if auto-deploy is enabled)

---

### 5. What to Send Me for Debugging

If you're getting errors, send me:

1. **Screenshot or copy of the error:**
   - From GitHub Actions → failed workflow run → expanded error step
   - Or the full error message from the logs

2. **Which step failed:**
   - Checkout code?
   - Update build trigger timestamp?
   - Trigger Netlify deploy hook?

3. **Error message text:**
   - Copy the exact error message

4. **Quick checks:**
   - ✅ Does the repo have push permissions?
   - ✅ Is `persist-credentials: true` in the workflow?
   - ✅ Can you manually push to the branch?

---

## Workflow File Reference

The workflow file is: `.github/workflows/update-events-and-deploy.yml`

**Current schedule:**
- Cron: `0 4 * * 1` (Monday 04:00 UTC = Sunday 11:00 PM ET during EST)

**What it does:**
1. Checks out code
2. Updates `.github/build-trigger.txt` with current timestamp
3. Commits and pushes the change (triggers Netlify auto-deploy)
4. Optionally triggers Netlify deploy hook (if configured)

**Why this works:**
- Your `events.json` is already in the repo
- Just need to trigger a rebuild to pick up latest data
- Git push triggers Netlify auto-deploy (if configured)
- Simple, fast, reliable - no external dependencies!

---

## Troubleshooting Checklist

- [ ] GitHub Actions has permission to push to repository
- [ ] Workflow file syntax is valid (YAML)
- [ ] `.github/build-trigger.txt` file exists (or can be created)
- [ ] Netlify auto-deploy is enabled OR `NETLIFY_DEPLOY_HOOK` secret is configured
- [ ] Can manually push to the branch

---

## Next Steps After Testing

Once the workflow works:
1. Monitor it over the next few weeks to verify reliability
2. Check that it runs on schedule (Sunday night ET)
3. Verify commits are being made to the repository
4. Confirm Netlify deploys are triggered (if configured)


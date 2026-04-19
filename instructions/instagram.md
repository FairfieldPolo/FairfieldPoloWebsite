# Instagram (“Follow the action”)

The homepage block that shows recent Instagram posts uses **Behold** (behold.so), not a manual upload in Sanity.

## What controls the feed

1. **`NEXT_PUBLIC_BEHOLD_WIDGET_ID`** — the feed/widget ID from Behold’s embed code. Without it, the feed area may be empty or hidden.
2. **`NEXT_PUBLIC_INSTAGRAM_HANDLE`** — the `@handle` shown in the heading and follow link (for example `fairfieldpoloclub`).

## What you do day to day

- Post to Instagram as usual; Behold pulls public posts into the widget.
- If you change accounts or create a new Behold widget, ask whoever manages deployment to update the widget ID and handle in the site’s environment variables, then redeploy if needed.

Connecting Instagram to Behold and creating the widget happens in the **Behold dashboard**, not in Sanity.

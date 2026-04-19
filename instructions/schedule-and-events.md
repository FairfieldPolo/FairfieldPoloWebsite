# Schedule & events

The **Schedule** (`/schedule`) and **Events** (`/events`) pages both pull from the same place: **Event** documents in Sanity Studio.

## What shows on the schedule

- Only events whose **Start date & time** is **in the future** appear on `/schedule` and in the upcoming lists on `/events`.
- Past events drop off the schedule automatically when their start time passes.
- The **Events** page also shows a **Past events** section (recent history), driven by the same events.

## Adding or changing a game or event

1. In Studio, open **Event** (or create **New → Event**).
2. Fill in at least:
   - **Event title**
   - **URL slug** — click “Generate” from the title; this becomes the link `yoursite.com/events/[slug]`.
   - **Start date & time** — this controls ordering and whether the event is “upcoming.”
3. Optional but useful:
   - **End date & time** — for multi-hour or multi-day items.
   - **Event type** (match, tournament, charity, etc.) — controls the colored label on the schedule.
   - **Short description** — appears on cards and lists (keep it brief).
   - **Full description** — the long text on the event detail page.
   - **Event image** — add alt text for accessibility.
   - **Location**, **Admission fee**, **Ticket / registration URL** — shown on the detail page when set.
   - **Open to the public?** — informational; use with **Event type** so members understand access.

4. **Publish** (or save draft if your workflow uses drafts).

## Homepage “Featured” strip

The homepage shows up to four **upcoming** events that have **Feature on homepage?** turned on. To highlight a match:

1. Edit the event and enable **Feature on homepage?**
2. Ensure the start date is still in the future.

## Season title on the schedule page

The schedule page heading (for example “2025 Season Schedule”) is set in the **website code**, not in Sanity. When the season year changes, a developer updates that page title and metadata in the repo.

## Add to calendar (.ics)

Event pages can offer a calendar download. The app builds that file from the event’s dates and title. You do not upload a separate file—just keep **Start** (and **End**, if used) accurate in Sanity.

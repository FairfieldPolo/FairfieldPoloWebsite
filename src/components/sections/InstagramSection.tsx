import Link from 'next/link'

// Behold.so is the recommended embed for Instagram feeds on Next.js.
// Sign up at behold.so, create a widget, paste the widget ID below.
// Free tier supports ~6 posts. No API approval needed.
// Replace BEHOLD_WIDGET_ID with your actual widget ID from behold.so

const BEHOLD_WIDGET_ID = process.env.NEXT_PUBLIC_BEHOLD_WIDGET_ID ?? ''
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'fairfieldpoloclub'

export function InstagramSection() {
  return (
    <section className="section-cream section-pad-sm">
      <div className="container-polo">

        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="gold-rule mb-4" />
            <h2 className="heading-section text-polo-green">
              Follow the action
            </h2>
            <p className="font-body text-gray-500 mt-2">
              @{INSTAGRAM_HANDLE} on Instagram
            </p>
          </div>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-outline text-sm py-2 px-5 items-center gap-2"
          >
            {/* Instagram icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            Follow us
          </a>
        </div>

        {/* Behold embed — loads client-side */}
        {BEHOLD_WIDGET_ID ? (
          <div className="w-full">
            {/* Behold widget script loads the feed */}
            <div id={`behold-widget-${BEHOLD_WIDGET_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(){
                    var s = document.createElement('script');
                    s.src = 'https://w.behold.so/widget.js';
                    s.type = 'module';
                    document.head.appendChild(s);
                  })();
                `,
              }}
            />
          </div>
        ) : (
          /* Fallback: placeholder grid until Behold is configured */
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-polo-green/10 rounded-sm flex items-center justify-center hover:bg-polo-green/20 transition-colors group"
                aria-label="View on Instagram"
              >
                <svg
                  width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="text-polo-green/30 group-hover:text-polo-green/50 transition-colors"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Mobile follow link */}
        <div className="mt-6 text-center sm:hidden">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full"
          >
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  )
}

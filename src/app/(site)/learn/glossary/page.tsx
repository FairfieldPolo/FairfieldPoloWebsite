import type { Metadata } from 'next'
import Link from 'next/link'

import { PoloFieldSilhouette } from '@/components/ui/PoloFieldSilhouette'

export const metadata: Metadata = {
  title: 'Polo Terms to Know',
  description:
    'Chukker, line of the ball, handicaps, positions, and key polo vocabulary—explained for Fairfield Polo Club fans.',
}

type Subsection = { label: string; text: string }

type GlossaryEntry = {
  id: string
  title: string
  body: string
  subsections?: Subsection[]
}

/** Content adapted from the former club glossary: https://wichitapolo.org/polo-terms-to-know */
const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'chukker',
    title: 'Chukker',
    body: 'A period of play in the sport of polo. A game consists of either four or six chukkers. A chukker is seven minutes and thirty seconds. There will be a horn sounded at thirty seconds and a double horn when the clock hits zero to alert players and umpires that the chukker is over. If there is a goal scored, a foul committed, or the ball is hit out of bounds in chukkers one through 3 (in a four chukker game) or 5 (in a six chukker game) after the thirty second horn has sounded, the chukker will end. In the final chukker of the game, the last thirty seconds will be played out.',
  },
  {
    id: 'foul',
    title: 'Foul',
    body: 'An infraction of the rules. Polo is played by rules set by the United States Polo Association.',
  },
  {
    id: 'goal',
    title: 'Goal',
    body: 'A goal is scored any time the ball travels through the goal posts, which are 24 feet apart. Each time a goal is scored, the teams switch directions so that there is no wind, sun, or field advantage.',
  },
  {
    id: 'handicap',
    title: 'Handicap',
    body: "Handicaps can range from -1 to 10 goals. Each player is given a USPA handicap based on their playing ability. To play in USPA clubs, each player must also be a member of the United States Polo Association. All four team members' handicaps add up to determine their goal rating for a tournament.",
  },
  {
    id: 'hook',
    title: 'Hook',
    body: "One of the defensive maneuvers allowed under the rules. A mallet may be used to block another player's shot at the ball, although it must be used in an appropriate manner. Unsafe hooking or hitting into a pony is a foul.",
  },
  {
    id: 'bump-ride-off',
    title: 'Bump or ride-off',
    body: 'This is when two players, riding at the same speed and equal angle, push each other off the ball.',
  },
  {
    id: 'knock-in',
    title: 'Knock-in',
    body: "A knock-in takes place when the ball goes over the back line, wide of the goal mouth, by the attacking team. The defending team hits the ball back into play from the back line.",
  },
  {
    id: 'line-of-the-ball',
    title: 'Line of the ball',
    body: 'The imaginary line created by the ball as it travels on the field of play. This is the crucial concept that is the basis of play on the polo field.',
  },
  {
    id: 'mallet',
    title: 'Mallet',
    body: "This is the tool used to hit a polo ball. The shaft of the mallet is usually made of bamboo so it can give or bend when swung. The head of the mallet is hardwood. The ball is hit with the side of the mallet head, not the end. Each mallet is unique and custom to each player's preferences.",
  },
  {
    id: 'out-of-bounds',
    title: 'Out of bounds',
    body: "When a ball is hit over the side-lines, it is out of bounds. The clock continues to run. The umpire will count to 8 and then drop the ball in favor of the team who did not hit the ball out of bounds. That team will have 5 seconds to put the ball back into play.",
  },
  {
    id: 'penalties',
    title: 'Penalties',
    body: 'There are several different penalties in the sport of polo. When a foul is committed, the umpire will award a penalty. Penalties are awarded depending on the severity of the foul. The most common awarded are 2s, 3s, 4s, and 5s.',
    subsections: [
      {
        label: 'Penalty 2',
        text: 'One shot for the team fouled from 30 yards to goal, undefended.',
      },
      {
        label: 'Penalty 3',
        text: 'One shot for the team fouled from 40 yards to goal, undefended.',
      },
      {
        label: 'Penalty 4',
        text: 'One shot for the team fouled from 60 yards to goal, defended.',
      },
      {
        label: 'Penalty 5',
        text: 'Can either be from the “spot” of the foul or from center field.',
      },
    ],
  },
  {
    id: 'positions',
    title: 'Positions',
    body: 'Each number has a different role on the field.',
    subsections: [
      {
        label: 'Number 1',
        text: 'The most offensive player—similar to a forward in hockey or soccer.',
      },
      {
        label: 'Number 2',
        text: 'Primarily an offensive player but also responsible for defense, interchanging with the #3 player. The #2 player is often the second-highest rated player on the team.',
      },
      {
        label: 'Number 3',
        text: 'Both defensive and offensive. This player needs to be able to transition from offense to defense quickly and may be the highest-rated player on the team. The #3 must be a long, accurate hitter but capable of close-in stick work and ball control.',
      },
      {
        label: 'Number 4',
        text: 'The back. This is a defensive position, but a good back must not only be able to hit a good back shot—he or she must also be able to turn the play from defense to offense quickly. The #4 can be the highest-rated player on the team: the last line of defense.',
      },
    ],
  },
  {
    id: 'referee',
    title: 'Referee (third man)',
    body: 'The third official, usually stationed on the sidelines at midfield. Should the mounted umpires disagree, the referee makes the final decision.',
  },
  {
    id: 'safety',
    title: 'Safety',
    body: "When the ball is hit over the back line, wide of the goal mouth, by a defending player's mallet, a whistle will blow, stopping the clock, and the attacking team will be given a shot on goal from 60 yards, even with where the ball went over the back line. This is executed the same as a Penalty 4: one shot at goal, defended.",
  },
  {
    id: 'neck-shot',
    title: 'Neck shot',
    body: 'A ball hit under the neck of a pony, from the “near” side or “off” side.',
  },
  {
    id: 'off-side',
    title: 'Off side',
    body: 'A shot taken on the right side of the horse—can be both forward and backward.',
  },
  {
    id: 'near-side',
    title: 'Near side',
    body: 'A shot taken on the left side of the horse—can be both forward and backward.',
  },
  {
    id: 'tail-shot',
    title: 'Tail shot',
    body: "Hitting a ball backwards, behind the horse's hind legs.",
  },
  {
    id: 'throw-in',
    title: 'Throw-in',
    body: 'The throw-in begins play at the start of the game, after each goal, and to begin a new chukker if the ball ended in a neutral area. The ball is bowled in between two lines of players, ideally lined up numerically.',
  },
  {
    id: 'umpire',
    title: 'Umpire',
    body: "The on-field official in charge of administering the rules. Two umpires are on the field during the game and usually wear black and white, vertically striped shirts.",
  },
  {
    id: 'uspa',
    title: 'U.S.P.A.',
    body: 'The United States Polo Association: the governing body of polo in the United States.',
  },
]

export default function GlossaryPage() {
  return (
    <>
      <header className="relative overflow-hidden min-h-[38vh] md:min-h-[42vh] flex flex-col justify-end">
        <div className="absolute inset-0 bg-polo-green" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-polo-green via-polo-green/95 to-polo-green-mid/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_100%_0%,rgba(201,168,76,0.12),transparent_50%)]"
          aria-hidden
        />
        <PoloFieldSilhouette className="absolute -right-4 bottom-0 w-[min(100%,32rem)] opacity-[0.07] text-polo-cream pointer-events-none" />

        <div className="relative z-10 container-polo pt-32 pb-12 md:pb-16">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-1 font-body text-sm text-polo-cream/70 hover:text-polo-gold transition-colors"
          >
            <span aria-hidden>←</span> Learn polo
          </Link>
          <h1 className="heading-display text-polo-cream max-w-3xl">Polo terms to know</h1>
          <p className="mt-4 max-w-2xl font-body text-lg text-polo-cream/80 leading-relaxed">
            A quick reference for the language you&apos;ll hear on the field and in the grandstand
          </p>
        </div>
      </header>

      <article className="section-cream section-pad border-t border-polo-cream-dark/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-body text-gray-600 text-center max-w-2xl mx-auto mb-4">
            Terms below are from the club&apos;s original{' '}
            <a
              href="https://wichitapolo.org/polo-terms-to-know"
              target="_blank"
              rel="noopener noreferrer"
              className="text-polo-green font-medium hover:underline underline-offset-2"
            >
              Polo terms to know
            </a>{' '}
            page (lightly edited for clarity).
          </p>
          <p className="font-body text-sm text-center text-gray-500 max-w-2xl mx-auto mb-12 md:mb-14">
            For the official rules, see the USPA:{' '}
            <a
              href="https://www.uspolo.org/sport/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-polo-green hover:underline"
            >
              uspolo.org/sport/rules
            </a>
            .
          </p>

          <div className="space-y-8 md:space-y-10">
            {GLOSSARY.map((entry) => (
              <section
                key={entry.id}
                id={entry.id}
                className="card p-6 md:p-8 scroll-mt-24"
              >
                <h2 className="font-display text-2xl text-polo-green font-bold mb-4">
                  {entry.title}
                </h2>
                <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed">
                  {entry.body}
                </p>
                {entry.id === 'uspa' && (
                  <p className="mt-3">
                    <a
                      href="https://www.uspolo.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-polo-green font-medium border-b-2 border-polo-gold/50 hover:border-polo-gold transition-colors"
                    >
                      uspolo.org
                    </a>
                    <span className="text-polo-gold" aria-hidden>
                      {' '}
                      ↗
                    </span>
                  </p>
                )}
                {entry.subsections && entry.subsections.length > 0 && (
                  <ul className="mt-5 space-y-4 list-none pl-0 border-t border-polo-cream-dark/50 pt-5">
                    {entry.subsections.map((s) => (
                      <li key={s.label}>
                        <h3 className="font-body font-semibold text-polo-green text-sm mb-1">
                          {s.label}
                        </h3>
                        <p className="font-body text-sm text-gray-600 leading-relaxed pl-0">
                          {s.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function About() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>About Me</h1>
      <p>
        I am Erkin George, a Software Developer and Computer Science graduate.
        Based out of Seattle, I love reading, video games, working out, software development and cats.
      </p>
    </div>
  )
}

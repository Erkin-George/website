import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="text-slate-600 dark:text-slate-400">You can reach me at the following:</p>
      <ul className="space-y-3">
        <li>
          <a
            href="mailto:erkin.george@gmail.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            erkin.george@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/erkin-george/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            LinkedIn Profile
          </a>
        </li>
      </ul>
    </div>
  )
}

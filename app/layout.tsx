import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Erkin George',
    template: '%s | Erkin George',
  },
  description: 'Software Developer based in Seattle',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col`}>
        <header className="border-b border-slate-200 dark:border-slate-800">
          <nav className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-semibold tracking-tight hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Erkin George
            </Link>
            <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                About
              </Link>
              <Link href="/blog" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Contact
              </Link>
            </div>
          </nav>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 w-full flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl mx-auto px-4 py-6 text-sm text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} Erkin George
          </div>
        </footer>
      </body>
    </html>
  )
}

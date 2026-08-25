import Link from "next/link"
import "@/components/cinematic-site.css"
import "@/components/not-found.css"

export const metadata = {
  title: "Page not found · Viper Net",
  description: "That page is not here. The work, the process and the way to reach me are on the front page.",
}

export default function NotFound() {
  return (
    <div className="vn-root">
      <main className="vn-nf">
        <div className="vn-nf-glow" aria-hidden="true" />
        <div className="vn-nf-inner">
          <div className="vn-nf-line" aria-hidden="true" />
          <p className="vn-chip">404</p>
          <h1>This page is not here.</h1>
          <p className="vn-lead">
            The link is wrong, or the page moved. The work, the process and the way to reach me are all one click away.
          </p>
          <div className="vn-settle-cta">
            <Link className="vn-btn vn-btn-accent" href="/">
              Back to the front page
            </Link>
            <Link className="vn-btn vn-btn-ghost" href="/#start">
              Start a project
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

import Link from "next/link";

export const metadata = {
  title: "Safety, privacy and accessibility | Bangla Adventures",
  description: "Plain-language data boundaries, accessibility targets, external media safeguards and independent review status for Bangla Adventures.",
};

export default function SafetyPage() {
  return (
    <main className="adult-app safety-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Safety & access</small></span></Link>
        <nav aria-label="Platform information"><Link href="/">Learner site</Link><a href="/family">Grown-up dashboard</a><a className="active" href="/safety">Safety & access</a></nav>
        <div className="adult-account"><span>Updated August 2026</span></div>
      </header>

      <div className="safety-content">
        <section className="safety-hero">
          <p className="adult-eyebrow">Plain-language platform record</p>
          <h1>Small data footprint. Visible boundaries. Human review still required.</h1>
          <p>Bangla Adventures is built to let children learn without creating accounts, sharing identities or uploading speech. The adult workspace adds optional profiles and cloud progress under an authenticated grown-up’s control.</p>
          <div className="safety-status-row">
            <span className="implemented"><i>✓</i><strong>Implemented</strong>technical safeguard</span>
            <span className="review"><i>↺</i><strong>Review needed</strong>external sign-off</span>
            <span className="boundary"><i>—</i><strong>Not collected</strong>outside product scope</span>
          </div>
        </section>

        <section className="safety-summary-grid">
          <article><span>☂</span><h2>No child sign-in</h2><p>Learners can use all 108 sessions anonymously. Adult-managed profiles use only a display name, broad optional age band and general language list.</p><strong className="status-tag implemented">Implemented</strong></article>
          <article><span>◉</span><h2>Mic stays local</h2><p>Record-and-compare asks permission only after a deliberate click. The recording remains in the tab, is not uploaded and can be deleted immediately.</p><strong className="status-tag implemented">Implemented</strong></article>
          <article><span>▶</span><h2>YouTube stays off</h2><p>External video is click-to-load through YouTube’s privacy-enhanced domain. Direct links and playlists remain external and need adult supervision.</p><strong className="status-tag implemented">Implemented</strong></article>
          <article><span>AA</span><h2>Accessibility target</h2><p>The interface is designed toward WCAG 2.2 AA, with keyboard access, focus styles, reduced motion and alternatives to speech. It has not yet passed an independent audit.</p><strong className="status-tag review">Audit required</strong></article>
        </section>

        <section className="safety-section data-map-section">
          <header><p className="adult-eyebrow">Data map</p><h2>What moves where</h2><p>No advertising profile, chat transcript, child email, exact birthday, school, photo, location or uploaded learner voice is part of the product model.</p></header>
          <div className="data-map-table" role="table" aria-label="Data collection map">
            <div className="data-map-head" role="row"><span role="columnheader">Data</span><span role="columnheader">Where it lives</span><span role="columnheader">Why</span><span role="columnheader">Control</span></div>
            <div role="row"><strong role="cell">Anonymous stars & session IDs</strong><span role="cell">This browser</span><span role="cell">Resume learning offline</span><span role="cell">Reset from Grown-ups panel</span></div>
            <div role="row"><strong role="cell">Adult-managed learner profile</strong><span role="cell">Encrypted platform database</span><span role="cell">Assignments and cross-device progress</span><span role="cell">Authenticated grown-up only</span></div>
            <div role="row"><strong role="cell">Optional speaking rehearsal</strong><span role="cell">Memory in the open browser tab</span><span role="cell">Hear and reflect on one’s own delivery</span><span role="cell">Delete instantly; never uploaded</span></div>
            <div role="row"><strong role="cell">Approved human lesson audio</strong><span role="cell">Platform object storage</span><span role="cell">Serve reviewed pronunciation models</span><span role="cell">Named speaker consent and editorial approval</span></div>
            <div role="row"><strong role="cell">YouTube request</strong><span role="cell">YouTube after explicit load</span><span role="cell">Play an external lesson resource</span><span role="cell">Do not load; use transcript/activity instead</span></div>
          </div>
        </section>

        <section className="safety-section two-column-safety">
          <div>
            <p className="adult-eyebrow">Children’s privacy</p>
            <h2>Current Australian review point</h2>
            <p>As of August 2026, Australia’s privacy regulator says the final Children’s Online Privacy Code is due to be in place and registered by 10 December 2026. The platform therefore records legal/privacy review as a release gate; it does not claim future-code compliance before a qualified review against the final text.</p>
            <a href="https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code" target="_blank" rel="noreferrer">OAIC Children’s Online Privacy Code ↗</a>
          </div>
          <div>
            <p className="adult-eyebrow">External media</p>
            <h2>Privacy-enhanced is not risk-free</h2>
            <p>Embeds use <code>youtube-nocookie.com</code> and do not connect until a learner presses load. YouTube still controls its player, captions, recommendations and availability. Each lesson has before/during/after pedagogy plus an adult review record.</p>
            <a href="https://support.google.com/youtube/answer/171780?hl=en" target="_blank" rel="noreferrer">YouTube embed and privacy-enhanced guidance ↗</a>
          </div>
        </section>

        <section className="safety-section accessibility-record">
          <header><div><p className="adult-eyebrow">Accessibility record</p><h2>Designed toward WCAG 2.2 AA—not yet certified</h2></div><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">Read WCAG 2.2 ↗</a></header>
          <div className="accessibility-checks">
            <article className="done"><span>✓</span><div><h3>Keyboard and visible focus</h3><p>Buttons, tabs, checks and forms use native controls with strong focus indicators.</p></div></article>
            <article className="done"><span>✓</span><div><h3>Sound alternatives</h3><p>Dialogues include Bangla script, transliteration and English scaffolds; audio is replayable and never the only route.</p></div></article>
            <article className="done"><span>✓</span><div><h3>Motion and pressure controls</h3><p>Reduced-motion preferences are respected; there are no timers, streak loss or pronunciation scores.</p></div></article>
            <article className="done"><span>✓</span><div><h3>Responsive reading</h3><p>Layouts adapt to small screens, Bangla text has generous line spacing and learner writing can be resized.</p></div></article>
            <article className="review"><span>↺</span><div><h3>Screen-reader and zoom audit</h3><p>Automated checks plus testing at 200–400% zoom and with current assistive technology remain required.</p></div></article>
            <article className="review"><span>↺</span><div><h3>Caption audit</h3><p>Third-party caption quality and exact timestamp suitability must be checked and periodically rechecked by an adult.</p></div></article>
          </div>
        </section>

        <section className="safety-section governance-record">
          <header><p className="adult-eyebrow">Human governance</p><h2>Six named gates per module</h2><p>The Content Studio creates 108 review records across 18 modules. Approval is not pre-filled, and the software does not impersonate a cultural, educational, accessibility or legal reviewer.</p></header>
          <ol><li><span>01</span><strong>Bangla language</strong><p>Grammar, register, transliteration and pronunciation.</p></li><li><span>02</span><strong>Cultural representation</strong><p>Specificity, plurality, sourcing and community perspective.</p></li><li><span>03</span><strong>Child-development</strong><p>Age fit, cognitive load, learning design and safeguarding.</p></li><li><span>04</span><strong>Accessibility</strong><p>Assistive technology, zoom, captions, alternatives and usability.</p></li><li><span>05</span><strong>External media</strong><p>Availability, suitability, captions and precise learning segment.</p></li><li><span>06</span><strong>Legal & privacy</strong><p>Current law, notices, consent, retention and contracts.</p></li></ol>
        </section>

        <footer className="safety-footer"><div><strong>See something we should change?</strong><p>Record it in the Content Studio review notes and do not approve the affected gate until it is resolved.</p></div><a className="primary-button" href="/studio">Open Content Studio →</a></footer>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";

export default function SafetyContent() {
  const [language, toggleLanguage] = useLanguage();
  const bn = language === "bn";
  const s = (en: string, bnText: string) => (bn ? bnText : en);

  return (
    <main className="adult-app safety-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</small></span></Link>
        <nav aria-label="Platform information">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <a href="/family">{s("Grown-up dashboard", "বড়দের ড্যাশবোর্ড")}</a>
          <a className="active" href="/safety">{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</a>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>
            {s("বাংলায় দেখুন", "View in English")}
          </button>
        </div>
      </header>

      <div className="safety-content">
        <section className="safety-hero">
          <p className="adult-eyebrow">{s("Plain-language platform record", "সহজ ভাষায় প্ল্যাটফর্মের বিবরণ")}</p>
          <h1>{s("Small data footprint. Visible boundaries. Human review still required.", "সামান্য তথ্য সংগ্রহ। স্পষ্ট সীমা। মানুষের পর্যালোচনা এখনও প্রয়োজন।")}</h1>
          <p>{s("Bangla Adventures is built to let children learn without creating accounts, sharing identities or uploading speech. The adult workspace adds optional profiles and cloud progress under an authenticated grown-up’s control.", "বাংলা অ্যাডভেঞ্চারস এমনভাবে তৈরি যাতে শিশুরা অ্যাকাউন্ট না খুলে, পরিচয় না জানিয়ে বা কণ্ঠ আপলোড না করেই শিখতে পারে। বড়দের অংশে একজন যাচাইকৃত অভিভাবকের নিয়ন্ত্রণে ঐচ্ছিক প্রোফাইল ও অগ্রগতি যুক্ত হয়।")}</p>
          <div className="safety-status-row">
            <span className="implemented"><i>✓</i><strong>{s("Implemented", "বাস্তবায়িত")}</strong>{s("technical safeguard", "কারিগরি সুরক্ষা")}</span>
            <span className="review"><i>↺</i><strong>{s("Review needed", "পর্যালোচনা দরকার")}</strong>{s("external sign-off", "বাইরের অনুমোদন")}</span>
            <span className="boundary"><i>—</i><strong>{s("Not collected", "সংগ্রহ করা হয় না")}</strong>{s("outside product scope", "পণ্যের আওতার বাইরে")}</span>
          </div>
        </section>

        <section className="safety-summary-grid">
          <article><span>☂</span><h2>{s("No child sign-in", "শিশুর সাইন-ইন নেই")}</h2><p>{s("Learners can use all 108 sessions anonymously. Adult-managed profiles use only a display name, broad optional age band and general language list.", "শিক্ষার্থীরা সব ১০৮টি সেশন নাম-পরিচয় ছাড়াই ব্যবহার করতে পারে। বড়দের পরিচালিত প্রোফাইলে কেবল একটি নাম, বিস্তৃত ঐচ্ছিক বয়সসীমা ও সাধারণ ভাষার তালিকা থাকে।")}</p><strong className="status-tag implemented">{s("Implemented", "বাস্তবায়িত")}</strong></article>
          <article><span>◉</span><h2>{s("Mic stays local", "মাইক্রোফোন স্থানীয় থাকে")}</h2><p>{s("Record-and-compare asks permission only after a deliberate click. The recording remains in the tab, is not uploaded and can be deleted immediately.", "রেকর্ড-করে-তুলনা কেবল ইচ্ছাকৃত ক্লিকের পরেই অনুমতি চায়। রেকর্ডিং ট্যাবেই থাকে, আপলোড হয় না এবং সঙ্গে সঙ্গে মুছে ফেলা যায়।")}</p><strong className="status-tag implemented">{s("Implemented", "বাস্তবায়িত")}</strong></article>
          <article><span>▶</span><h2>{s("YouTube stays off", "ইউটিউব বন্ধ থাকে")}</h2><p>{s("External video is click-to-load through YouTube’s privacy-enhanced domain. Direct links and playlists remain external and need adult supervision.", "বাইরের ভিডিও ইউটিউবের প্রাইভেসি-উন্নত ডোমেইন দিয়ে ক্লিক করে লোড হয়। সরাসরি লিংক ও প্লেলিস্ট বাইরের থাকে এবং বড়দের তত্ত্বাবধান দরকার।")}</p><strong className="status-tag implemented">{s("Implemented", "বাস্তবায়িত")}</strong></article>
          <article><span>AA</span><h2>{s("Accessibility target", "প্রবেশগম্যতার লক্ষ্য")}</h2><p>{s("The interface is designed toward WCAG 2.2 AA, with keyboard access, focus styles, reduced motion and alternatives to speech. It has not yet passed an independent audit.", "ইন্টারফেসটি WCAG 2.2 AA লক্ষ্য করে তৈরি — কীবোর্ড ব্যবহার, ফোকাস, কম নড়াচড়া ও কণ্ঠের বিকল্পসহ। তবে এটি এখনও স্বাধীন নিরীক্ষা পাস করেনি।")}</p><strong className="status-tag review">{s("Audit required", "নিরীক্ষা দরকার")}</strong></article>
        </section>

        <section className="safety-section data-map-section">
          <header><p className="adult-eyebrow">{s("Data map", "তথ্যের মানচিত্র")}</p><h2>{s("What moves where", "কী কোথায় যায়")}</h2><p>{s("No advertising profile, chat transcript, child email, exact birthday, school, photo, location or uploaded learner voice is part of the product model.", "কোনো বিজ্ঞাপন প্রোফাইল, চ্যাট, শিশুর ইমেইল, সঠিক জন্মতারিখ, স্কুল, ছবি, অবস্থান বা আপলোড করা শিক্ষার্থীর কণ্ঠ এই পণ্যের অংশ নয়।")}</p></header>
          <div className="data-map-table" role="table" aria-label="Data collection map">
            <div className="data-map-head" role="row"><span role="columnheader">{s("Data", "তথ্য")}</span><span role="columnheader">{s("Where it lives", "কোথায় থাকে")}</span><span role="columnheader">{s("Why", "কেন")}</span><span role="columnheader">{s("Control", "নিয়ন্ত্রণ")}</span></div>
            <div role="row"><strong role="cell">{s("Anonymous stars & session IDs", "নাম ছাড়া তারা ও সেশন আইডি")}</strong><span role="cell">{s("This browser", "এই ব্রাউজার")}</span><span role="cell">{s("Resume learning offline", "অফলাইনে শেখা চালিয়ে যাওয়া")}</span><span role="cell">{s("Reset from Grown-ups panel", "বড়দের প্যানেল থেকে রিসেট")}</span></div>
            <div role="row"><strong role="cell">{s("Adult-managed learner profile", "বড়দের পরিচালিত প্রোফাইল")}</strong><span role="cell">{s("Encrypted platform database", "এনক্রিপ্ট করা ডেটাবেস")}</span><span role="cell">{s("Assignments and cross-device progress", "কাজ ও একাধিক ডিভাইসে অগ্রগতি")}</span><span role="cell">{s("Authenticated grown-up only", "কেবল যাচাইকৃত অভিভাবক")}</span></div>
            <div role="row"><strong role="cell">{s("Optional speaking rehearsal", "ঐচ্ছিক বলার অনুশীলন")}</strong><span role="cell">{s("Memory in the open browser tab", "খোলা ট্যাবের মেমরিতে")}</span><span role="cell">{s("Hear and reflect on one’s own delivery", "নিজের বলা শুনে যাচাই")}</span><span role="cell">{s("Delete instantly; never uploaded", "সঙ্গে সঙ্গে মুছুন; আপলোড হয় না")}</span></div>
            <div role="row"><strong role="cell">{s("Approved human lesson audio", "অনুমোদিত মানব পাঠ-অডিও")}</strong><span role="cell">{s("Platform object storage", "প্ল্যাটফর্ম স্টোরেজ")}</span><span role="cell">{s("Serve reviewed pronunciation models", "পর্যালোচিত উচ্চারণ শোনানো")}</span><span role="cell">{s("Named speaker consent and editorial approval", "বক্তার সম্মতি ও সম্পাদকীয় অনুমোদন")}</span></div>
            <div role="row"><strong role="cell">{s("YouTube request", "ইউটিউব অনুরোধ")}</strong><span role="cell">{s("YouTube after explicit load", "স্পষ্ট লোডের পর ইউটিউব")}</span><span role="cell">{s("Play an external lesson resource", "বাইরের পাঠ-সম্পদ চালানো")}</span><span role="cell">{s("Do not load; use transcript/activity instead", "লোড না করে প্রতিলিপি/কার্যক্রম ব্যবহার")}</span></div>
          </div>
        </section>

        <section className="safety-section two-column-safety">
          <div>
            <p className="adult-eyebrow">{s("Children’s privacy", "শিশুর গোপনীয়তা")}</p>
            <h2>{s("Current Australian review point", "বর্তমান অস্ট্রেলীয় পর্যালোচনা")}</h2>
            <p>{s("As of August 2026, Australia’s privacy regulator says the final Children’s Online Privacy Code is due to be in place and registered by 10 December 2026. The platform therefore records legal/privacy review as a release gate; it does not claim future-code compliance before a qualified review against the final text.", "২০২৬ সালের আগস্ট অনুযায়ী, অস্ট্রেলিয়ার গোপনীয়তা নিয়ন্ত্রক জানিয়েছে চূড়ান্ত Children’s Online Privacy Code ১০ ডিসেম্বর ২০২৬-এর মধ্যে কার্যকর হবে। তাই প্ল্যাটফর্ম আইনি/গোপনীয়তা পর্যালোচনাকে প্রকাশের শর্ত হিসেবে রাখে; চূড়ান্ত পাঠের বিপরীতে যোগ্য পর্যালোচনার আগে ভবিষ্যৎ-কোড মেনে চলার দাবি করে না।")}</p>
            <a href="https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code" target="_blank" rel="noreferrer">OAIC Children’s Online Privacy Code ↗</a>
          </div>
          <div>
            <p className="adult-eyebrow">{s("External media", "বাইরের মিডিয়া")}</p>
            <h2>{s("Privacy-enhanced is not risk-free", "প্রাইভেসি-উন্নত মানেই ঝুঁকিহীন নয়")}</h2>
            <p>{s("Embeds use", "এমবেড ব্যবহার করে")} <code>youtube-nocookie.com</code> {s("and do not connect until a learner presses load. YouTube still controls its player, captions, recommendations and availability. Each lesson has before/during/after pedagogy plus an adult review record.", "এবং শিক্ষার্থী লোড না চাপা পর্যন্ত সংযোগ হয় না। ইউটিউব তার প্লেয়ার, ক্যাপশন, পরামর্শ ও প্রাপ্যতা নিয়ন্ত্রণ করে। প্রতিটি পাঠে আগে/চলাকালীন/পরে শিক্ষণ ও বড়দের পর্যালোচনার রেকর্ড থাকে।")}</p>
            <a href="https://support.google.com/youtube/answer/171780?hl=en" target="_blank" rel="noreferrer">YouTube embed and privacy-enhanced guidance ↗</a>
          </div>
        </section>

        <section className="safety-section accessibility-record">
          <header><div><p className="adult-eyebrow">{s("Accessibility record", "প্রবেশগম্যতার রেকর্ড")}</p><h2>{s("Designed toward WCAG 2.2 AA—not yet certified", "WCAG 2.2 AA লক্ষ্য করে তৈরি — এখনও প্রত্যয়িত নয়")}</h2></div><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">{s("Read WCAG 2.2 ↗", "WCAG 2.2 পড়ুন ↗")}</a></header>
          <div className="accessibility-checks">
            <article className="done"><span>✓</span><div><h3>{s("Keyboard and visible focus", "কীবোর্ড ও দৃশ্যমান ফোকাস")}</h3><p>{s("Buttons, tabs, checks and forms use native controls with strong focus indicators.", "বোতাম, ট্যাব, চেক ও ফর্ম শক্তিশালী ফোকাসসহ নেটিভ কন্ট্রোল ব্যবহার করে।")}</p></div></article>
            <article className="done"><span>✓</span><div><h3>{s("Sound alternatives", "শব্দের বিকল্প")}</h3><p>{s("Dialogues include Bangla script, transliteration and English scaffolds; audio is replayable and never the only route.", "সংলাপে বাংলা লিপি, প্রতিবর্ণীকরণ ও ইংরেজি সহায়তা থাকে; অডিও বারবার শোনা যায় এবং কখনো একমাত্র পথ নয়।")}</p></div></article>
            <article className="done"><span>✓</span><div><h3>{s("Motion and pressure controls", "নড়াচড়া ও চাপ নিয়ন্ত্রণ")}</h3><p>{s("Reduced-motion preferences are respected; there are no timers, streak loss or pronunciation scores.", "কম-নড়াচড়ার পছন্দ মানা হয়; কোনো টাইমার, ধারাবাহিকতা হারানো বা উচ্চারণ স্কোর নেই।")}</p></div></article>
            <article className="done"><span>✓</span><div><h3>{s("Responsive reading", "মানানসই পড়া")}</h3><p>{s("Layouts adapt to small screens, Bangla text has generous line spacing and learner writing can be resized.", "ছোট পর্দায় বিন্যাস মানিয়ে নেয়, বাংলা লেখায় যথেষ্ট ফাঁক থাকে এবং লেখার আকার বদলানো যায়।")}</p></div></article>
            <article className="review"><span>↺</span><div><h3>{s("Screen-reader and zoom audit", "স্ক্রিন-রিডার ও জুম নিরীক্ষা")}</h3><p>{s("Automated checks plus testing at 200–400% zoom and with current assistive technology remain required.", "স্বয়ংক্রিয় পরীক্ষা এবং ২০০–৪০০% জুমে ও সহায়ক প্রযুক্তিতে পরীক্ষা এখনও দরকার।")}</p></div></article>
            <article className="review"><span>↺</span><div><h3>{s("Caption audit", "ক্যাপশন নিরীক্ষা")}</h3><p>{s("Third-party caption quality and exact timestamp suitability must be checked and periodically rechecked by an adult.", "তৃতীয় পক্ষের ক্যাপশনের মান ও সঠিক সময়-উপযোগিতা বড় কেউ যাচাই ও নিয়মিত পুনঃযাচাই করবেন।")}</p></div></article>
          </div>
        </section>

        <section className="safety-section governance-record">
          <header><p className="adult-eyebrow">{s("Human governance", "মানুষের তত্ত্বাবধান")}</p><h2>{s("Six named gates per module", "প্রতি মডিউলে ছয়টি নির্দিষ্ট ধাপ")}</h2><p>{s("The Content Studio creates 108 review records across 18 modules. Approval is not pre-filled, and the software does not impersonate a cultural, educational, accessibility or legal reviewer.", "কনটেন্ট স্টুডিও ১৮টি মডিউল জুড়ে ১০৮টি পর্যালোচনা রেকর্ড তৈরি করে। অনুমোদন আগে থেকে দেওয়া থাকে না, এবং সফটওয়্যার সাংস্কৃতিক, শিক্ষাগত, প্রবেশগম্যতা বা আইনি পর্যালোচক সেজে ওঠে না।")}</p></header>
          <ol>
            <li><span>01</span><strong>{s("Bangla language", "বাংলা ভাষা")}</strong><p>{s("Grammar, register, transliteration and pronunciation.", "ব্যাকরণ, ভাষারীতি, প্রতিবর্ণীকরণ ও উচ্চারণ।")}</p></li>
            <li><span>02</span><strong>{s("Cultural representation", "সাংস্কৃতিক উপস্থাপন")}</strong><p>{s("Specificity, plurality, sourcing and community perspective.", "নির্দিষ্টতা, বৈচিত্র্য, উৎস ও সম্প্রদায়ের দৃষ্টিভঙ্গি।")}</p></li>
            <li><span>03</span><strong>{s("Child-development", "শিশু-বিকাশ")}</strong><p>{s("Age fit, cognitive load, learning design and safeguarding.", "বয়স-উপযোগিতা, মানসিক চাপ, শিখন-নকশা ও সুরক্ষা।")}</p></li>
            <li><span>04</span><strong>{s("Accessibility", "প্রবেশগম্যতা")}</strong><p>{s("Assistive technology, zoom, captions, alternatives and usability.", "সহায়ক প্রযুক্তি, জুম, ক্যাপশন, বিকল্প ও ব্যবহারযোগ্যতা।")}</p></li>
            <li><span>05</span><strong>{s("External media", "বাইরের মিডিয়া")}</strong><p>{s("Availability, suitability, captions and precise learning segment.", "প্রাপ্যতা, উপযোগিতা, ক্যাপশন ও সঠিক শিখন-অংশ।")}</p></li>
            <li><span>06</span><strong>{s("Legal & privacy", "আইন ও গোপনীয়তা")}</strong><p>{s("Current law, notices, consent, retention and contracts.", "বর্তমান আইন, বিজ্ঞপ্তি, সম্মতি, সংরক্ষণ ও চুক্তি।")}</p></li>
          </ol>
        </section>

        <footer className="safety-footer"><div><strong>{s("See something we should change?", "বদলানোর মতো কিছু দেখেছেন?")}</strong><p>{s("Record it in the Content Studio review notes and do not approve the affected gate until it is resolved.", "কনটেন্ট স্টুডিওর পর্যালোচনা নোটে লিখুন এবং সমাধান না হওয়া পর্যন্ত সংশ্লিষ্ট ধাপ অনুমোদন করবেন না।")}</p></div><a className="primary-button" href="/studio">{s("Open Content Studio →", "কনটেন্ট স্টুডিও খুলুন →")}</a></footer>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { externalResources, resourceCategories } from "../resources-content";
import type { Bilingual } from "../explore-content";

export default function ResourcesHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const say = (value: Bilingual) => value[language];

  return (
    <main className="adult-app resources-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>{s("More ways to learn", "শেখার আরও পথ")}</small></span></Link>
        <nav aria-label="Platform information">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/explore">{s("Explore", "ঘুরে দেখো")}</Link>
          <Link href="/worksheets">{s("Worksheets", "ওয়ার্কশিট")}</Link>
          <Link href="/books">{s("NCTB audit", "এনসিটিবি নিরীক্ষা")}</Link>
          <Link className="active" href="/resources">{s("Resources", "সম্পদ")}</Link>
          <Link href="/safety">{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>{s("বাংলায় দেখুন", "View in English")}</button>
        </div>
      </header>

      <div className="adult-content">
        <section className="adult-hero">
          <div>
            <p className="adult-eyebrow">{s("For grown-ups", "বড়দের জন্য")}</p>
            <h1>{s("Courses and collections beyond this platform.", "এই প্ল্যাটফর্মের বাইরের কোর্স ও সংগ্রহ।")}</h1>
            <p>
              {s(
                "When a family wants structured classes, live teachers or deeper study, these external providers offer Bangla courses and materials. They are independent organisations: listing here is not an endorsement, offerings and prices change, and a grown-up should review any provider before involving a child.",
                "কোনো পরিবার কাঠামোবদ্ধ ক্লাস, সরাসরি শিক্ষক বা গভীর পড়াশোনা চাইলে এই বাইরের প্রতিষ্ঠানগুলো বাংলা কোর্স ও উপকরণ দেয়। এগুলো স্বাধীন প্রতিষ্ঠান: এখানে তালিকাভুক্তি সুপারিশ নয়, কোর্স ও মূল্য বদলায়, এবং শিশুকে যুক্ত করার আগে একজন বড় ব্যক্তি প্রতিষ্ঠানটি যাচাই করবেন।",
              )}
            </p>
          </div>
        </section>

        {resourceCategories.map((category) => {
          const items = externalResources.filter((resource) => resource.category === category.id);
          if (items.length === 0) return null;
          return (
            <section className="resources-section" key={category.id} aria-label={say(category.title)}>
              <h2>{say(category.title)}</h2>
              <p className="resources-note">{say(category.note)}</p>
              <div className="resources-grid">
                {items.map((resource) => (
                  <a
                    className="resource-card"
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{resource.name}</strong>
                    <small>{say(resource.location)}</small>
                    <p>{say(resource.description)}</p>
                    <span className="resource-external">{s("External site ↗", "বাইরের সাইট ↗")}</span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        <section className="resources-disclaimer">
          <span aria-hidden="true">☂</span>
          <p>
            {s(
              "These links open external websites that set their own privacy rules and may show their own advertising. This page sends nothing to them until you click. Free learning on Bangla Adventures never requires any of these.",
              "এই লিংকগুলো বাইরের ওয়েবসাইট খোলে, যাদের নিজস্ব গোপনীয়তার নিয়ম আছে এবং নিজেদের বিজ্ঞাপন দেখাতে পারে। আপনি ক্লিক না করা পর্যন্ত এই পাতা তাদের কিছুই পাঠায় না। বাংলা অ্যাডভেঞ্চারসে বিনামূল্যে শেখার জন্য এগুলোর কোনোটিই লাগে না।",
            )}
          </p>
        </section>
      </div>
    </main>
  );
}

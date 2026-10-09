import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useEditor,
  EditableText,
  EditableImage,
  EditableVideo,
} from "./editorContext";

const SECTIONS = [
  {
    slug: "stories-of-impact",
    id: "stories-of-impact",
    label: "Stories of Impact",
    short: "Stories",
    desc: "Field notes, milestones and the everyday wins that keep children in school and families standing tall.",
    tag: "News",
    image: "/img4.jpg",
    accent: "#7FB069",
  },
  {
    slug: "media-center",
    id: "media-center",
    label: "Media Center",
    short: "Media",
    desc: "Photographs, videos and press assets — the visual record of MKCDP's work across Mt. Kilimanjaro.",
    tag: "Gallery",
    image: "/img5.jpg",
    accent: "#F2B33D",
  },
];

const STORIES = [
  {
    slug: "moilo-water-project",
    title: "MOILO WATER PROJECT",
    category: "Charity",
    tags: ["Help", "Safety"],
    excerpt:
      "The Moilo Water Project is a significant initiative aimed at improving the lives of over 1,000 people in the arid region of Kajiado South Sub-County.",
    image: "/240322_013-scaled.jpg",
    content: [
      "The Moilo Water Project is a significant initiative aimed at improving the lives of over 1,000 people in the arid region of Kajiado South Sub-County. By providing a reliable source of clean water, this project will address critical challenges such as water scarcity, poor sanitation, and waterborne diseases. The borehole will not only supply drinking water but also support irrigation for small-scale farming, livestock rearing, and domestic use. This increased access to water will enhance food security, improve hygiene practices, and reduce the time spent collecting water, particularly for women and children. Ultimately, this project will contribute to the overall well-being and economic development of the Moilo community.",
      "“We used to scramble for water in the streams, almost 5 kilometers away. During the dry season, we dug through the sand just to get a few drops,” — Ms. Katai, Moilo resident.",
      "In the heart of Moilo, where families once walked long distances in search of water, a new story is being written — one of hope, resilience, and community-led change.",
      "What began as a vision has now transformed into a lifeline: Moilo Water Project. Through this initiative, Mt. Kilimanjaro Child Development Programme (MKCDP) drilled and equipped one borehole, extended a 1.5 km pipeline from the school to the community centre, constructed a water kiosk, installed a solar-powered water ATM, and built an animal trough to support both people and livestock.",
      "But the true success of this project lies beyond the infrastructure — it lives in the spirit of ownership. Moilo Water User Committee, formed during project implementation, continues to manage and sustain the facility, ensuring that clean water remains accessible to all.",
      "Today, children attend school on time, families enjoy better hygiene, and the community thrives — a powerful reminder that when sustainability is built in, impact lasts long after the project ends.",
      "💧 At MKCDP, we believe every drop counts — for people, for progress, and for generations to come.",
    ],
    relatedCategories: ["Charity", "Treatment"],
  },
  {
    slug: "beekeeping-project",
    title: "BEEKEEPING PROJECT",
    category: "Education",
    tags: ["Learning", "Safety"],
    excerpt:
      "The beekeeping project in Samai and Nataana is a transformative initiative empowering 100 group members in two groups.",
    image: "/240321_094-scaled.jpg",
    content: [
      "The beekeeping project in Samai and Nataana is a transformative initiative empowering 100 group members (60 women and 40 youth) in two groups (Olee beekeeping group and Samai beekeeping group). The project aims at fostering economic growth, and promoting environmental sustainability.",
      "By providing beekeeping training and equipment, the project empowers participants to establish sustainable livelihoods.",
      "Beekeeping offers numerous benefits, including income generation from honey and beeswax, improved pollination for crops, and environmental conservation.",
      "The project not only empowers individuals but also strengthens communities through knowledge sharing, skill development, and collective action.",
    ],
    relatedCategories: ["Education", "Treatment"],
  },
  {
    slug: "sowing-seeds-of-hope",
    title: "Sowing Seeds of Hope",
    category: "Education",
    tags: ["Education", "Help"],
    excerpt:
      "In the dry plains of Kajiado South, many families still rise each morning with a quiet determination — tending to their herds and hoping the rains will come.",
    image: "/img1.jpg",
    content: [
      "In the dry plains of Kajiado South, many families still rise each morning with a quiet determination — tending to their herds, walking long distances for water, and hoping the rains will come. For generations, pastoralism has been the backbone of life here. Yet, with each passing year, prolonged droughts and shrinking grazing lands have made survival increasingly uncertain.",
      "To support families to diversify their livelihoods and strengthen food security, MKCDP on Friday distributed drought-tolerant maize and bean seeds to caregivers across eight zones; Namelok, Olchorro, Entonet, Rombo, Olkaria, Enkusero, and Shurie. This is ahead of the anticipated October–November–December (OND Season) rains.",
      "A total of 1,160 kilograms of seeds were distributed to 145 caregivers, directly benefiting their households and indirectly reaching 437 community members. Each caregiver received 4 kilograms of maize and 4 kilograms of beans, marking a small but significant step toward food stability and self-reliance.",
      "This effort is part of MKCDP's continued journey to build resilient communities where every family has the tools, knowledge, and hope to create a sustainable future for their children.",
    ],
    relatedCategories: ["Education", "Help"],
  },
  {
    slug: "a-journey-of-growth-and-firsts",
    title: "A Journey of Growth and Firsts",
    category: "Food",
    tags: ["Charity", "Learning"],
    excerpt:
      "From a single multi-storey garden, to our very first drip irrigation plot, to a vibrant poultry unit and now the arrival of our first egg.",
    image: "/kids-loghing-in-class.jpg",
    content: [
      "From a single multi-storey garden, to our very first drip irrigation plot, to a vibrant poultry unit and now the arrival of our first egg — what a journey it has been! 🥚✨",
      "Our Aflatoun project with Isinet 4K Club has grown far beyond what we imagined. 2024 became a defining year: crowned Kajiado County Champions 🏆 and placing 8th nationally in the Presidential Award Scheme. A true testament to what passion, learning and consistency can achieve. 🌟📈",
      "At Mt. Kilimanjaro Child Development Programme (MKCDP), we are proud to walk this journey with Aflatoun Clubs; nurturing skills, building confidence and proving that when young people are given the right support, they don't just participate… they excel. 🌍",
    ],
    relatedCategories: ["Food", "Help"],
  },
  {
    slug: "vsla-financial-literacy-training",
    title: "VSLA and Financial Literacy Training",
    category: "Uncategorized",
    tags: ["Help", "Learning"],
    excerpt:
      "This month, we successfully completed a three-day Village Savings and Loan Associations (VSLA) and Financial Literacy training.",
    image: "/img4.jpg",
    content: [
      "This month, we successfully completed a three-day Village Savings and Loan Associations (VSLA) and Financial Literacy training in Naretoi, Kuku Plains and Mbirikani. The training brought together six groups: Olee Beekeeping Group, Samai Beekeeping Group, Elatia Naiborr Ajijik CBO, Iretet Self Help Group, Nasaru Women Group and Enkorropil Women Group.",
      "The sessions were delivered by KCB Kenya Loitokitok Branch team, KCB Foundation and the Social Works Department in Kajiado South, with strong support from ChildFund Kenya. Their commitment made it possible for these groups to access practical knowledge that strengthens savings discipline, financial literacy and formal banking linkages.",
      "Participants explored VSLA operations, record keeping, budgeting, interest calculations, mobile banking and entrepreneurship. At the end of the training, each group demonstrated confidence in managing their savings structures and setting clear plans for financial growth.",
      "We sincerely appreciate ChildFund Kenya for supporting this initiative, and we thank KCB Kenya and the Social Works Department for the excellent collaboration. Most importantly, we celebrate all participants for their active engagement and dedication throughout the sessions.",
    ],
    relatedCategories: ["Uncategorized"],
  },
];

const MEDIA_ITEMS = [
  { id: "m1", src: "/img1.jpg" },
  { id: "m2", src: "/img2.jpg" },
  { id: "m3", src: "/img3.jpg" },
  { id: "m4", src: "/img4.jpg" },
  { id: "m5", src: "/img5.jpg" },
  { id: "m6", src: "/img6.jpg" },
  { id: "m7", src: "/img7.jpg" },
  { id: "m8", src: "/img8.png" },
  { id: "m9", src: "/img9.jpg" },
  { id: "m10", src: "/img10.jpg" },
  { id: "m11", src: "/img11.jpg" },
  { id: "m12", src: "/img12.jpg" },
  { id: "m13", src: "/img13.jpg" },
  { id: "m14", src: "/img14.jpg" },
  { id: "m15", src: "/img15.jpg" },
];

const MEDIA_FILTERS = ["All", "Education", "Water", "Livelihoods", "Community", "Field Work"];

const MEDIA_VIDEOS = [
  { id: "v1", youtubeId: "VjJ7bjdomkE" },
  { id: "v2", youtubeId: "f77UOkxgp6o" },
  { id: "v3", youtubeId: "14u-g-OtPIA" },
];

function shuffleArray(arr) {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function SectionHeading({ idPrefix, eyebrow, title, intro, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <span
        className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-green-700" />
        <EditableText id={`${idPrefix}.eyebrow`} defaultValue={eyebrow} />
      </span>
      <EditableText
        as="h2"
        id={`${idPrefix}.title`}
        defaultValue={title}
        multiline
        className="block hero-serif text-[clamp(1.7rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]"
      />
      {intro && (
        <EditableText
          as="p"
          id={`${idPrefix}.intro`}
          defaultValue={intro}
          multiline
          className="mt-5 block text-[1rem] leading-[1.85] text-[#4A4A42]"
        />
      )}
    </div>
  );
}

function MobileBreadcrumb({ crumbs }) {
  const { isEditing } = useEditor();
  return (
    <nav aria-label="Breadcrumb" className="border-b border-green-700/12 bg-[#FBF7F0] lg:hidden">
      <div className="mx-auto max-w-[1560px] px-5 py-3.5 sm:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wider">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-green-700/35">›</span>}
              {c.href ? (
                <Link
                  to={c.href}
                  className={`text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-[#4A4A42]" aria-current="page">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function DesktopBreadcrumb({ crumbs }) {
  const { isEditing } = useEditor();
  return (
    <nav
      aria-label="Breadcrumb"
      className="relative hidden border-b border-green-700/12 bg-[#FBF7F0] lg:block"
    >
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-green-700/35">/</span>}
              {c.href ? (
                <Link
                  to={c.href}
                  className={`text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-[#4A4A42]" aria-current="page">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function NewsHero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] pt-10 sm:pt-16 lg:pt-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              <EditableText id="news.hero.eyebrow" defaultValue="News & Stories" />
            </span>
            <EditableText
              as="h1"
              id="news.hero.heading"
              defaultValue={"The work,\ntold as it happens.\nIn words and pictures."}
              multiline
              className="hero-serif block whitespace-pre-line text-[clamp(2rem,8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]"
            />
          </div>
          <div className="lg:pb-3">
            <EditableText
              as="p"
              id="news.hero.intro"
              defaultValue="Field notes from our teams, milestones from the communities we serve, and a growing gallery of the faces and places behind every programme. This is where the work becomes a story."
              multiline
              className="block max-w-[520px] text-[0.98rem] leading-[1.85] text-[#3D3D37] sm:text-[1.0625rem]"
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-green-700/15 pt-6 sm:gap-x-10">
              {[
                { v: "5", l: "Recent stories", key: "stories" },
                { v: "9+", l: "Gallery photos", key: "photos" },
                { v: "3", l: "Videos", key: "videos" },
              ].map((item) => (
                <div key={item.key}>
                  <EditableText
                    as="p"
                    id={`news.hero.stat.${item.key}.v`}
                    defaultValue={item.v}
                    className="hero-serif block text-[1.15rem] font-bold leading-none text-green-700 sm:text-[1.25rem]"
                  />
                  <EditableText
                    as="p"
                    id={`news.hero.stat.${item.key}.l`}
                    defaultValue={item.l}
                    className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 sm:text-[0.68rem]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
        }}
      />
    </section>
  );
}

function StoryCard({ story, storyIndex }) {
  const { isEditing } = useEditor();
  const base = `news.stories.${story.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(20,83,45,0.55)]">
      <Link
        to={`/news-and-stories/stories-of-impact/${story.slug}`}
        className={`flex flex-1 flex-col ${isEditing ? "pointer-events-none" : ""}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <EditableImage
            id={`${base}.image`}
            defaultValue={story.image}
            alt={story.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            wrapperClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <EditableText
            as="span"
            id={`${base}.category`}
            defaultValue={story.category}
            className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <EditableText
            as="h3"
            id={`${base}.title`}
            defaultValue={story.title}
            multiline
            className="block hero-serif text-[1.25rem] font-bold leading-tight text-[#111111] sm:text-[1.4rem]"
          />
          <EditableText
            as="p"
            id={`${base}.excerpt`}
            defaultValue={story.excerpt}
            multiline
            className="mt-3 block flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]"
          />
          <div className="mt-5 inline-flex items-center gap-2 border-t border-green-700/15 pt-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A]">
            <EditableText id="news.card.readMore" defaultValue="Read more" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function StoriesOfImpact() {
  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-12 lg:space-y-16">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText id="news.stories.heading.eyebrow" defaultValue="Stories of Impact" />
              </span>
              <EditableText
                as="h1"
                id="news.stories.heading.title"
                defaultValue={"Our impact,\ntold through stories."}
                multiline
                className="hero-serif block whitespace-pre-line text-[clamp(2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]"
              />
            </div>
            <EditableText
              as="p"
              id="news.stories.heading.intro"
              defaultValue="Every project begins as a note in a field log and ends as a story worth telling. These are the latest dispatches from our teams — long-form, on-the-ground, and written as the work happens."
              multiline
              className="block max-w-[520px] text-[1rem] leading-[1.85] text-[#4A4A42]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((story, i) => (
              <StoryCard key={story.slug} story={story} storyIndex={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-10">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.stories.heading.eyebrow" defaultValue="Stories of Impact" />
            </span>
            <EditableText
              as="h1"
              id="news.stories.heading.titleMobile"
              defaultValue={"Our impact, told through stories."}
              multiline
              className="hero-serif block text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
            />
            <EditableText
              as="p"
              id="news.stories.heading.introMobile"
              defaultValue="Every project begins as a note in a field log and ends as a story worth telling. These are the latest dispatches from our teams."
              multiline
              className="mt-4 block text-[0.95rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="space-y-6">
            {STORIES.map((story, i) => (
              <StoryCard key={story.slug} story={story} storyIndex={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StoryDetail({ story }) {
  const { isEditing } = useEditor();
  const related = STORIES.filter((s) => s.slug !== story.slug).slice(0, 3);
  const base = `news.stories.${story.slug}`;

  return (
    <>
      <div className="hidden lg:block">
        <article className="mx-auto max-w-[860px]">
          <header className="mb-10 text-center">
            <EditableText
              as="p"
              id={`${base}.category`}
              defaultValue={story.category}
              className="block text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700"
            />
            <EditableText
              as="h1"
              id={`${base}.title`}
              defaultValue={story.title}
              multiline
              className="hero-serif mt-5 block text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.028em] text-[#111111]"
            />
            <div className="mt-6 flex items-center justify-center gap-3 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/70">
              <EditableText id={`${base}.date`} defaultValue={story.date || ""} />
              <span className="h-1 w-1 rounded-full bg-green-700/40" />
              <EditableText id={`${base}.author`} defaultValue={story.author || ""} />
            </div>
          </header>

          <figure className="overflow-hidden rounded-[20px] border border-green-700/12 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)]">
            <div className="relative aspect-[16/9] overflow-hidden">
              <EditableImage
                id={`${base}.image`}
                defaultValue={story.image}
                alt={story.title}
                className="h-full w-full object-cover"
                wrapperClassName="h-full w-full"
              />
            </div>
          </figure>

          <div className="mt-12 space-y-7">
            {story.content.map((para, i) => (
              <EditableText
                key={i}
                as="p"
                id={`${base}.content.${i}`}
                defaultValue={para}
                multiline
                className="block text-[1.05rem] leading-[1.95] text-[#2F2F2B] first:text-[1.12rem] first:leading-[1.9] first:text-[#111111]"
              />
            ))}
          </div>

          <div className="mt-12 border-t border-green-700/12 pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <EditableText
                as="p"
                id="news.detail.cta.title"
                defaultValue="Want to help write the next chapter?"
                className="block hero-serif text-[1.15rem] font-bold text-[#111111]"
              />
              <Link
                to="/take-action/donate"
                className={`inline-flex flex-shrink-0 items-center justify-center rounded-full bg-green-700 px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="news.detail.cta.button" defaultValue="Donate →" />
              </Link>
            </div>
          </div>

          <div className="mt-16 border-t border-green-700/12 pt-12">
            <span className="mb-6 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.detail.related.eyebrow" defaultValue="More stories" />
            </span>
            <div className="grid grid-cols-3 gap-6">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  to={`/news-and-stories/stories-of-impact/${s.slug}`}
                  className={`group overflow-hidden rounded-2xl border border-green-700/12 bg-white/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(20,83,45,0.5)] ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-green-700">
                      {s.date}
                    </p>
                    <p className="hero-serif mt-1.5 text-[0.98rem] font-bold leading-tight text-[#111111]">
                      {s.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="lg:hidden">
        <article className="space-y-7">
          <header className="text-center">
            <EditableText
              as="p"
              id={`${base}.category`}
              defaultValue={story.category}
              className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <EditableText
              as="h1"
              id={`${base}.title`}
              defaultValue={story.title}
              multiline
              className="hero-serif mt-4 block text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]"
            />
            <div className="mt-4 flex items-center justify-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/70">
              <EditableText id={`${base}.date`} defaultValue={story.date || ""} />
              <span className="h-1 w-1 rounded-full bg-green-700/40" />
              <EditableText id={`${base}.author`} defaultValue={story.author || ""} />
            </div>
          </header>

          <figure className="overflow-hidden rounded-[20px] border border-green-700/12">
            <div className="relative aspect-[16/10] overflow-hidden">
              <EditableImage
                id={`${base}.image`}
                defaultValue={story.image}
                alt={story.title}
                className="h-full w-full object-cover"
                wrapperClassName="h-full w-full"
              />
            </div>
          </figure>

          <div className="space-y-5">
            {story.content.map((para, i) => (
              <EditableText
                key={i}
                as="p"
                id={`${base}.content.${i}`}
                defaultValue={para}
                multiline
                className="block text-[1rem] leading-[1.9] text-[#2F2F2B] first:text-[1.05rem] first:leading-[1.85] first:text-[#111111]"
              />
            ))}
          </div>

          <div className="border-t border-green-700/12 pt-7">
            <EditableText
              as="p"
              id="news.detail.cta.titleMobile"
              defaultValue="Help write the next chapter."
              className="block hero-serif text-[1.05rem] font-bold text-[#111111]"
            />
            <EditableText
              as="p"
              id="news.detail.cta.subtitleMobile"
              defaultValue="Every gift keeps stories like this one coming."
              className="mt-2 block text-[0.88rem] text-[#4A4A42]"
            />
            <Link
              to="/take-action/donate"
              className={`mt-4 inline-flex w-full items-center justify-center rounded-full bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="news.detail.cta.button" defaultValue="Donate →" />
            </Link>
          </div>

          <div className="border-t border-green-700/12 pt-7">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.detail.related.eyebrow" defaultValue="More stories" />
            </span>
            <div className="space-y-4">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  to={`/news-and-stories/stories-of-impact/${s.slug}`}
                  className={`flex gap-3 rounded-2xl border border-green-700/12 bg-white/80 p-3 ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">
                      {s.date}
                    </p>
                    <p className="hero-serif mt-1 text-[1rem] font-bold leading-tight text-[#111111]">
                      {s.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

function VideoCard({ video }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-video overflow-hidden bg-black">
        <EditableVideo
          id={`news.videos.${video.id}.youtubeId`}
          defaultValue={video.youtubeId}
          title={`Video ${video.id}`}
        />
      </div>
    </article>
  );
}

function PhotoCollage({ items, onSelect }) {
  const { isEditing } = useEditor();
  const [order, setOrder] = useState(() => items.map((_, i) => i));

  useEffect(() => {
    setOrder(items.map((_, i) => i));
    if (isEditing) return undefined;
    const id = setInterval(() => {
      setOrder((prev) => shuffleArray(prev));
    }, 3200);
    return () => clearInterval(id);
  }, [items, isEditing]);

  const total = items.length;

  return (
    <div className="columns-2 gap-1.5 sm:columns-3 lg:columns-4">
      {order.map((idx, i) => {
        const item = items[idx % total];
        return (
          <div
            key={item.id}
            style={{ breakInside: "avoid" }}
            className="group relative mb-1.5 block w-full overflow-hidden rounded-[2px] bg-[#EFE9DF] align-top"
          >
            <EditableImage
              id={`news.media.${item.id}.src`}
              defaultValue={item.src}
              alt={item.title || ""}
              className="block h-auto w-full max-w-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              wrapperClassName="block w-full"
            />
            <button
              type="button"
              onClick={() => (isEditing ? null : onSelect(item))}
              aria-label={`Open ${item.title || "photo"}`}
              className="absolute inset-0 z-20 cursor-pointer"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-2 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <EditableText
                as="p"
                id={`news.media.${item.id}.category`}
                defaultValue={item.category || ""}
                className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/80"
              />
              <EditableText
                as="p"
                id={`news.media.${item.id}.title`}
                defaultValue={item.title || ""}
                className="hero-serif mt-1 block text-[0.95rem] font-bold leading-tight text-white"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MediaCenter() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = useMemo(
    () => (filter === "All" ? MEDIA_ITEMS : MEDIA_ITEMS.filter((m) => m.category === filter)),
    [filter]
  );

  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-12 lg:space-y-16">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
                  <span className="h-px w-8 bg-green-700" />
                  <EditableText id="news.media.photoGallery.eyebrow" defaultValue="Photo Gallery" />
                </span>
              </div>
            </div>

            <PhotoCollage items={filtered} onSelect={setLightbox} />
          </div>

          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
                  <span className="h-px w-8 bg-green-700" />
                  <EditableText id="news.media.featuredVideos.eyebrow" defaultValue="Featured Videos" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {MEDIA_VIDEOS.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-10">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.media.mobile.eyebrow" defaultValue="Media Center" />
            </span>
            <EditableText
              as="h1"
              id="news.media.mobile.title"
              defaultValue={"Strong & Inspirational. Raising Hope."}
              multiline
              className="hero-serif block text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
            />
            <EditableText
              as="p"
              id="news.media.mobile.intro"
              defaultValue="A visual record of MKCDP's work — classrooms, water points, farms, gatherings and the faces of the children at the heart of it all."
              multiline
              className="mt-4 block text-[0.95rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.media.featuredVideos.eyebrow" defaultValue="Featured Videos" />
            </span>
            <EditableText
              as="h2"
              id="news.media.mobile.videosTitle"
              defaultValue="Watch the work in motion."
              className="hero-serif block text-[1.6rem] font-bold leading-[1.15] text-[#111111]"
            />
            <div className="mt-6 space-y-5">
              {MEDIA_VIDEOS.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="news.media.photoGallery.eyebrow" defaultValue="Photo Gallery" />
            </span>
            <EditableText
              as="h2"
              id="news.media.mobile.galleryTitle"
              defaultValue="Moments from the field."
              className="hero-serif block text-[1.6rem] font-bold leading-[1.15] text-[#111111]"
            />
          </div>

          <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {MEDIA_FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 rounded-full border px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                    active
                      ? "border-green-700 bg-green-700 text-white"
                      : "border-green-700/20 bg-white text-[#4A4A42]"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <PhotoCollage items={filtered} onSelect={setLightbox} />
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-full w-full max-w-4xl">
            <img
              src={lightbox.src}
              alt={lightbox.title || ""}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/60">
                {lightbox.category || ""}
              </p>
              <p className="hero-serif mt-1 text-[1.1rem] font-bold text-white">
                {lightbox.title || ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FeaturedStories() {
  const { isEditing } = useEditor();
  return (
    <section className="relative border-t border-green-700/12 bg-[#FBF7F0] py-16 lg:py-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            idPrefix="news.featured"
            eyebrow="Latest dispatches"
            title="Five stories from the field."
          />
          <Link
            to="/news-and-stories/stories-of-impact"
            className={`inline-flex flex-shrink-0 items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors hover:text-[#15543A] ${
              isEditing ? "pointer-events-none" : ""
            }`}
          >
            <EditableText id="news.featured.seeAll" defaultValue="See all stories →" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.slice(0, 3).map((story, i) => (
            <StoryCard key={story.slug} story={story} storyIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsLanding() {
  const { isEditing } = useEditor();
  return (
    <>
      <div className="hidden lg:block">
        <NewsHero />

        <section className="relative py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading
              idPrefix="news.landing.explore"
              eyebrow="Explore"
              title="Two views into the work."
              intro="Start with the stories — long-form dispatches from the field, written as the work happens. Then step into the gallery for the photographs and video behind every programme."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-2">
              {SECTIONS.map((s, i) => (
                <Link
                  key={s.slug}
                  to={`/news-and-stories/${s.slug}`}
                  className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-green-700/12 bg-white/70 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-green-700/30 hover:bg-white/85 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)] active:scale-[0.99] ${
                    i === 1 ? "lg:mt-8" : ""
                  } ${isEditing ? "pointer-events-none" : ""}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <EditableImage
                      id={`news.sections.${s.slug}.image`}
                      defaultValue={s.image}
                      alt={s.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      wrapperClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <EditableText
                      as="span"
                      id={`news.sections.${s.slug}.tag`}
                      defaultValue={s.tag}
                      className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700 backdrop-blur"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <EditableText
                      as="h3"
                      id={`news.sections.${s.slug}.label`}
                      defaultValue={s.label}
                      className="hero-serif block text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight text-[#111111]"
                    />
                    <EditableText
                      as="p"
                      id={`news.sections.${s.slug}.desc`}
                      defaultValue={s.desc}
                      multiline
                      className="mt-4 block flex-1 text-[0.95rem] leading-[1.8] text-[#4A4A42]"
                    />
                    <div className="mt-6 inline-flex items-center justify-between gap-3 border-t border-green-700/15 pt-5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A]">
                      <EditableText
                        id={`news.sections.${s.slug}.cta`}
                        defaultValue={i === 0 ? "Read the stories" : "Browse the gallery"}
                      />
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FeaturedStories />

        <section className="relative py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading
              idPrefix="news.landing.why"
              eyebrow="Why stories matter"
              title="Numbers win grants. Stories win hearts."
              intro="Reach tells you how many. Projects tell you how. Stories tell you why it matters — and they are how a stranger in Nairobi or New York becomes a lifelong supporter."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-3">
              {[
                { key: "field", n: "01", title: "Written from the field", body: "Every story begins as a note from the team on the ground — the same people who run the programme." },
                { key: "dignity", n: "02", title: "Told with dignity", body: "Children are never shown in a way that reduces them to pity. Photos and words are chosen with consent." },
                { key: "realtime", n: "03", title: "Published as it happens", body: "Stories are shared as projects progress — not months later — so you see the work in real time." },
              ].map((card, i) => (
                <div
                  key={card.key}
                  className="rounded-[24px] border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] sm:p-8"
                >
                  <EditableText
                    as="span"
                    id={`news.landing.why.card.${card.key}.n`}
                    defaultValue={card.n}
                    className="hero-serif block text-[2rem] font-bold leading-none text-green-700/25 sm:text-[2.4rem]"
                  />
                  <EditableText
                    as="p"
                    id={`news.landing.why.card.${card.key}.title`}
                    defaultValue={card.title}
                    className="hero-serif mt-3 block text-[1.15rem] font-bold leading-tight text-[#111111]"
                  />
                  <EditableText
                    as="p"
                    id={`news.landing.why.card.${card.key}.body`}
                    defaultValue={card.body}
                    multiline
                    className="mt-3 block text-[0.9rem] leading-[1.75] text-[#4A4A42]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-green-700">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
              maskImage:
                "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
            }}
          />
          <div className="relative mx-auto max-w-[1360px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                  <span className="h-px w-8 bg-[#F2B33D]" />
                  <EditableText id="news.subscribe.eyebrow" defaultValue="Subscribe" />
                </span>
                <EditableText
                  as="h2"
                  id="news.subscribe.title"
                  defaultValue="Get the next story in your inbox."
                  multiline
                  className="hero-serif block text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]"
                />
                <EditableText
                  as="p"
                  id="news.subscribe.body"
                  defaultValue="One email a month. Field notes, project updates, and the occasional photo we can't stop looking at. No spam, ever."
                  multiline
                  className="mt-5 block max-w-[520px] text-[0.95rem] leading-[1.85] text-[#FBF7F0]/75 sm:text-[1rem]"
                />
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row lg:justify-end"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-[#FBF7F0]/25 bg-[#FBF7F0]/10 px-6 py-4 text-[0.95rem] text-[#FBF7F0] placeholder:text-[#FBF7F0]/50 focus:border-[#FBF7F0]/60 focus:outline-none focus:ring-2 focus:ring-[#FBF7F0]/20 sm:w-[320px]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#F2B33D] px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#1C6B4B] shadow-[0_18px_40px_-16px_rgba(242,179,61,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0a02e]"
                >
                  <EditableText id="news.subscribe.button" defaultValue="Subscribe" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:hidden">
        <section className="relative overflow-hidden px-5 pt-8">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText id="news.hero.eyebrow" defaultValue="News & Stories" />
          </span>
          <EditableText
            as="h1"
            id="news.landing.mobile.title"
            defaultValue="The work, told as it happens. In words and pictures."
            multiline
            className="hero-serif block text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
          />
          <EditableText
            as="p"
            id="news.landing.mobile.intro"
            defaultValue="Field notes from our teams, milestones from the communities we serve, and a growing gallery of the faces behind every programme."
            multiline
            className="mt-4 block text-[0.95rem] leading-[1.8] text-[#3D3D37]"
          />
          <div className="mt-7 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
            {[
              { v: "5", l: "Stories", key: "stories" },
              { v: "9+", l: "Photos", key: "photos" },
              { v: "3", l: "Videos", key: "videos" },
            ].map((item) => (
              <div key={item.key} className="px-3 py-4 text-center">
                <EditableText
                  as="p"
                  id={`news.hero.stat.${item.key}.v`}
                  defaultValue={item.v}
                  className="hero-serif block text-[1.1rem] font-bold leading-none text-green-700"
                />
                <EditableText
                  as="p"
                  id={`news.hero.stat.${item.key}.l`}
                  defaultValue={item.l}
                  className="mt-2 block text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/75"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-5 pt-8">
          {SECTIONS.map((s) => (
            <Link
              key={s.slug}
              to={`/news-and-stories/${s.slug}`}
              className={`block overflow-hidden rounded-2xl border border-green-700/12 bg-white/80 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.5)] transition-all duration-200 active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <EditableImage
                  id={`news.sections.${s.slug}.image`}
                  defaultValue={s.image}
                  alt={s.label}
                  className="h-full w-full object-cover"
                  wrapperClassName="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <EditableText
                  as="span"
                  id={`news.sections.${s.slug}.tag`}
                  defaultValue={s.tag}
                  className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-green-700 backdrop-blur"
                />
              </div>
              <div className="p-5">
                <EditableText
                  as="h3"
                  id={`news.sections.${s.slug}.label`}
                  defaultValue={s.label}
                  className="hero-serif block text-[1.45rem] font-bold leading-tight text-[#111111]"
                />
                <EditableText
                  as="p"
                  id={`news.sections.${s.slug}.desc`}
                  defaultValue={s.desc}
                  multiline
                  className="mt-3 block text-[0.88rem] leading-[1.75] text-[#4A4A42]"
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="px-5 pt-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText id="news.featured.eyebrow" defaultValue="Latest dispatches" />
          </span>
          <EditableText
            as="h2"
            id="news.featured.titleMobile"
            defaultValue="Three stories from the field."
            className="hero-serif block text-[1.7rem] font-bold leading-[1.1] text-[#111111]"
          />
          <div className="mt-6 space-y-5">
            {STORIES.slice(0, 3).map((story, i) => (
              <StoryCard key={story.slug} story={story} storyIndex={i} />
            ))}
          </div>
          <Link
            to="/news-and-stories/stories-of-impact"
            className={`mt-6 inline-flex w-full items-center justify-center rounded-full border border-green-700/25 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 ${
              isEditing ? "pointer-events-none" : ""
            }`}
          >
            <EditableText id="news.featured.seeAll" defaultValue="See all stories →" />
          </Link>
        </section>

        <section className="px-5 pt-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText id="news.landing.why.eyebrow" defaultValue="Why stories matter" />
          </span>
          <EditableText
            as="h2"
            id="news.landing.why.titleMobile"
            defaultValue="Numbers win grants. Stories win hearts."
            className="hero-serif block text-[1.7rem] font-bold leading-[1.1] text-[#111111]"
          />
          <div className="mt-6 space-y-3">
            {[
              { key: "field", n: "01", title: "Written from the field", body: "Every story begins as a note from the team on the ground." },
              { key: "dignity", n: "02", title: "Told with dignity", body: "Children are never shown in a way that reduces them to pity." },
              { key: "realtime", n: "03", title: "Published as it happens", body: "Stories are shared as projects progress — in real time." },
            ].map((card, i) => (
              <div
                key={card.key}
                className="rounded-2xl border border-green-700/12 bg-white/80 p-5"
              >
                <EditableText
                  as="span"
                  id={`news.landing.why.card.${card.key}.n`}
                  defaultValue={card.n}
                  className="hero-serif block text-[1.6rem] font-bold leading-none text-green-700/25"
                />
                <EditableText
                  as="p"
                  id={`news.landing.why.card.${card.key}.title`}
                  defaultValue={card.title}
                  className="hero-serif mt-3 block text-[1.05rem] font-bold leading-tight text-[#111111]"
                />
                <EditableText
                  as="p"
                  id={`news.landing.why.card.${card.key}.body`}
                  defaultValue={card.body}
                  multiline
                  className="mt-2 block text-[0.85rem] leading-[1.75] text-[#4A4A42]"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="-mx-5 bg-green-700 px-5 py-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
            <span className="h-px w-6 bg-[#F2B33D]" />
            <EditableText id="news.subscribe.eyebrow" defaultValue="Subscribe" />
          </span>
          <EditableText
            as="h2"
            id="news.subscribe.title"
            defaultValue="Get the next story in your inbox."
            multiline
            className="hero-serif block text-[1.8rem] font-bold leading-[1.1] text-[#FBF7F0]"
          />
          <EditableText
            as="p"
            id="news.subscribe.bodyMobile"
            defaultValue="One email a month. Field notes, project updates, and the occasional photo we can't stop looking at."
            multiline
            className="mt-4 block text-[0.9rem] leading-[1.8] text-[#FBF7F0]/75"
          />
          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-full border border-[#FBF7F0]/25 bg-[#FBF7F0]/10 px-6 py-4 text-[0.95rem] text-[#FBF7F0] placeholder:text-[#FBF7F0]/50 focus:border-[#FBF7F0]/60 focus:outline-none focus:ring-2 focus:ring-[#FBF7F0]/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#F2B33D] px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#1C6B4B] active:scale-[0.99]"
            >
              <EditableText id="news.subscribe.button" defaultValue="Subscribe" />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

function NotFound() {
  const { isEditing } = useEditor();
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-[600px] px-5 text-center sm:px-6">
        <EditableText
          as="p"
          id="news.notFound.kicker"
          defaultValue="Page not found"
          className="block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"
        />
        <EditableText
          as="h1"
          id="news.notFound.title"
          defaultValue="We couldn't find that page in the News & Stories section."
          multiline
          className="hero-serif mt-5 block text-[clamp(1.6rem,6vw,2.8rem)] font-bold leading-tight text-[#111111]"
        />
        <Link
          to="/news-and-stories"
          className={`mt-10 inline-flex items-center rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950 ${
            isEditing ? "pointer-events-none" : ""
          }`}
        >
          <EditableText id="news.notFound.cta" defaultValue="Back to News & Stories" />
        </Link>
      </div>
    </section>
  );
}

export default function NewsAndStories() {
  const { section, slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section, slug]);

  const active = section ? SECTIONS.find((s) => s.slug === section) : null;
  const story = slug ? STORIES.find((s) => s.slug === slug) : null;

  const crumbs = useMemo(() => {
    const base = [{ label: "News & Stories", href: "/news-and-stories" }];
    if (active) base.push({ label: active.label, href: slug ? `/news-and-stories/${active.slug}` : null });
    if (story) base.push({ label: story.title, href: null });
    return base;
  }, [active, story]);

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600;1,700&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: #14532D; color: #FBF7F0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 640px) {
          input, select, textarea { font-size: 16px !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        }}
      />

      {!section && <NewsLanding />}

      {section && !active && <NotFound />}

      {section && active && (
        <>
          <MobileBreadcrumb crumbs={crumbs} />
          <DesktopBreadcrumb crumbs={crumbs} />
          <main className="relative py-10 pb-16 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
              {active.id === "stories-of-impact" && !story && <StoriesOfImpact />}
              {active.id === "stories-of-impact" && story && <StoryDetail story={story} />}
              {active.id === "media-center" && <MediaCenter />}
              {active.id === "stories-of-impact" && slug && !story && <NotFound />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
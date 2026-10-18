import { IndustryTools } from "../components/storefront/IndustryTools";
import yazdRegionMap from "../assets/images/yazd-region-osm.png";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpLeft,
  ArrowLeft,
  Search,
  ScanLine,
  MessageSquare,
  MapPin,
  Phone,
  Layers,
  BookOpen,
  Check,
  Factory,
  Clock,
  Compass,
} from "lucide-react";
import { INDUSTRIES, ARTICLES } from "../data/siteContent";
import { BRANDS } from "../data/brands";
import { STORE_ASSETS as A } from "../assets/images";
import { getAllProducts, subscribeCatalogChanges } from "../data/mockGenerator";
import { ProductCard } from "../components/product/ProductCard";
import { MemberAccess } from "../components/storefront/MemberAccess";
const title = (text: string) => {
  document.title = `${text} | صنعت پیش`;
};
export function SectionHeading({
  eyebrow,
  title: heading,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="editorial-heading">
      <span className="store-eyebrow">{eyebrow}</span>
      <h2>{heading}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function MapCard({ compact = false }: { compact?: boolean }) {
  const [interactive, setInteractive] = useState(false);
  return (
    <div className={`location-card ${compact ? "location-card-compact" : ""}`}>
      <div className="location-map">
        {interactive ? (
          <iframe
            title="نقشه محدوده یزد و میبد"
            src="https://www.openstreetmap.org/export/embed.html?bbox=53.95%2C31.78%2C54.60%2C32.35&layer=mapnik"
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            <img
              src={yazdRegionMap}
              alt="نقشه منطقه‌ای یزد از OpenStreetMap"
              className="location-map-preview"
            />
            <button
              type="button"
              onClick={() => setInteractive(true)}
              className="location-map-activate"
            >
              فعال کردن نقشه تعاملی <Compass size={14} />
            </button>
          </>
        )}
        <a
          className="map-attribution"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          © OpenStreetMap
        </a>
      </div>
      <div>
        <span className="store-eyebrow">ارتباط مستقیم</span>
        <h3>از مشاوره تا هماهنگی مراجعه</h3>
        <p>
          دفتر فروش یزد و مجموعه میبد؛ پیش از مراجعه، نشانی و ساعت حضور را با ما
          هماهنگ کنید.
        </p>
        <div className="editorial-actions">
          <Link to="/contact">
            <MapPin size={16} />
            آدرس و راه‌های تماس
          </Link>
          <a
            href="https://www.openstreetmap.org/search?query=Yazd%20Iran"
            target="_blank"
            rel="noreferrer"
          >
            باز کردن نقشه <ArrowUpLeft size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
export function IndustryPage() {
  const { slug = "ceramic" } = useParams();
  const industry = INDUSTRIES.find((i) => i.slug === slug) || INDUSTRIES[0];
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeCatalogChanges(() => setTick((t) => t + 1)), []);
  useEffect(() => title(`قطعات صنعت ${industry.title}`), [industry]);
  const products = useMemo(
    () =>
      getAllProducts()
        .filter((p) => industry.terms.some((t) => p.name.includes(t)))
        .slice(0, 4),
    [industry, tick],
  );
  return (
    <div className={`editorial industry-page industry-${industry.slug}`}>
      <section className="industry-hero">
        <img
          src={industry.image}
          alt={`خط تولید ${industry.title}`}
          fetchPriority="high"
        />
        <div className="industry-hero-shade" />
        <div className="editorial-wrap">
          <nav className="editorial-crumb">
            <Link to="/">صنعت پیش</Link>
            <span>/</span>
            <Link to="/industries">صنایع</Link>
          </nav>
          <span className="industry-kicker">{industry.eyebrow}</span>
          <h1>
            همراه خط تولید
            <br />
            <em>{industry.title}</em>
          </h1>
          <p>{industry.description}</p>
          <div className="editorial-actions">
            <a className="store-btn-primary" href="#industry-parts">
              کاوش قطعات این صنعت <ArrowLeft size={17} />
            </a>
            <Link
              className="industry-secondary"
              to={`/ai-consult?industry=${industry.slug}`}
            >
              مشاوره با FORZA <MessageSquare size={17} />
            </Link>
          </div>
        </div>
      </section>
      <IndustryTools key={industry.slug} industry={industry} />
      <div className="industry-process editorial-wrap">
        <strong>در امتداد خط تولید</strong>
        {industry.steps.map((s, i) => (
          <span key={s}>
            <b>۰{i + 1}</b>
            {s}
          </span>
        ))}
      </div>
      <section className="editorial-wrap editorial-split" id="industry-parts">
        <SectionHeading
          eyebrow="از کاربرد شروع کنید"
          title="قطعه مناسب برای کدام بخش خط؟"
          text="این گروه‌ها نقطه شروع بررسی هستند. سازگاری هر کد با دستگاه و شرایط کار شما باید جداگانه تأیید شود."
        />
        <div className="industry-part-links">
          {industry.parts.map((p, i) => (
            <Link
              key={p}
              to={`/products?q=${encodeURIComponent(industry.terms[i])}`}
            >
              <Layers size={22} />
              <span>
                {p}
                <small>مشاهده خانواده‌ها و مشخصات</small>
              </span>
              <ArrowUpLeft size={19} />
            </Link>
          ))}
        </div>
      </section>
      <section className="industry-check-band" id="industry-checks">
        <div className="editorial-wrap editorial-split">
          <div>
            <SectionHeading
              eyebrow="انتخاب دقیق‌تر"
              title="قبل از استعلام، این اطلاعات را آماده کنید"
            />
            <p className="technical-note">{industry.note}</p>
          </div>
          <div className="industry-check-list">
            {industry.checks.map((c) => (
              <div key={c}>
                <Check size={18} />
                {c}
              </div>
            ))}
            <Link
              to={`/ai-consult?industry=${industry.slug}`}
              className="store-btn-secondary"
            >
              <ScanLine size={18} />
              ارسال تصویر و بررسی مشخصات
            </Link>
          </div>
        </div>
      </section>
      <section className="editorial-wrap" id="industry-catalog">
        <SectionHeading
          eyebrow="از کاتالوگ واقعی سایت"
          title="خانواده‌های مرتبط برای بررسی اولیه"
        />
        <div className="editorial-products">
          {products.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
        <MemberAccess />
      </section>
      <section className="editorial-wrap">
        <SectionHeading
          eyebrow="صنعت پیش، برای صنعت شما"
          title="صنایع دیگر را هم بررسی کنید"
        />
        <div className="industry-related">
          {INDUSTRIES.filter((i) => i.slug !== industry.slug).map((i) => (
            <Link to={`/industries/${i.slug}`} key={i.slug}>
              <img src={i.image} alt="" loading="lazy" />
              <span>
                {i.title}
                <ArrowUpLeft size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
export function IndustriesPage() {
  useEffect(() => title("صنایع تحت پوشش"), []);
  return (
    <div className="editorial editorial-wrap">
      <section className="directory-intro">
        <span className="store-eyebrow">از صنعت شما شروع کنیم</span>
        <h1>
          هر خط تولید،
          <br />
          مسیر انتخاب خودش را دارد.
        </h1>
        <p>
          کاربردها، گروه قطعات و اطلاعات لازم برای بررسی فنی هر صنعت را ببینید.
        </p>
      </section>
      <div className="industry-directory">
        {INDUSTRIES.map((i) => (
          <Link to={`/industries/${i.slug}`} key={i.slug}>
            <img src={i.image} alt={`صنعت ${i.title}`} loading="lazy" />
            <div>
              <span>{i.eyebrow}</span>
              <h2>{i.title}</h2>
              <ArrowUpLeft size={22} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function BrandsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  useEffect(() => title("برندهای همکار"), []);
  const brands = BRANDS.filter(
    (b) =>
      b.active !== false &&
      `${b.name} ${b.nameEn} ${b.specialties?.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!specialty || b.specialties?.some((s) => s.includes(specialty))),
  );
  return (
    <div className="editorial">
      <section className="brand-intro">
        <div className="editorial-wrap editorial-split">
          <div>
            <span className="store-eyebrow">شناخت برند، انتخاب آگاهانه</span>
            <h1>
              برندها؛
              <br />
              <em>در کنار مشخصات فنی.</em>
            </h1>
            <p>
              با حوزه محصولات برندهای درج‌شده در کاتالوگ آشنا شوید. کد، سازگاری
              و مدارک هر کالا را پیش از سفارش بررسی کنید.
            </p>
            <a href="#brand-directory" className="store-btn-primary">
              کاوش برندها <ArrowLeft size={17} />
            </a>
          </div>
          <div className="brand-engineering-wall">
            <img
              className="brand-engineering-photo"
              src={A.heroPulley}
              alt="قطعات انتقال قدرت"
            />
            <div className="brand-logo-wall">
              <img src={A.logoForza} alt="FORZA" />
              <img src={A.swrLogo} alt="SWR" />
              <span>کد دقیق · مشخصات روشن · انتخاب آگاهانه</span>
            </div>
            <span className="brand-wall-caption">در امتداد حرکت صنعت</span>
          </div>
        </div>
      </section>
      <section className="editorial-wrap" id="brand-directory">
        <div className="editorial-section-bar">
          <SectionHeading
            eyebrow="شناخت حوزه محصولات"
            title="برندهای کاتالوگ"
          />
          <label className="editorial-search">
            <Search size={18} />
            <input
              aria-label="جستجوی برند"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام فارسی یا انگلیسی برند"
            />
          </label>
        </div>
        <div
          className="brand-filters"
          role="group"
          aria-label="حوزه محصولات برند"
        >
          {["", "تسمه", "پلی", "انتقال", "لاستیک"].map((t) => (
            <button
              key={t}
              aria-pressed={specialty === t}
              onClick={() => setSpecialty(t)}
            >
              {t || "همه حوزه‌ها"}
            </button>
          ))}
          <span>{brands.length.toLocaleString("fa-IR")} برند</span>
        </div>
        <div className="brand-directory">
          {brands.map((b) => (
            <article id={b.id} key={b.id}>
              <span className="brand-card-index">{b.nameEn}</span>
              <div className="brand-card-logo">
                <img
                  src={
                    b.id === "forza"
                      ? A.logoForza
                      : b.id === "swr"
                        ? A.swrLogo
                        : b.logo
                  }
                  alt={b.nameEn}
                  loading="lazy"
                />
              </div>
              <h2>{b.name}</h2>
              <p>{b.description}</p>
              <div className="editorial-tags">
                {b.specialties?.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <Link
                to={`/products?brand=${encodeURIComponent(b.nameEn)}`}
                className="editorial-text-link"
              >
                بررسی محصولات این برند <ArrowUpLeft size={17} />
              </Link>
            </article>
          ))}
        </div>
        {!brands.length && (
          <p role="status">برندی با این نام پیدا نشد. نام دیگری جستجو کنید.</p>
        )}
        <div className="editorial-note">
          نمایش نام برند به معنی موجودی همه محصولات یا تأیید نمایندگی آن نیست.
          موجودی و شرایط تأمین هر کد را در پنل خود بررسی کنید.
        </div>
      </section>
    </div>
  );
}
export function KnowledgePage() {
  const { slug } = useParams();
  const [query, setQuery] = useState("");
  const article = ARTICLES.find((a) => a.slug === slug);
  useEffect(() => title(article?.title || "دانشنامه صنعت پیش"), [article]);
  if (slug && !article)
    return (
      <div className="editorial editorial-wrap">
        <h1>این راهنما پیدا نشد</h1>
        <Link to="/knowledge">بازگشت به دانشنامه</Link>
      </div>
    );
  if (article)
    return (
      <article className="editorial knowledge-article">
        <header className="editorial-wrap">
          <Link to="/knowledge" className="editorial-text-link">
            دانشنامه صنعت پیش <ArrowLeft size={17} />
          </Link>
          <span className="store-eyebrow">
            {article.category} · {article.minutes} دقیقه مطالعه
          </span>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
        </header>
        <img
          className="knowledge-cover"
          src={article.image}
          alt={article.title}
        />
        <div className="knowledge-reading">
          <aside>
            <strong>در این راهنما</strong>
            {article.sections.map(([h], i) => (
              <a href={`#part-${i}`} key={h}>
                {h}
              </a>
            ))}
          </aside>
          <div>
            {article.sections.map(([h, p], i) => (
              <section id={`part-${i}`} key={h}>
                <h2>{h}</h2>
                <p>{p}</p>
              </section>
            ))}
            <div className="editorial-note">
              این مطلب راهنمای عمومی انتخاب و آماده‌سازی اطلاعات است؛ مشخصات
              کاتالوگ سازنده و دستورالعمل دستگاه ملاک تأیید نهایی هستند.
            </div>
            <div className="editorial-actions">
              <Link to="/ai-consult" className="store-btn-primary">
                پرسش از FORZA <MessageSquare size={17} />
              </Link>
              <Link
                to={`/products?q=${encodeURIComponent(article.query)}`}
                className="store-btn-secondary"
              >
                بررسی محصولات مرتبط
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  const list = ARTICLES.filter((a) =>
    `${a.title} ${a.category}`.includes(query),
  );
  return (
    <div className="editorial editorial-wrap">
      <section className="knowledge-intro">
        <div>
          <span className="store-eyebrow">دانشنامه صنعت پیش</span>
          <h1>
            شناخت بهتر قطعه،
            <br />
            <em>انتخاب مطمئن‌تر.</em>
          </h1>
          <p>
            راهنماهای کوتاه و کاربردی برای شناسایی، انتخاب و درخواست ساخت قطعات
            صنعتی.
          </p>
          <label className="editorial-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="جستجوی دانشنامه"
              placeholder="دنبال چه راهنمایی هستید؟"
            />
          </label>
        </div>
        <BookOpen size={120} strokeWidth={1} />
      </section>
      <div className="knowledge-grid">
        {list.map((a) => (
          <KnowledgeCard key={a.slug} article={a} />
        ))}
      </div>
      {!list.length && <p role="status">راهنمایی با این عبارت پیدا نشد.</p>}
    </div>
  );
}
export function KnowledgeCard({
  article: a,
}: {
  article: (typeof ARTICLES)[number];
}) {
  return (
    <Link to={`/knowledge/${a.slug}`} className="knowledge-card">
      <img src={a.image} alt="" loading="lazy" />
      <div>
        <span>
          {a.category} · {a.minutes} دقیقه مطالعه
        </span>
        <h3>{a.title}</h3>
        <p>{a.summary}</p>
        <b>
          مطالعه راهنما <ArrowUpLeft size={17} />
        </b>
      </div>
    </Link>
  );
}
export function HomeKnowledge() {
  return (
    <section className="home-knowledge editorial-wrap">
      <div className="editorial-section-bar">
        <SectionHeading
          eyebrow="دانش، پیش از خرید"
          title="چند دقیقه برای انتخاب بهتر"
        />
        <Link to="/knowledge" className="editorial-text-link">
          همه راهنماها <ArrowUpLeft size={17} />
        </Link>
      </div>
      <div className="knowledge-grid">
        {ARTICLES.slice(0, 3).map((a) => (
          <KnowledgeCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
export function AboutNavigation({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="about-navigation">
      <div>
        <span className="store-eyebrow">با صنعت پیش، هوشمندانه پیش بروید</span>
        <h3>تجربه صنعتی، مسیر خرید هوشمند</h3>
        <p>از تأمین و ساخت قطعه تا انتخاب آگاهانه و پیگیری سفارش.</p>
        <div className="about-navigation-links">
          {[
            ["/about", "آشنایی با صنعت پیش"],
            ["/about#capabilities", "توانمندی‌ها و خدمات"],
            ["/industries", "صنایع تحت پوشش"],
            ["/brands", "برندها و محصولات"],
            ["/knowledge", "دانشنامه کاربردی"],
            ["/contact", "تماس و هماهنگی مراجعه"],
          ].map(([to, text]) => (
            <Link key={to} to={to} onClick={onNavigate}>
              {text}
              <ArrowUpLeft size={15} />
            </Link>
          ))}
        </div>
      </div>
      <MapCard compact />
    </div>
  );
}
export function AboutPage() {
  useEffect(() => title("درباره صنعت پیش"), []);
  return (
    <div className="editorial">
      <section className="about-hero editorial-wrap editorial-split">
        <div>
          <span className="store-eyebrow">صنعت پیش · بازرگانی تسمه اطلس</span>
          <h1>
            با صنعت پیش،
            <br />
            <em>هوشمندانه پیش بروید.</em>
          </h1>
          <p>
            همراه شما در انتخاب، تأمین و بررسی ساخت قطعات صنعتی؛ با ترکیب تجربه
            فنی، کاتالوگ قابل جستجو و ابزارهای هوشمند.
          </p>
          <div className="editorial-actions">
            <Link to="/products" className="store-btn-primary">
              کاوش محصولات <ArrowLeft size={17} />
            </Link>
            <Link to="/contact" className="store-btn-secondary">
              ارتباط با ما <Phone size={17} />
            </Link>
          </div>
        </div>
        <img src={A.whySanatDirectFactory} alt="تجهیزات و فضای صنعتی" />
      </section>
      <section className="industry-check-band" id="capabilities">
        <div className="editorial-wrap">
          <SectionHeading
            eyebrow="چه کاری برای شما انجام می‌دهیم؟"
            title="یک مسیر پیوسته؛ از نیاز تا پیگیری"
          />
          <div className="about-capabilities">
            {[
              [
                "تأمین قطعات",
                "خانواده‌ها، سایزها و کدهای کالا را در کاتالوگ بررسی کنید.",
                "/products",
              ],
              [
                "بررسی ساخت",
                "نمونه، نقشه و شرایط کار را برای بررسی امکان ساخت ارائه کنید.",
                "/contact",
              ],
              [
                "راهنمایی هوشمند",
                "پرسش فنی و شناسایی اولیه با تصویر را در میزکار FORZA تجربه کنید.",
                "/ai-consult",
              ],
              [
                "خرید و پیگیری",
                "قیمت، موجودی و استعلام را پس از ورود در پنل خود دنبال کنید.",
                "/register",
              ],
            ].map(([h, p, to], i) => (
              <Link to={to} key={h}>
                <span>۰{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
                <ArrowUpLeft size={19} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial-wrap editorial-split">
        <SectionHeading
          eyebrow="انتخاب بدون ابهام"
          title="مشخصات روشن، تصمیم آگاهانه"
          text="تصویر و کد هر قطعه را کنار هم بررسی کنید. مشخصات نامشخص، قیمت اعلام‌نشده یا موجودی تأییدنشده را با اطلاعات واقعی تکمیل می‌کنیم؛ تأیید نهایی با بررسی کد و شرایط کار انجام می‌شود."
        />
        <div className="about-principles">
          <p>
            <Check size={19} />
            کد، تصویر و مشخصات هر کالا در کنار هم
          </p>
          <p>
            <Check size={19} />
            نمایش قیمت و موجودی در حساب کاربری
          </p>
          <p>
            <Check size={19} />
            استعلام برای اطلاعات نیازمند بررسی
          </p>
          <p>
            <Check size={19} />
            همراهی ابزار هوشمند و ارتباط مستقیم
          </p>
        </div>
      </section>
      <section className="editorial-wrap">
        <MapCard />
      </section>
    </div>
  );
}

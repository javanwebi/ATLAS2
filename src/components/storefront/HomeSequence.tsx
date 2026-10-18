import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpLeft,
  Layers,
  ShieldCheck,
  Factory,
  ClipboardList,
  ScanLine,
  MessageSquare,
} from "lucide-react";
import { CATEGORIES } from "../../data/categories";
import { ProductImage } from "../product/ProductImage";
import { STORE_ASSETS as A } from "../../assets/images";
const categoryArtwork: Record<string,string> = {"تسمه و انتقال نیرو": A.categories.belts, "پولی و انتقال نیرو": A.categories.pulleys, "بلبرینگ و یاتاقان": A.categories.bearings};
const groups = [
  "تسمه و انتقال نیرو",
  "پولی و انتقال نیرو",
  "چرخ و رولر",
  "ریل و تجهیزات هدایت",
  "آب‌بندی و قطعات لاستیکی",
  "بلبرینگ و یاتاقان",
];
export function HomeCategoryStrip() {
  const categories = groups
    .map((name) => CATEGORIES.find((c) => c.name === name))
    .filter((c) => !!c);
  return (
    <section className="home-category-strip" aria-label="دسته‌بندی محصولات">
      <div className="home-category-track">
        <Link className="home-category-all" to="/categories">
          <Layers size={24} />
          <strong>
            دسته‌بندی
            <br />
            محصولات
          </strong>
          <span>
            مشاهده همه گروه‌ها <ArrowLeft size={15} />
          </span>
        </Link>
        {categories.map((c) => (
          <Link
            className="home-category-item"
            key={c.slug}
            to={`/category/${c.slug}`}
          >
            <ProductImage src={categoryArtwork[c.name] || c.image} alt={c.name} loading="lazy" />
            <strong>{c.name}</strong>
            <small>
              مشاهده قطعات <ArrowUpLeft size={12} />
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function HomeTrustStrip() {
  return (
    <section
      className="home-trust-strip"
      aria-label="پیش از خرید با ما آشنا شوید"
    >
      {[
        {
          Icon: Factory,
          title: "تجربه در کنار تولید",
          text: "آشنایی با مجموعه و توانمندی‌ها",
          to: "/about",
        },
        {
          Icon: ShieldCheck,
          title: "مشخصات، پیش از انتخاب",
          text: "کد، تصویر و اطلاعات فنی کالا",
          to: "/products",
        },
        {
          Icon: ClipboardList,
          title: "درخواست قابل پیگیری",
          text: "ثبت استعلام و پیگیری در پنل",
          to: "/login",
        },
        {
          Icon: MessageSquare,
          title: "راه ارتباطی روشن",
          text: "مشاوره و تماس مستقیم با مجموعه",
          to: "/contact",
        },
      ].map(({ Icon, title, text, to }) => (
        <Link key={title} to={to}>
          <Icon size={25} />
          <span>
            <strong>{title}</strong>
            <small>{text}</small>
          </span>
          <ArrowUpLeft size={15} />
        </Link>
      ))}
    </section>
  );
}
export function HomeForzaBanner() {
  return (
    <section className="home-forza-banner">
      <div className="home-forza-copy">
        <span className="store-eyebrow">دستیار انتخاب قطعه صنعت پیش</span>
        <strong className="home-forza-wordmark">FORZA</strong>
        <h2>
          از سؤال فنی تا شناخت قطعه،
          <br />
          یک مسیر هوشمند.
        </h2>
        <p>
          کد را جستجو کنید، پرسش فنی بپرسید یا تصویر قطعه را برای بررسی اولیه
          بفرستید. نتیجه را کنار مشخصات واقعی کاتالوگ بررسی کنید.
        </p>
        <div>
          <Link to="/ai-consult" className="store-btn-primary">
            ورود به میزکار FORZA <ArrowLeft size={17} />
          </Link>
          <Link to="/ai-consult?view=visual" className="store-btn-secondary">
            <ScanLine size={17} /> شناسایی با تصویر
          </Link>
        </div>
      </div>
      <div className="home-forza-art">
        <img
          src={A.aiConsultRobot}
          alt="معرفی دستیار هوشمند FORZA"
          loading="lazy"
        />
        <span>مشاوره فنی · جستجوی کاتالوگ · بررسی تصویر</span>
      </div>
    </section>
  );
}

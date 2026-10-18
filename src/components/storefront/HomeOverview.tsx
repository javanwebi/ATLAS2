import React from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  MessageCircle,
  ArrowUpLeft,
  ShieldCheck,
  Factory,
  Truck,
  Layers,
} from "lucide-react";
import { STORE_ASSETS } from "../../assets/images";
export function HomeAssist({
  onVisual,
  onConsult,
}: {
  onVisual: () => void;
  onConsult: () => void;
}) {
  return (
    <section className="home-assist" aria-label="راهنمای پیدا کردن قطعه">
      <div className="home-assist-intro">
        <span className="store-eyebrow">از نیاز شما تا قطعه مناسب</span>
        <h2>پیدا کردن قطعه، ساده‌تر از همیشه</h2>
        <p>
          کد یا نام قطعه را جستجو کنید؛ برای انتخاب دقیق‌تر، تصویر بفرستید یا
          مشاوره بگیرید.
        </p>
      </div>
      <div className="home-assist-visual" aria-hidden="true">
        <img src={STORE_ASSETS.aiSearchMobile} alt="" loading="lazy" />
        <span><ScanLineGraphic /> از تصویر تا مشخصات قطعه</span>
      </div>
      <div className="home-assist-actions">
        <button onClick={onVisual} type="button">
          <Camera size={22} />
          <span>
            <strong>شناسایی با تصویر</strong>
            <small>عکس قطعه را دارید؟</small>
          </span>
          <ArrowUpLeft size={17} />
        </button>
        <button onClick={onConsult} type="button">
          <MessageCircle size={22} />
          <span>
            <strong>مشاوره انتخاب قطعه</strong>
            <small>مشخصات را با هم بررسی کنیم</small>
          </span>
          <ArrowUpLeft size={17} />
        </button>
      </div>
    </section>
  );
}
export function WhySanatPish() {
  const items = [
    {
      Icon: Factory,
      title: "تولید و ساخت",
      text: "بررسی ساخت قطعه از روی نمونه یا نقشه",
    },
    {
      Icon: Layers,
      title: "تأمین قطعات",
      text: "دسترسی به خانواده‌ها و کدهای متنوع کالا",
    },
    {
      Icon: ShieldCheck,
      title: "انتخاب مطمئن",
      text: "مشخصات فنی، تصویر و قیمت هر کد در کنار هم",
    },
    {
      Icon: Truck,
      title: "پیگیری خرید",
      text: "سفارش‌ها، ارسال و باشگاه در پنل شما",
    },
  ];
  return (
    <section className="home-why" aria-labelledby="why-sanat-title">
      <div className="home-why-heading">
        <div>
          <span className="store-eyebrow">یک همراه، در تمام مسیر خرید</span>
          <h2 id="why-sanat-title">چرا صنعت پیش؟</h2>
          <p>
            انتخاب، تأمین و ساخت قطعات صنعتی؛ با پشتوانه بازرگانی تسمه اطلس.
          </p>
        </div>
        <Link to="/about">
          بیشتر درباره ما
          <ArrowUpLeft size={16} />
        </Link>
      </div>
      <div className="home-why-grid">
        {items.map(({ Icon, title, text }) => (
          <article key={title}>
            <span>
              <Icon size={22} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScanLineGraphic() { return <Camera size={18} />; }

export function IndustrialServices() {
  const services = [
    { image: STORE_ASSETS.partsWarehouseVault, Icon: Layers, title: "تأمین قطعات خطوط تولید", text: "تسمه، پولی، بلبرینگ و قطعات انتقال قدرت؛ کالاها را با تصویر، کد و مشخصات فنی بررسی کنید.", to: "/products", action: "مشاهده محصولات" },
    { image: STORE_ASSETS.whySanatCadEngineering, Icon: Factory, title: "ساخت و مهندسی قطعات", text: "برای قطعات سفارشی، نمونه یا نقشه خود را ارائه کنید تا امکان ساخت و مشخصات مورد نیاز بررسی شود.", to: "/contact", action: "درخواست مشاوره ساخت" },
    { image: STORE_ASSETS.whySanatQc, Icon: ShieldCheck, title: "همراه انتخاب فنی شما", text: "برای انتخاب قطعه متناسب با دستگاه و شرایط کار، مشخصات و نیاز خط تولیدتان را با ما در میان بگذارید.", to: "/contact", action: "ارتباط با کارشناسان" },
  ];
  return <section className="home-services" aria-labelledby="home-services-title">
    <div className="store-section-heading"><div><span className="store-eyebrow">صنعت پیش؛ با پشتوانه بازرگانی تسمه اطلس</span><h2 id="home-services-title">از تأمین تا ساخت، کنار خط تولید شما</h2><p>قطعه مناسب را پیدا کنید، مشخصات را بررسی کنید و مسیر خرید را در پنل خود دنبال کنید.</p></div><Link to="/about" className="store-btn-secondary">آشنایی با صنعت پیش <ArrowUpLeft size={17}/></Link></div>
    <div className="home-services-grid">{services.map(({image,Icon,title,text,to,action},i)=><article key={title}><div className="home-services-photo"><img src={image} alt={title} loading="lazy"/><span className="home-services-number">۰{i+1}</span></div><div className="home-services-body"><span className="home-services-icon"><Icon size={23}/></span><h3>{title}</h3><p>{text}</p><Link to={to}>{action}<ArrowUpLeft size={17}/></Link></div></article>)}</div>
    <div className="home-purchase-path" aria-label="مسیر خرید"><strong>مسیر روشن خرید</strong>{["پیدا کردن کد یا خانواده قطعه", "بررسی تصویر، مشخصات و قیمت", "ثبت سفارش و پیگیری در پنل"].map((text,i)=><span key={text}><b>{i+1}</b>{text}</span>)}</div>
  </section>;
}

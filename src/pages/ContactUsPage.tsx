import { MemberAccess } from "../components/storefront/MemberAccess";
import { MapCard } from "./DiscoveryPages";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Phone,
  PhoneCall,
  MapPin,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Building,
  Factory,
  Warehouse,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Truck,
  ExternalLink,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { STORE_ASSETS } from "../assets/images";

interface ContactUsPageProps {
  defaultTab?: "all" | "factory" | "offices";
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  defaultTab = "all",
}) => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as
    "all" | "factory" | "offices" | null;
  const [activeTab, setActiveTab] = useState<"all" | "factory" | "offices">(
    tabFromUrl || defaultTab,
  );

  useEffect(() => {
    if (tabFromUrl && ["all", "factory", "offices"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPlant, setFormPlant] = useState("");
  const [formSubject, setFormSubject] = useState("استعلام قطعات خط تولید");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPhone.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormName("");
      setFormPhone("");
      setFormPlant("");
      setFormMessage("");
    }, 4000);
  };

  // Locations data
  const locations = [
    {
      id: "yazd_office",
      type: "offices",
      title: "دفتر مرکزی بازرگانی و فروش یزد (صنعت پیش)",
      badge: "بازرگانی تسمه اطلس از سال ۱۳۶۶",
      address:
        "یزد، بلوار جمهوری، بعد از بیمارستان افشار، جنب بانک سپه، بازرگانی اطلس (صنعت پیش)",
      postalCode: "۸۹۱۷۹۴۵۶۳۹",
      phone: "۰۳۵-۳۵۲۵۴۷۰۳۴",
      phoneRaw: "035352547034",
      mobile: "۰۹۹۰۳۴۲۷۰۲۷",
      mobileRaw: "09903427027",
      hours: "شنبه تا چهارشنبه ۸:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۸:۰۰ الی ۱۳:۳۰",
      features: [
        "تولید و ساخت سفارشی قطعات خطوط تولید",
        "دپوی بیش از ۳۰,۰۰۰ قلم کالا و ارسال رایگان سراسری",
        "مشاوره هوشمند قطعات با شعار «پیش به صنعت»",
      ],
      image: STORE_ASSETS.whySanatCadEngineering,
    },
    {
      id: "meybod_warehouse",
      type: "factory",
      title: "انبار مرکزی، دپوی رولرها و کارگاه ساخت میبد",
      badge: "قطب کاشی و سرامیک کشور",
      address:
        "استان یزد، میبد، کیلومتر ۳ جاده سنتو، روبروی شهرک صنعتی جهان‌آباد، مجتمع لجستیک صنعت پیش",
      postalCode: "۸۹۶۵۱-۳۴۸۲۱",
      phone: "۰۳۵-۳۵۲۵۴۷۰۳",
      phoneRaw: "03535254703",
      mobile: "۰۹۹۰۳۴۲۷۰۲۷",
      mobileRaw: "09903427027",
      hours: "شبانه‌روزی ۲۴ ساعته (ویژه سفارشات اورژانسی کوره)",
      features: [
        "دپوی بیش از ۲,۴۰۰ شاخه رولر آلومینایی",
        "کارگاه اختصاصی آپارات و روکش لیناتکس",
        "ناوگان حمل اکسپرس کمتر از ۲ ساعت به کارخانجات میبد",
      ],
      image: STORE_ASSETS.whySanatDirectFactory,
    },
    {
      id: "tehran_hq",
      type: "offices",
      title: "دفتر مرکزی بازرگانی و ترخیص تهران",
      badge: "امور بازرگانی خارجی و اسناد رسمی",
      address:
        "تهران، خیابان سعدی جنوبی، روبروی بانک تجارت، پاساژ صدوقی، طبقه ۲، واحد ۲۴",
      postalCode: "۱۱۴۳۷-۶۸۲۹۱",
      phone: "۰۲۱-۳۳۹۲۸۴۵۰",
      phoneRaw: "02133928450",
      mobile: "۰۹۹۰۳۴۲۷۰۲۷",
      mobileRaw: "09903427027",
      hours: "شنبه تا چهارشنبه ۸:۳۰ الی ۱۷:۳۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۳:۳۰",
      features: [
        "واحد صدور فاکتور رسمی و امور مالیاتی",
        "ترخیص مستقیم سفارشات گمرکی",
        "انبار قطعات دوار سبک و بلبرینگ‌های خاص",
      ],
      image:
        STORE_ASSETS.partsWarehouseVault ||
        STORE_ASSETS.whySanatExpressDelivery,
    },
  ];

  const filteredLocations =
    activeTab === "all"
      ? locations
      : locations.filter((loc) => loc.type === activeTab);

  return (
    <div
      className="w-full text-right font-sans min-h-screen bg-[#F8F9FA] text-[#55565A]"
      dir="rtl"
    >
      {/* 1. TOP BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-bold text-slate-500 hover:text-[#E06518] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>صفحه اصلی</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-black text-[#55565A] flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#E06518]" />
              تماس با ما و آدرس کارخانه و دفاتر
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Building className="w-3.5 h-3.5 text-[#E06518]" />
              <span>درباره ما و گواهینامه‌ها</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. HERO HEADER */}
      <section className="relative w-full overflow-hidden bg-[#55565A] text-white py-12 sm:py-16 border-b border-[#414146]">
        <div className="absolute inset-0 z-0">
          <img
            src={STORE_ASSETS.whySanatExpressDelivery}
            alt="تماس با صنعت‌پیش"
            className="w-full h-full object-cover object-center filter grayscale-[0.25] brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#55565A]/95 via-[#55565A]/85 to-[#414146]/70" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-[#E06518]" />
            <span>پاسخگویی سریع کمتر از ۱۵ دقیقه در ساعات کاری</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              راه‌های ارتباط، مشاوره فنی و
              <span className="block text-[#E06518] pt-1">
                آدرس کارخانه و انبار مرکزی
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              جهت استعلام قیمت، اعزام کارشناس به خط تولید یا مراجعه حضوری به
              انبار میبد و دفاتر فروش، از طریق کانال‌های زیر در خدمت شما هستیم.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MAIN SECTION */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Contact Form & Quick Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Direct Contacts */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4 text-right">
              <h2 className="text-base font-black text-[#2B313A] flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#E06518]" />
                <span>شماره‌های تماس مستقیم و اضطراری</span>
              </h2>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center justify-between">
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      تلفن مستقیم دفتر مرکزی یزد (صنعت پیش):
                    </span>
                    <div
                      className="text-base font-black font-mono text-[#2B313A]"
                      dir="ltr"
                    >
                      ۰۳۵-۳۵۲۵۴۷۰۳
                    </div>
                  </div>
                  <a
                    href="tel:03535254703"
                    className="h-9 px-3.5 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>تماس فوری</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center justify-between">
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      پشتیبانی واتس‌اپ و ارسال پیش‌فاکتور:
                    </span>
                    <div
                      className="text-base font-black font-mono text-emerald-700"
                      dir="ltr"
                    >
                      ۰۹۹۰۳۴۲۷۰۲۷
                    </div>
                  </div>
                  <a
                    href="https://wa.me/989903427027"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>چت واتساپ</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center justify-between">
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      نشانی دفتر مرکزی و انبار قطعات:
                    </span>
                    <div className="text-xs font-medium text-[#2B313A]">
                      یزد، بلوار جمهوری، بعد از بیمارستان افشار، جنب بانک سپه
                    </div>
                  </div>
                  <a
                    href="tel:03535254703"
                    className="h-9 px-3.5 bg-[#55565A] hover:bg-[#E06518] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>کد: ۸۹۱۷۹۴۵۶۳۹</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center justify-between">
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      ایمیل دریافت فایل نقشه‌ها و RFQ:
                    </span>
                    <div
                      className="text-xs font-bold font-mono text-slate-800"
                      dir="ltr"
                    >
                      rfq@sanatpish.com
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("rfq@sanatpish.com", "email")}
                    className="h-9 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === "email" ? "کپی شد" : "کپی"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-right">
              <div className="text-xs font-black text-[#2B313A] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#E06518]" />
                <span>تضمین تحویل در محل کارخانه</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                ناوگان اختصاصی تحویل اکسپرس برای کلیه شهرک‌های صنعتی استان‌های
                یزد، اصفهان، قزوین، البرز و تهران فعال است.
              </p>
            </div>
          </div>

          {/* Contact & RFQ Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5 text-right">
              <div className="space-y-1">
                <span className="text-xs font-black text-[#E06518] uppercase">
                  مسیر استعلام و پیگیری
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2B313A]">
                  استعلام خود را از پنل ثبت کنید
                </h2>
                <p className="text-xs text-slate-500">
                  قیمت و موجودی هر کد را در حساب کاربری بررسی کنید. برای هماهنگی
                  مراجعه، از شماره‌های تماس استفاده کنید.
                </p>
              </div>

              <MemberAccess />
            </div>
          </div>
        </div>

        {/* 4. FACTORY & OFFICES ADDRESSES CARDS (آدرس کارخانه، انبار مرکزی و دفاتر) */}
        <MapCard />
        <section id="factory" className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1 text-right">
              <span className="text-xs font-black text-[#E06518] uppercase">
                آدرس کارخانه، دپوی انبارها و شعب
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B313A]">
                موقعیت کارخانجات، انبار مرکزی و دفاتر منطقه‌ای
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                دسترسی سریع برای بارگیری، تحویل حضوری و جلسات هماهنگی فنی:
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#55565A] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                همه شعب
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("factory")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "factory"
                    ? "bg-[#E06518] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                انبار مرکزی و کارگاه میبد
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("offices")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "offices"
                    ? "bg-[#55565A] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                دفاتر مهندسی و بازرگانی
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-[#E06518] shadow-2xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between text-right group"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={loc.image}
                      alt={loc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#E06518] text-white text-[10px] font-black shadow-md">
                      {loc.badge}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-black text-[#2B313A] leading-snug group-hover:text-[#E06518] transition-colors">
                      {loc.title}
                    </h3>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#E06518] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{loc.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">
                          کد پستی:
                        </span>
                        <span className="font-mono text-slate-800 font-bold">
                          {loc.postalCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-600">
                          {loc.hours}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-500">
                        امکانات و خدمات این مرکز:
                      </div>
                      {loc.features.map((feat, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-slate-700 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                    <a
                      href={`tel:${loc.phoneRaw}`}
                      className="flex-1 h-10 rounded-xl bg-[#55565A] hover:bg-[#E06518] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{loc.phone}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(loc.address, loc.id)}
                      className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="کپی آدرس کامل"
                    >
                      {copiedId === loc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">
                        {copiedId === loc.id ? "کپی شد" : "کپی آدرس"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

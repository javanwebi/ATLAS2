import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  ShieldCheck,
  Zap,
  Layers,
  Settings,
  Truck,
  PhoneCall,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calculator,
  Sparkles,
  Thermometer,
  Factory,
  Search,
  AlertCircle,
  HelpCircle,
  Package,
  Wrench,
  Bot,
  Sliders,
  Send,
  MessageCircle,
  Clock,
  Building,
  RefreshCw,
  Cpu,
  Award,
  Building2,
  History,
  FileCheck2,
  Warehouse,
  MapPin,
} from 'lucide-react';
import { STORE_ASSETS } from '../assets/images';
import { toPersianDigits } from '../utils/formatters';

// Types for Ceramic Products
interface CeramicProductItem {
  id: string;
  name: string;
  code: string;
  subTitle: string;
  category: 'kiln' | 'press' | 'glaze' | 'sorting' | 'milling' | 'all';
  categoryLabel: string;
  tempRating: string;
  inStock: boolean;
  image: string;
  badge?: string;
  keySpecs: { label: string; value: string }[];
  applications: string;
}

// Tile Production Plant Stage
interface PlantStage {
  id: string;
  stageNumber: string;
  title: string;
  englishTitle: string;
  description: string;
  criticalChallenge: string;
  sanatPishSolution: string;
  criticalParts: string[];
  icon: React.ElementType;
  image: string;
}

export const TileCeramicIndustryPage: React.FC = () => {
  // Scroll progress for vertical indicator
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. FILTERING & SEARCH STATE
  // ---------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 2. ACTIVE FACTORY STAGE IN MAP
  // ---------------------------------------------------------------------------
  const [activeStageId, setActiveStageId] = useState<string>('kiln');

  // ---------------------------------------------------------------------------
  // 3. FULL-SCREEN AI CERAMIC WORKSTATION STATE
  // ---------------------------------------------------------------------------
  const [aiTab, setAiTab] = useState<'advisor' | 'troubleshooter'>('advisor');

  // AI Roller Advisor Inputs
  const [aiTileType, setAiTileType] = useState<string>('porcelain_slab');
  const [aiKilnTemp, setAiKilnTemp] = useState<number>(1240);
  const [aiRollerDiameter, setAiRollerDiameter] = useState<number>(50); // 40mm to 65mm
  const [aiLineSpeed, setAiLineSpeed] = useState<number>(20); // 10 to 35 m/min
  const [aiKilnWidth, setAiKilnWidth] = useState<number>(3.1); // 2.2 to 3.8m

  // AI Troubleshooter State
  const [selectedDefectId, setSelectedDefectId] = useState<string>('defect_roller_break');

  // ---------------------------------------------------------------------------
  // 4. QUICK RFQ INQUIRY MODAL STATE
  // ---------------------------------------------------------------------------
  const [rfqModalOpen, setRfqModalOpen] = useState<boolean>(false);
  const [rfqItem, setRfqItem] = useState<string>('رولر سرامیکی آلومینایی کوره پخت AL70/80');
  const [rfqName, setRfqName] = useState<string>('');
  const [rfqPhone, setRfqPhone] = useState<string>('');
  const [rfqPlantName, setRfqPlantName] = useState<string>('');
  const [rfqNote, setRfqNote] = useState<string>('');
  const [rfqSuccess, setRfqSuccess] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // DATA: PLANT STAGES (کجا به کار می‌آییم؟)
  // ---------------------------------------------------------------------------
  const plantStages: PlantStage[] = [
    {
      id: 'milling',
      stageNumber: '۰۱',
      title: 'آماده‌سازی مواد و اسپری درایر',
      englishTitle: 'Milling & Spray Dryer',
      description: 'آسیاب بالمیل، پمپ‌های پیستونی دوغاب و خشک‌کن پاششی (اسپری درایر) جهت تولید گرانول یکنواخت تحت فشار و دمای بالا.',
      criticalChallenge: 'سایش شدید ناشی از اصطکاک دوغاب سیلیسی، فرسایش نازل‌های پاشش و خرابی زودهنگام کاسه‌نمدهای پمپ.',
      sanatPishSolution: 'تأمین نازل‌های سرامیکی SiSiC کاربید سیلیکون با سختی ۹ موهس و تسمه‌های انتقال قدرت مقاوم به رطوبت و روغن.',
      criticalParts: ['نازل سرامیکی کاربید سیلیکون اسپری درایر', 'بلبرینگ‌های سنگین بالمیل', 'تسمه‌های V-Belt پمپ دوغاب', 'پکینگ‌های سیل هیدرولیک'],
      icon: Factory,
      image: STORE_ASSETS.products.ceramicParts,
    },
    {
      id: 'press',
      stageNumber: '۰۲',
      title: 'پرس هیدرولیک سنگین و قالب‌گیری',
      englishTitle: 'Heavy Hydraulic Press',
      description: 'شکل‌دهی گرانول با فشارهای سنگین ۳۰۰۰ تا ۷۵۰۰ تن جهت تولید بیسکویت متراکم کاشی، پرسلان و اسلب‌های عریض.',
      criticalChallenge: 'ضربه و گشتاورهای کوبشی ناگهانی، لرزش شفت و توقف پرهزینه پمپ‌های هیدرولیک ناشی از بالانس نبودن فلکه‌ها.',
      sanatPishSolution: 'پولی‌های چدنی دانه ریز GG25 با بالانس دینامیکی کلاس Q 6.3 و سیستم اتصال بوش مخروطی Taper Lock جهت تعویض فوری بدون آسیب به شفت.',
      criticalParts: ['پولی‌های چدنی سنگین GG25', 'بوش مخروطی Taper Lock', 'تسمه‌های شیاردار انتقال گشتاور', 'کوپلینگ‌های انعطاف‌پذیر چدنی'],
      icon: Settings,
      image: STORE_ASSETS.products.aluPulley,
    },
    {
      id: 'kiln',
      stageNumber: '۰۳',
      title: 'کوره پخت رولری (قلب تپنده کارخانه)',
      englishTitle: 'Roller Kiln Conveyor',
      description: 'پخت بیسکویت و لعاب در دمای ۱۱۰۰ الی ۱۳۵۰ درجه با چرخش پیوسته و کاملاً هماهنگ صدها رولر سرامیکی نسوز.',
      criticalChallenge: 'تابیدگی رولر در اثر شوک حرارتی، قفل شدن بلبرینگ‌های کوره در مجاورت هوای داغ، و افتادن اسلب روی رولرها.',
      sanatPishSolution: 'رولرهای آلومینایی AL70/80/99 تست‌شده با کوارتر مهندسی و بلبرینگ‌های نسوز دمای بالای C4 با گریس کلوبر اصل آلمان.',
      criticalParts: ['رولر سرامیکی آلومینایی کوره (AL70 / AL80)', 'بلبرینگ نسوز کوره سری 6200 C4', 'الکتروگیربکس‌های خطی حرکت رولر', 'زنجیرهای حرارتی نقاله کوره'],
      icon: Flame,
      image: STORE_ASSETS.products.ceramicRoller,
    },
    {
      id: 'glaze',
      stageNumber: '۰۴',
      title: 'خط لعاب‌زنی و چاپ دیجیتال',
      englishTitle: 'Glazing & Digital Print Line',
      description: 'اعمال دوغاب لعاب، انگوب، افکت‌های مات و براق و چاپ طرح‌های رزولوشن بالا بر روی کاشی خام با حرکت یکنواخت.',
      criticalChallenge: 'لغزش کاشی روی تسمه، خط افتادن روی بدنه و عدم هماهنگی گام حرکت کاشی با سنسور هد چاپگر دیجیتال.',
      sanatPishSolution: 'تسمه‌های تایمینگ دنده‌ای با روکش لیناتکس طبیعی قرمز ۶-۸ میلی‌متر و تسمه‌های PU سبز ضدسایش بدون خط‌اندازی.',
      criticalParts: ['تسمه تایمینگ روکش لیناتکس قرمز Linatex', 'تسمه PU دنده‌ای T10/AT10', 'پولی‌های آلومینیومی دقیق', 'تسمه‌های راند پلی‌اورتان'],
      icon: Layers,
      image: STORE_ASSETS.products.pvcBelt,
    },
    {
      id: 'sorting',
      stageNumber: '۰۵',
      title: 'کالیبراسیون، گونیا، سورت و بسته‌بندی',
      englishTitle: 'Squaring, Polishing & Packaging',
      description: 'برش دقیق ابعادی (رکتیفای و پولیش)، کنترل کیفی هوشمند درجه‌بندی، کارتن‌گذاری اتوماتیک و پالت‌پیچی نهایی.',
      criticalChallenge: 'سایش پودر سنگ و آب‌صابون روی زنجیرها و لقی و فرسایش یاتاقان‌های کله‌های پولیش در رطوبت مداوم.',
      sanatPishSolution: 'زنجیرهای نقاله دوگانه ضدزنگ نیکل‌پلیتد و یاتاقان‌های هوزینگی با گریس‌خور آب‌بند جهت طول عمر ۳ برابری در محیط مرطوب.',
      criticalParts: ['زنجیر نقاله دوطرفه خط گونیاسازی (80B)', 'تسمه نقاله PVC گریپ ضدلغزش', 'یاتاقان‌های ضد گردوغبار UCFL', 'چرخ‌زنجیرهای دوبل سخت‌کاری‌شده'],
      icon: CheckCircle2,
      image: STORE_ASSETS.categories.chains,
    },
  ];

  // ---------------------------------------------------------------------------
  // DATA: CERAMIC PRODUCTS CATALOG
  // ---------------------------------------------------------------------------
  const ceramicProducts: CeramicProductItem[] = [
    {
      id: 'prod-roller-al70',
      name: 'رولر سرامیکی آلومینایی کوره پخت (گرید AL70)',
      code: 'CER-ROL-AL70',
      subTitle: 'مقاوم در برابر شوک حرارتی تا ۱۲۸۰°C، مناسب کوره‌های پخت بیسکویت و کاشی دیواری',
      category: 'kiln',
      categoryLabel: 'کوره پخت',
      tempRating: '۱۲۸۰°C',
      inStock: true,
      image: STORE_ASSETS.products.ceramicRoller,
      badge: 'پرفروش‌ترین در کارخانجات میبد',
      keySpecs: [
        { label: 'درصد آلومینا', value: '۷۰٪ - ۷۲٪ Al2O3' },
        { label: 'مقاومت خمشی (MOR)', value: '≥ ۵۵ MPa' },
        { label: 'ضریب انبساط حرارتی', value: '۵.۲ × 10^-6 /°C' },
        { label: 'مقاومت شوک حرارتی', value: 'بسیار بالا (تست کوارتر)' },
      ],
      applications: 'مناسب محدوده پیش‌پخت و پخت اصلی در کوره‌های عرض ۲.۵ الی ۳.۱ متر',
    },
    {
      id: 'prod-roller-al80',
      name: 'رولر سرامیکی فوق نسوز پرسلان و اسلب (گرید AL80/AL99)',
      code: 'CER-ROL-AL80',
      subTitle: 'تحمل فوق‌العاده بار مکانیکی در دمای ۱۳۵۰°C برای خطوط تولید اسلب‌های سایز بزرگ',
      category: 'kiln',
      categoryLabel: 'کوره پخت',
      tempRating: '۱۳۵۰°C',
      inStock: true,
      image: STORE_ASSETS.products.ceramicRoller,
      badge: 'مخصوص کاشی پرسلان و اسلب',
      keySpecs: [
        { label: 'درصد آلومینا', value: '۸۰٪ - ۸۵٪ Al2O3' },
        { label: 'مقاومت خمشی (MOR)', value: '≥ ۷۰ MPa' },
        { label: 'تلرانس تابیدگی', value: '< ۰.۱ میلی‌متر در متر' },
        { label: 'تحمل بار وزنی اسلب', value: 'تا ۱۲۰ کیلوگرم در هر رولر' },
      ],
      applications: 'ناحیه حداکثر پخت کوره‌های پرسلان و کارخانجات مدرن تولید اسلب',
    },
    {
      id: 'prod-belt-linatex',
      name: 'تسمه تایمینگ دنده‌ای با روکش لیناتکس خط لعاب و چاپ',
      code: 'BELT-TIM-LNX',
      subTitle: 'روکش لیناتکس اصل ضدسایش با اصطکاک بالا، بدون لغزش و با محافظت کامل از کاشی خام',
      category: 'glaze',
      categoryLabel: 'خط لعاب و چاپ',
      tempRating: '۸۰°C',
      inStock: true,
      image: STORE_ASSETS.products.pvcBelt,
      badge: 'استاندارد اروپایی FORZA',
      keySpecs: [
        { label: 'جنس روکش', value: 'لیناتکس طبیعی قرمز ۶-۸ میلی‌متر' },
        { label: 'نوع گام دنده', value: 'T10 / AT10 / HTD 8M' },
        { label: 'پایداری ابعادی', value: 'دارای کورد فولادی تقویت‌شده' },
        { label: 'مقاومت شیمیایی', value: 'مقاوم در برابر لعاب و انگوب' },
      ],
      applications: 'خطوط چاپ دیجیتال، دستگاه‌های بل و لعاب‌زنی با حرکت کاملاً یکدست',
    },
    {
      id: 'prod-bearing-c4',
      name: 'بلبرینگ نسوز کوره با لقی C4 و گریس کلوبر (Series 6200 HT)',
      code: 'BRG-HT-6208',
      subTitle: 'طراحی اختصاصی برای دمای بالای دیواره کوره با لقی شعاعی C4 جهت جلوگیری از گریپاژ',
      category: 'kiln',
      categoryLabel: 'کوره پخت',
      tempRating: '۳۵۰°C',
      inStock: true,
      image: STORE_ASSETS.products.bearingNsk || STORE_ASSETS.products.bearing,
      badge: 'اصالت تضمینی SKF / NSK',
      keySpecs: [
        { label: 'نوع روانکار', value: 'Klüber Asonic HT نسوز' },
        { label: 'کلاس لقی داخلی', value: 'C4 High Thermal Clearance' },
        { label: 'جنس رینگ و ساچمه', value: 'فولاد سخت‌کاری‌شده حرارتی' },
        { label: 'نوع حفاظ', value: '2Z شیلد فلزی دوطرفه' },
      ],
      applications: 'هدایت چرخ‌دنده و زنجیر سر رولرهای کوره در مجاورت هوای داغ',
    },
    {
      id: 'prod-pulley-press',
      name: 'پولی و فلکه چدنی سنگین خط پرس با بوش Taper Lock',
      code: 'PUL-KILN-TL',
      subTitle: 'چدن خاکستری دانه ریز با بالانس دینامیکی بالا جهت مهار ضربات سنگین پرس هیدرولیک',
      category: 'press',
      categoryLabel: 'پرس هیدرولیک',
      tempRating: '۱۵۰°C',
      inStock: true,
      image: STORE_ASSETS.products.aluPulley,
      badge: 'نصب و تعویض در کمتر از ۵ دقیقه',
      keySpecs: [
        { label: 'متریال', value: 'چدن خاکستری GG25 استاندارد' },
        { label: 'سیستم اتصال', value: 'بوش مخروطی Taper Lock Bushing' },
        { label: 'کلاس بالانس', value: 'ISO 1940 Class Q 6.3' },
        { label: 'سازگاری تسمه', value: 'SPA, SPB, SPC, 8V' },
      ],
      applications: 'الکتروموتورهای اصلی پمپ هیدرولیک پرس‌های سکمی، ناسوتی و سیتی',
    },
    {
      id: 'prod-chain-squaring',
      name: 'زنجیر نقاله دوطرفه خط گونیاسازی و کالیبراسیون',
      code: 'CHN-SQ-80B',
      subTitle: 'زنجیر سخت‌کاری‌شده با پین‌های مقاوم به سایش، ضدزنگ در برابر آب‌صابون و پودر سنگ',
      category: 'sorting',
      categoryLabel: 'گونیا و سورت',
      tempRating: '۲۰۰°C',
      inStock: true,
      image: STORE_ASSETS.categories.chains,
      badge: 'سختی سطحی ۵۸ HRC',
      keySpecs: [
        { label: 'استاندارد ساخت', value: 'DIN 8187 / ISO 606' },
        { label: 'پوشش محافظ', value: 'پوشش نیکل ضدزنگ Nickel Plated' },
        { label: 'طول عمر مفید', value: '۳ برابر زنجیرهای تجاری بازار' },
        { label: 'پیوستگی ابعادی', value: 'جفت‌شده به صورت Pair Matching' },
      ],
      applications: 'خطوط رکتیفای، گونیا، پولیش و دستگاه‌های سورتینگ اتوماتیک کاشی',
    },
    {
      id: 'prod-nozzle-dryer',
      name: 'نازل سرامیکی ضدسایش کاربید سیلیکون اسپری درایر',
      code: 'NZL-SP-SIC',
      subTitle: 'مقاومت استثنایی در برابر سایش دوغاب غلیظ سیلیس، حفظ زاویه پاشش و گرانول یکنواخت',
      category: 'milling',
      categoryLabel: 'اسپری درایر',
      tempRating: '۶۰۰°C',
      inStock: true,
      image: STORE_ASSETS.products.ceramicParts,
      badge: 'عمر مفید ۶ برابر فولاد تنگستن',
      keySpecs: [
        { label: 'متریال بدنه', value: 'کاربید سیلیکون باند واکنشی (SiSiC)' },
        { label: 'سختی', value: '۲۵۰۰ HV (بسیار سخت)' },
        { label: 'دقت سوراخ پاشش', value: 'تلرانس ±۰.۰۲ میلی‌متر' },
        { label: 'مقاومت خوردگی', value: '۱۰۰٪ خنثی در برابر اسید و باز' },
      ],
      applications: 'لانس‌های پاشش پمپ‌های پیستونی در اسپری درایرهای کارخانجات کاشی',
    },
    {
      id: 'prod-gearbox-kiln',
      name: 'الکتروگیربکس حلزونی و شافت مستقیم حرکت رولرهای کوره',
      code: 'GBX-KILN-DRV',
      subTitle: 'کارکرد پیوسته ۲۴ ساعته با حداقل لرزش جهت تضمین چرخش کاملاً منظم رولرها در کوره',
      category: 'kiln',
      categoryLabel: 'کوره پخت',
      tempRating: '۱۲۰°C',
      inStock: true,
      image: STORE_ASSETS.products.motor,
      badge: 'روغن‌کاری دائمی سنتتیک',
      keySpecs: [
        { label: 'نسبت تبدیل (Ratio)', value: 'i = 10 تا i = 100' },
        { label: 'کلاس بازدهی موتور', value: 'IE3 Premium Efficiency' },
        { label: 'درجه حفاظت', value: 'IP66 ضد گردوغبار سرامیک' },
        { label: 'تطابق اینورتر', value: 'سازگار با کنترل دور VFD' },
      ],
      applications: 'محرک ماژول‌های انتقال کوره، کانوایرهای بیسکویت و بازوهای اتوماسیون',
    },
  ];

  // ---------------------------------------------------------------------------
  // FILTERED PRODUCTS
  // ---------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return ceramicProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.applications.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !inStockOnly || product.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [selectedCategory, searchQuery, inStockOnly]);

  // ---------------------------------------------------------------------------
  // AI ADVISOR CALCULATION
  // ---------------------------------------------------------------------------
  const aiAdvisorResult = useMemo(() => {
    let recommendedGrade = 'AL70 (۷۰٪ آلومینا)';
    let thermalShockResistance = 'عالی (تحمل تا ۱۲۸۰ درجه)';
    let maxLoadKg = '۶۰ کیلوگرم در هر رولر';
    let rollerSpacing = '۵۵ تا ۶۵ میلی‌متر';
    let riskNotes = 'مناسب خطوط نرمال کاشی دیواری و پرسلان سبک. مقاومت خمشی ۵۵ مگاپاسکال.';
    let flexuralStrength = 58;

    if (aiTileType === 'porcelain_slab') {
      recommendedGrade = 'AL80 یا AL99 (۸۰ تا ۹۰ درصد آلومینا - Heavy Duty)';
      thermalShockResistance = 'فوق مقاوم (تحمل تا ۱۳۵۰ درجه با شوک‌پذیری بالا)';
      maxLoadKg = '۱۲۰ تا ۱۴۰ کیلوگرم در هر رولر';
      rollerSpacing = '۴۵ تا ۵۰ میلی‌متر جهت جلوگیری از افتادگی اسلب';
      riskNotes = 'به علت ابعاد بزرگ اسلب، تلرانس تابیدگی رولر باید کمتر از ۰.۱ میلی‌متر باشد.';
      flexuralStrength = 78;
    } else if (aiKilnTemp > 1250) {
      recommendedGrade = 'AL80 نانو ساختار (Nano-Structured Alumina)';
      thermalShockResistance = 'ویژه حداکثر دمای کوره (Peak Sintering)';
      maxLoadKg = '۹۵ کیلوگرم';
      rollerSpacing = '۵۰ میلی‌متر';
      riskNotes = 'در این دما استفاده از گرید پایین‌تر موجب خمش رولر در زمان توقف احتمالی کوره می‌شود.';
      flexuralStrength = 72;
    }

    const loadCapacityCalculated = Math.round((aiRollerDiameter / 50) * (aiKilnTemp > 1250 ? 90 : 70));

    return {
      grade: recommendedGrade,
      shock: thermalShockResistance,
      load: `${toPersianDigits(loadCapacityCalculated)} کیلوگرم`,
      spacing: rollerSpacing,
      notes: riskNotes,
      mor: `${toPersianDigits(flexuralStrength)} MPa`,
    };
  }, [aiTileType, aiKilnTemp, aiRollerDiameter]);

  // ---------------------------------------------------------------------------
  // AI TROUBLESHOOTER DEFECT DATABASE
  // ---------------------------------------------------------------------------
  const defectDatabase = [
    {
      id: 'defect_roller_break',
      title: 'شکستن یا ترک برداشتن رولر در منطقه خنک‌کن یا پیش‌پخت',
      symptom: 'رولر در ناحیه گرادیان دمایی شدید ناگهان دو نیم می‌شود و باعث افتادن کاشی در کوره می‌گردد.',
      rootCause:
        'استفاده از رولرهای با ضریب انبساط حرارتی بالا یا ناخالصی فاز شیشه‌ای در متریال رولر، که تحمل شوک سرد شدن یا گرم شدن ناگهانی را ندارند.',
      remedy:
        'جایگزینی با رولرهای گرید AL70 با فاز مولایت کنترل‌شده و تست کوارتر حرارتی ۱۰۰٪. تنظیم دمای دمنده‌های هوای خنک‌کن.',
      recommendedPart: 'رولر سرامیکی AL70 با تست کوارتر فورزا (کد: CER-ROL-AL70)',
    },
    {
      id: 'defect_tile_curvature',
      title: 'تابیدگی، شکم دادن و انحراف کاشی هنگام خروج از کوره پخت',
      symptom: 'کاشی‌های خروجی دارای قوس محدب یا مقعر بوده و در دستگاه سورت رد می‌شوند.',
      rootCause:
        'عدم هم‌راستایی و تابیدگی رولرهای کوره به دلیل خمش در دمای بالا، یا اختلاف سرعت چرخش رولرهای مجاور ناشی از خوردگی زنجیر و چرخ‌دنده.',
      remedy:
        'بررسی رولرها با گیج ساعت ابعادی. تعویض رولرهای تاب‌برداشته با رولر تلرانس صفر AL80 و تعویض بلبرینگ‌های گریپاژشده C4.',
      recommendedPart: 'رولر سرامیکی AL80 مخصوص پرسلان و اسلب (کد: CER-ROL-AL80)',
    },
    {
      id: 'defect_glaze_slipping',
      title: 'لغزش، جابجایی یا خط افتادن روی کاشی خام در خط لعاب و چاپ دیجیتال',
      symptom: 'طرح چاپ دیجیتال کج می‌افتد یا لبه‌های کاشی حین عبور از زیر نازل لعاب لب‌پر می‌شود.',
      rootCause:
        'استهلاک روکش تسمه نقاله، سفت شدن لاستیک معمولی در اثر تماس با آب و مواد شیمیایی لعاب، یا تجمع دوغاب روی تسمه.',
      remedy:
        'به‌کارگیری تسمه‌های دنده‌ای PU با روکش لیناتکس طبیعی قرمز ۶ میلی‌متر با ضریب چسبندگی بالا و قابلیت شستشو بدون تغییر ابعاد.',
      recommendedPart: 'تسمه تایمینگ دنده‌ای با روکش لیناتکس اصل (کد: BELT-TIM-LNX)',
    },
    {
      id: 'defect_bearing_seizure',
      title: 'داغ کردن، صدای غیرعادی و قفل شدن بلبرینگ‌های سر رولر کوره',
      symptom: 'بلبرینگ بعد از چند هفته کارکرد در مجاورت بدنه کوره خشک شده و قفل می‌کند.',
      rootCause:
        'استفاده از بلبرینگ‌های معمولی با گریس پایه لیتیوم تجاری که در دمای بالای ۱۵۰ درجه تبخیر شده و بر اثر انبساط حرارتی ساچمه‌ها قفل می‌شوند.',
      remedy:
        'استفاده از بلبرینگ‌های کلاس لقی C4 با گریس تخصصی نسوز Klüber Asonic HT و شیلد فلزی محافظت در برابر گردوغبار نسوز.',
      recommendedPart: 'بلبرینگ نسوز کوره سری 6200 با لقی C4 (کد: BRG-HT-6208)',
    },
  ];

  const currentDefect =
    defectDatabase.find((d) => d.id === selectedDefectId) || defectDatabase[0];

  const openRfqWithItem = (itemName: string) => {
    setRfqItem(itemName);
    setRfqSuccess(false);
    setRfqModalOpen(true);
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqPhone) return;
    setRfqSuccess(true);
    setTimeout(() => {
      setRfqModalOpen(false);
      setRfqSuccess(false);
      setRfqName('');
      setRfqPhone('');
      setRfqPlantName('');
      setRfqNote('');
    }, 3500);
  };

  return (
    <div className="w-full text-right font-sans min-h-screen bg-white text-[#55565A] select-none" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 0. VERTICAL ORANGE SCROLL INDICATOR LINE                                 */}
      {/* ========================================================================= */}
      <div className="fixed top-0 right-0 z-50 w-1.5 h-full pointer-events-none bg-slate-200">
        <div
          className="w-full bg-gradient-to-b from-[#C95210] via-[#E06518] to-[#FF8C00] shadow-[0_0_10px_#E06518] transition-all duration-75"
          style={{ height: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BREADCRUMB STRIP                                          */}
      {/* ========================================================================= */}
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
              <Flame className="w-4 h-4 text-[#E06518]" />
              صنایع کاشی و سرامیک و نسوز
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:03538739900"
              className="hidden md:flex items-center gap-2 text-xs font-extrabold text-[#55565A] hover:text-[#E06518] px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E06518]" />
              <span>تدارکات یزد و میبد: ۰۳۵-۳۸۷۳۹۹۰۰</span>
            </a>

            <button
              type="button"
              onClick={() => openRfqWithItem('استعلام کلی قطعات کاشی و سرامیک')}
              className="h-9 px-4 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>استعلام فوری قیمت (RFQ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FULL-SCREEN CINEMATIC HERO SECTION (خاکستری و نارنجی بر اساس صفحه اصلی) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#55565A] text-white min-h-[580px] sm:min-h-[640px] lg:h-[700px] xl:h-[750px] flex flex-col justify-between border-b border-[#414146]">
        
        {/* Full-Bleed Plant Image with Neutral Gray Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={STORE_ASSETS.industries.ceramic}
            alt="خط تولید و کوره پخت کاشی و سرامیک"
            className="w-full h-full object-cover object-center scale-105 filter grayscale-[0.3] brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#55565A]/95 via-[#55565A]/80 to-[#414146]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#55565A] via-transparent to-[#55565A]/90" />
        </div>

        {/* Diagonal Neon Laser Lines in Orange */}
        <div className="absolute bottom-0 right-0 w-[60%] h-48 pointer-events-none z-1 overflow-hidden opacity-90">
          <div className="absolute -bottom-10 right-10 w-[750px] h-[3.5px] bg-gradient-to-r from-transparent via-[#E06518] to-transparent rotate-[-18deg] shadow-[0_0_20px_#E06518]" />
          <div className="absolute -bottom-20 right-40 w-[650px] h-[2px] bg-gradient-to-r from-transparent via-[#C95210] to-transparent rotate-[-18deg] shadow-[0_0_12px_#C95210]" />
        </div>

        {/* Micro Dot Matrix */}
        <div className="absolute inset-0 z-1 bg-[radial-gradient(#E0651830_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none opacity-50" />

        {/* Main Content Container */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 lg:pt-16 pb-8 flex-1 flex flex-col justify-between">
          
          {/* Top Ribbon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-[2.5px] bg-[#E06518] rounded-full shadow-[0_0_8px_#E06518]" />
              <span className="text-xs sm:text-[13px] font-black text-orange-400 tracking-wider uppercase font-mono drop-shadow">
                CERAMIC & PORCELAIN INDUSTRY — ATLAS TRADING
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-[11px] font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>پوشش کامل شهرک‌های صنعتی میبد، یزد، اصفهان و قزوین</span>
            </div>
          </div>

          {/* Hero Center Text */}
          <div className="my-auto py-6 max-w-3xl space-y-5 text-right">
            <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-black leading-[1.2] sm:leading-[1.15] tracking-tight text-white drop-shadow-xl">
              تأمین تخصصی قطعات خطوط
              <span className="block text-[#E06518] pt-2 drop-shadow-[0_4px_20px_rgba(224,101,24,0.6)]">
                کاشی، پرسلان و کوره‌های پخت
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow-md">
              مرکز دپو و پخش بدون‌واسطه رولرهای آلومینایی کوره پخت (گرید AL70 تا AL99)، بلبرینگ‌های نسوز دمای بالا C4،
              تسمه‌های تایمینگ روکش لیناتکس خط لعاب و قطعات سنگین پرس با گارانتی کتبی عدم توقف خط در محل کارخانه.
            </p>

            {/* 3 Prominent Stat Pill Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#414146]/90 backdrop-blur-md border border-white/20 shadow-lg space-y-1">
                <div className="text-orange-400 font-mono font-black text-lg sm:text-xl drop-shadow">+۲,۴۰۰ شاخه</div>
                <div className="text-xs text-white font-black">رولر آلومینایی دپو</div>
                <div className="text-[11px] text-slate-300 font-medium">آماده بارگیری فوری در انبار میبد</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#414146]/90 backdrop-blur-md border border-white/20 shadow-lg space-y-1">
                <div className="text-emerald-400 font-mono font-black text-lg sm:text-xl drop-shadow">&lt; ۲۴ ساعت</div>
                <div className="text-xs text-white font-black">تحویل در محل کارخانه</div>
                <div className="text-[11px] text-slate-300 font-medium">ناوگان حمل اکسپرس شهرک‌های کاشی</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#414146]/90 backdrop-blur-md border border-white/20 shadow-lg space-y-1">
                <div className="text-cyan-400 font-mono font-black text-lg sm:text-xl drop-shadow">۱۳۵۰°C</div>
                <div className="text-xs text-white font-black">تحمل شوک حرارتی</div>
                <div className="text-[11px] text-slate-300 font-medium">تست کوارتر و آنالیز متالوژی</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => openRfqWithItem('استعلام فوری رولرها و قطعات کوره پخت')}
                className="h-12 sm:h-13 px-8 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_8px_25px_rgba(224,101,24,0.5)] hover:scale-[1.02] transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 group"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>ثبت استعلام پیش‌فاکتور (RFQ) کوره</span>
                <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
              </button>

              <a
                href="#smart-ai-workstation"
                className="h-12 sm:h-13 px-6 bg-[#414146]/90 hover:bg-[#414146] text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/25 hover:border-orange-500/70 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Bot className="w-4 h-4 text-[#E06518]" />
                <span>ورود به سامانه هوشمند مهندسی کاشی</span>
              </a>

              <a
                href="#plant-stages"
                className="h-12 sm:h-13 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>نقشه ۵ مرحله خط تولید</span>
              </a>
            </div>

          </div>

          {/* Bottom Trust Strip */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-white">همکاری با مجتمع‌های بزرگ:</span>
              <span>کاشی میبد</span>
              <span>•</span>
              <span>کاشی مرجان</span>
              <span>•</span>
              <span>کاشی الوند</span>
              <span>•</span>
              <span>کاشی پرسپولیس</span>
              <span>•</span>
              <span>کاشی تکسرام</span>
            </div>

            <div className="flex items-center gap-1.5 text-orange-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>تضمین کتبی عدم خواب کوره و خطوط تولید</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FULL-WIDTH SMART CERAMIC AI SYSTEM (خاکستری و نارنجی)                  */}
      {/* ========================================================================= */}
      <section
        id="smart-ai-workstation"
        className="relative w-full overflow-hidden bg-[#414146] text-white py-14 sm:py-20 border-b border-[#55565A] shadow-2xl"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={STORE_ASSETS.industries.bgPlant}
            alt="Plant Backdrop"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#414146]/95 via-[#414146]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#414146] via-transparent to-[#414146]/90" />
        </div>

        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E06518]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#E06518]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/15 pb-6">
            <div className="space-y-2 text-right max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black">
                <Bot className="w-4 h-4 text-[#E06518]" />
                <span>سامانه هوشمند مهندسی کوره و خطوط کاشی FORZA AI WORKSTATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                سامانه هوشمند تحلیل گرید رولر و عیب‌یابی خطوط کاشی
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                بدون نیاز به محاسبات دستی پیچیده، پارامترهای کوره یا نوع عیب را انتخاب کنید تا محاسبات تنش خمشی،
                گرید آلومینا و دستورالعمل‌های رفع عیب به صورت آنی شبیه‌سازی شود:
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#55565A]/90 border border-white/20 rounded-2xl shrink-0 self-start lg:self-auto shadow-xl">
              <button
                type="button"
                onClick={() => setAiTab('advisor')}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  aiTab === 'advisor'
                    ? 'bg-gradient-to-r from-[#C95210] to-[#E06518] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>مشاور و محاسبه‌گر رولر کوره</span>
              </button>

              <button
                type="button"
                onClick={() => setAiTab('troubleshooter')}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  aiTab === 'troubleshooter'
                    ? 'bg-gradient-to-r from-[#C95210] to-[#E06518] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>عیب‌یاب هوشمند خرابی‌های خط</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ADVISOR */}
          {aiTab === 'advisor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 space-y-4 bg-[#55565A]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#E06518]" />
                    <span>پارامترهای عملکردی کوره پخت:</span>
                  </h3>
                  <span className="text-[10px] font-mono text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/30">
                    REALTIME SIMULATION
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-200">فرمت و نوع محصول تولیدی:</label>
                  <select
                    value={aiTileType}
                    onChange={(e) => setAiTileType(e.target.value)}
                    className="w-full bg-[#414146] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:border-[#E06518] focus:outline-none"
                  >
                    <option value="porcelain_slab">اسلب سایز بزرگ و سوپر پرسلان (ابعاد ۱۲۰×۲۴۰ به بالا)</option>
                    <option value="glazed_porcelain">کاشی پرسلان لعاب‌دار سایز متوسط (۶۰×۱۲۰ و ۸۰×۱۶۰)</option>
                    <option value="wall_tile">کاشی دیواری استاندارد (مونوپروزا و دو پخت سبک)</option>
                    <option value="floor_tile">کاشی کف پرتردد و گرانیتی متراکم</option>
                  </select>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#E06518]" />
                      <span>حداکثر دمای پخت کوره:</span>
                    </label>
                    <span className="font-mono font-black text-orange-400 bg-black/40 px-3 py-1 rounded-lg border border-white/15 text-sm">
                      {toPersianDigits(aiKilnTemp)} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1050"
                    max="1350"
                    step="25"
                    value={aiKilnTemp}
                    onChange={(e) => setAiKilnTemp(Number(e.target.value))}
                    className="w-full accent-[#E06518] cursor-pointer h-2.5 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 font-mono font-bold">
                    <span>1050°C (پیش‌پخت)</span>
                    <span>1200°C (کاشی دیواری)</span>
                    <span>1350°C (پرسلان اسلب)</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white">قطر خارجی رولر (Outer Diameter):</label>
                    <span className="font-mono font-black text-orange-400 bg-black/40 px-3 py-1 rounded-lg border border-white/15 text-sm">
                      {toPersianDigits(aiRollerDiameter)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="65"
                    step="5"
                    value={aiRollerDiameter}
                    onChange={(e) => setAiRollerDiameter(Number(e.target.value))}
                    className="w-full accent-[#E06518] cursor-pointer h-2.5 bg-slate-700 rounded-lg"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white">عرض مفید کوره / طول رولر:</label>
                    <span className="font-mono font-black text-orange-400 bg-black/40 px-3 py-1 rounded-lg border border-white/15 text-sm">
                      {toPersianDigits(aiKilnWidth.toFixed(1))} متر
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.2"
                    max="3.8"
                    step="0.1"
                    value={aiKilnWidth}
                    onChange={(e) => setAiKilnWidth(Number(e.target.value))}
                    className="w-full accent-[#E06518] cursor-pointer h-2.5 bg-slate-700 rounded-lg"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white">سرعت خط کوره (m/min):</label>
                    <span className="font-mono font-black text-orange-400 bg-black/40 px-3 py-1 rounded-lg border border-white/15 text-sm">
                      {toPersianDigits(aiLineSpeed)} m/min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="1"
                    value={aiLineSpeed}
                    onChange={(e) => setAiLineSpeed(Number(e.target.value))}
                    className="w-full accent-[#E06518] cursor-pointer h-2.5 bg-slate-700 rounded-lg"
                  />
                </div>

              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#55565A]/95 backdrop-blur-xl border-2 border-[#E06518]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(224,101,24,0.35)] space-y-6 text-right">
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#E06518]/20 flex items-center justify-center border border-[#E06518]/40">
                        <Sparkles className="w-4 h-4 text-[#E06518]" />
                      </div>
                      <div>
                        <h4 className="font-black text-base text-white">نتیجه شبیه‌سازی فنی رولر FORZA</h4>
                        <span className="text-[11px] text-slate-300 font-mono">ISO 10545 & DIN EN 14411</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
                      QC APPROVED ۱۰۰٪
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#414146] border border-white/15 space-y-1">
                      <span className="text-slate-300 font-bold block">گرید پیشنهادی رولر سرامیکی:</span>
                      <div className="font-black text-orange-400 text-base">{aiAdvisorResult.grade}</div>
                      <span className="text-[10px] text-slate-400">آلومینای کلسینه با خلوص بالا</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#414146] border border-white/15 space-y-1">
                      <span className="text-slate-300 font-bold block">استحکام خمشی مدولوس (MOR):</span>
                      <div className="font-black text-emerald-400 text-base font-mono">{aiAdvisorResult.mor}</div>
                      <span className="text-[10px] text-slate-400">تحمل خمش در حداکثر بار حرارتی</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#414146] border border-white/15 space-y-1">
                      <span className="text-slate-300 font-bold block">تحمل بار دینامیکی رولر:</span>
                      <div className="font-black text-white text-base font-mono">{aiAdvisorResult.load}</div>
                      <span className="text-[10px] text-slate-400">توزیع بار یکنواخت در عرض {toPersianDigits(aiKilnWidth.toFixed(1))} متر</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#414146] border border-white/15 space-y-1">
                      <span className="text-slate-300 font-bold block">فاصله بهینه سنتر رولرها:</span>
                      <div className="font-black text-cyan-400 text-base">{aiAdvisorResult.spacing}</div>
                      <span className="text-[10px] text-slate-400">جلوگیری از شکم دادن بیسکویت کاشی</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-xs text-orange-100 leading-relaxed space-y-1">
                    <div className="font-extrabold text-orange-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#E06518]" />
                      <span>دستورالعمل مهندسی واحد نسوز و کوره صنعت‌پیش:</span>
                    </div>
                    <p>{aiAdvisorResult.notes}</p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openRfqWithItem(
                          `استعلام بر اساس شبیه‌سازی: ${aiAdvisorResult.grade} قطر ${aiRollerDiameter}mm دمای ${aiKilnTemp}°C`
                        )
                      }
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(224,101,24,0.4)] cursor-pointer active:scale-95 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ثبت استعلام پیش‌فاکتور با این نتایج</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAiKilnTemp(1200);
                        setAiRollerDiameter(50);
                        setAiTileType('porcelain_slab');
                        setAiKilnWidth(3.1);
                      }}
                      className="h-12 px-5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>تنظیم مجدد</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TROUBLESHOOTER */}
          {aiTab === 'troubleshooter' && (
            <div className="bg-[#55565A]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 text-right shadow-2xl">
              
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-orange-400">یک ایراد شایع خط تولید کاشی را جهت عیب‌یابی انتخاب کنید:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {defectDatabase.map((defect) => {
                    const isSelected = selectedDefectId === defect.id;
                    return (
                      <button
                        key={defect.id}
                        type="button"
                        onClick={() => setSelectedDefectId(defect.id)}
                        className={`p-4 rounded-2xl border text-right text-xs font-black transition-all cursor-pointer leading-snug flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#E06518] text-white border-[#E06518] shadow-[0_6px_20px_rgba(224,101,24,0.4)] scale-[1.02]'
                            : 'bg-[#414146] text-slate-200 border-white/15 hover:border-orange-400 hover:bg-[#2B313A]'
                        }`}
                      >
                        <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                        <span>{defect.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#414146] border border-white/15 space-y-2">
                  <div className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>علائم مشاهده‌شده در خط تولید:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {currentDefect.symptom}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>علت ریشه‌ای مهندسی:</span>
                  </div>
                  <p className="text-xs text-amber-100 leading-relaxed font-normal">
                    {currentDefect.rootCause}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-2">
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>دستورالعمل مهندسی رفع عیب:</span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed font-normal">
                    {currentDefect.remedy}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-right">
                  <span className="text-[11px] font-mono text-orange-400">قطعه استاندارد جایگزین از انبار مرکزی صنعت‌پیش:</span>
                  <div className="text-sm sm:text-base font-black text-white">{currentDefect.recommendedPart}</div>
                </div>

                <button
                  type="button"
                  onClick={() => openRfqWithItem(`استعلام قطعه رفع عیب: ${currentDefect.recommendedPart}`)}
                  className="h-11 px-6 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>استعلام فوری این قطعه</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FACTORY MAP: 5 STAGES                                                  */}
      {/* ========================================================================= */}
      <section id="plant-stages" className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-2 text-right max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#E06518]" />
              <span className="text-xs font-black text-[#E06518] tracking-wider uppercase font-mono">
                CERAMIC PLANT EQUIPMENT MAP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#55565A]">
              صنعت‌پیش در کجای خط تولید کاشی و سرامیک به کار می‌آید؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              روی هر یک از مراحل ۵ گانه خط تولید کلیک کنید تا متوجه شوید در هر ایستگاه چه چالش‌هایی وجود دارد و صنعت‌پیش چه تجهیزاتی را تضمین می‌کند:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {plantStages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = activeStageId === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#55565A] text-white border-[#E06518] shadow-lg scale-[1.02]'
                      : 'bg-[#F8F9FA] hover:bg-orange-50/50 text-[#55565A] border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-black ${isSelected ? 'text-orange-400' : 'text-slate-400'}`}>
                      {stage.stageNumber}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#E06518] text-white' : 'bg-slate-200 text-slate-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black leading-snug">{stage.title}</h3>
                    <p className={`text-[10px] font-mono mt-0.5 truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      {stage.englishTitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {(() => {
            const activeStage = plantStages.find((s) => s.id === activeStageId) || plantStages[2];
            const StageIcon = activeStage.icon;
            return (
              <div className="rounded-3xl border border-slate-200 bg-[#FDFDFD] p-6 sm:p-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  <div className="lg:col-span-7 space-y-4 text-right">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E06518] flex items-center justify-center shrink-0">
                        <StageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[#E06518]">{activeStage.stageNumber} / ۰۵</div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#55565A]">{activeStage.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {activeStage.description}
                    </p>

                    <div className="space-y-3 pt-1">
                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-right space-y-1">
                        <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>چالش و ریسک کارخانه در این ایستگاه:</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {activeStage.criticalChallenge}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-right space-y-1">
                        <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>راهکار مهندسی و تضمینی صنعت‌پیش:</span>
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          {activeStage.sanatPishSolution}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-black text-[#55565A]">قطعات استراتژیک قابل سفارش در این بخش:</div>
                      <div className="flex flex-wrap gap-2">
                        {activeStage.criticalParts.map((part, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => openRfqWithItem(`استعلام ${part}`)}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-[#E06518] text-xs font-bold text-slate-800 hover:text-[#E06518] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span>{part}</span>
                            <ArrowLeft className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => openRfqWithItem(`استعلام قطعات ایستگاه ${activeStage.title}`)}
                        className="h-11 px-6 bg-[#55565A] hover:bg-[#E06518] text-white text-xs font-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-orange-400" />
                        <span>استعلام قیمت قطعات این ایستگاه</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 relative h-72 sm:h-80 shadow-md group">
                      <img
                        src={activeStage.image}
                        alt={activeStage.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-4 inset-x-4 text-white text-right space-y-1">
                        <div className="text-xs font-extrabold text-orange-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#E06518]" />
                          <span>تحویل همراه با برگه کنترل کیفیت مهندسی (QC)</span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          استاندارد کارخانجات پیشرو در شهرک‌های صنعتی میبد و یزد
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FILTERABLE CERAMIC PRODUCT CATALOG                                    */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#F8F9FA] border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 text-right">
              <h2 className="text-2xl sm:text-3xl font-black text-[#55565A]">
                کاتالوگ تخصصی قطعات خطوط کاشی و سرامیک
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                تمامی قطعات با تضمین اصالت، استاندارد ISO و صدور فاکتور رسمی عرضه می‌شوند.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="جستجوی نام قطعه، کد فنی یا کاربرد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 focus:border-[#E06518] focus:outline-none font-medium placeholder-slate-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'همه قطعات' },
                { id: 'kiln', label: 'کوره پخت رولری' },
                { id: 'glaze', label: 'خط لعاب و چاپ' },
                { id: 'press', label: 'پرس هیدرولیک' },
                { id: 'sorting', label: 'گونیا و سورت' },
                { id: 'milling', label: 'اسپری درایر و مواد' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#55565A] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#E06518] rounded cursor-pointer"
              />
              <span>فقط موجودی آماده تحویل انبار میبد</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#E06518] p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between text-right group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] bg-[#DEE2E5] rounded-xl border border-[#CBD2D8] p-2 overflow-hidden flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {prod.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-[#55565A]/90 text-orange-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md backdrop-blur-md">
                        {prod.badge}
                      </span>
                    )}

                    <span className="absolute bottom-2.5 right-2.5 bg-[#E06518] text-white font-mono text-[10px] font-black px-2 py-0.5 rounded">
                      {prod.tempRating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>کد فنی: {prod.code}</span>
                    <span className="text-emerald-600 font-sans font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      موجود در انبار میبد
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-[#55565A] leading-snug group-hover:text-[#E06518] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                      {prod.subTitle}
                    </p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                    {prod.keySpecs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{spec.label}:</span>
                        <span className="font-bold text-slate-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openRfqWithItem(prod.name)}
                    className="w-full h-11 rounded-xl bg-slate-100 hover:bg-[#E06518] text-slate-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/btn"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>درخواست استعلام قیمت و مشخصات</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-black text-slate-700">هیچ قطعه‌ای مطابق با عبارت واردشده پیدا نشد</h4>
              <p className="text-xs text-slate-500">
                می‌توانید فیلتر جستجو را پاک کنید یا برای استعلام ساخت سفارشی با ما تماس بگیرید.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY SANATPISH (درباره ما، مجوزها، اصالت و آدرس کارخانه میبد)           */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#E06518] text-xs font-bold border border-orange-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>هویت سازمانی و اصالت زنجیره تأمین</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#55565A]">
                چرا کارخانجات کاشی و سرامیک به صنعت‌پیش اعتماد می‌کنند؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                مزایای انحصاری همکاری صنعتی، آزمون‌های QC، دپوی شبانه‌روزی میبد، فاکتور رسمی و گواهینامه‌های معتبر بین‌المللی:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to="/about"
                className="h-10 px-4 bg-[#55565A] hover:bg-[#2B313A] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 text-orange-400" />
                <span>درباره و تاریخچه شرکت</span>
              </Link>
              <Link
                to="/contact?tab=factory"
                className="h-10 px-4 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>آدرس انبار مرکزی میبد</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1 */}
            <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-[#E06518] space-y-3 text-right shadow-2xs transition-all flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#E06518] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Thermometer className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-[#55565A] group-hover:text-[#E06518] transition-colors">
                  آزمون کوارتر و شوک حرارتی
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  تمامی رولرهای کوره تحت آزمون سنجش خمش و مقاومت شوک حرارتی قرار می‌گیرند تا خطر تابیدگی در دمای بالا به صفر برسد.
                </p>
              </div>
              <Link
                to="/about?tab=licenses"
                className="pt-2 border-t border-slate-200 text-xs font-bold text-[#E06518] hover:underline flex items-center justify-between"
              >
                <span>مشاهده سرتیفیکیت‌ها و QC</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CARD 2 */}
            <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-[#E06518] space-y-3 text-right shadow-2xs transition-all flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Warehouse className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-[#55565A] group-hover:text-[#E06518] transition-colors">
                  دپوی ۲۴ ساعته انبار میبد
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  با داشتن انبار استراتژیک در قطب کاشی کشور (جاده سنتو)، تحویل قطعات پرمصرف در کمتر از ۲ ساعت در محل کارخانه انجام می‌پذیرد.
                </p>
              </div>
              <Link
                to="/contact?tab=factory"
                className="pt-2 border-t border-slate-200 text-xs font-bold text-[#E06518] hover:underline flex items-center justify-between"
              >
                <span>مسیریابی انبار میبد</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CARD 3 */}
            <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-[#E06518] space-y-3 text-right shadow-2xs transition-all flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-[#55565A] group-hover:text-[#E06518] transition-colors">
                  تندیس زرین تأمین‌کننده برتر
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  افتخار همکاری با کارخانجات بزرگ کاشی میبد، مرجان، الوند و تکسرام همراه با تندیس ملی کیفیت و تقدیرنامه رضایت صنعتی.
                </p>
              </div>
              <Link
                to="/about?tab=awards"
                className="pt-2 border-t border-slate-200 text-xs font-bold text-[#E06518] hover:underline flex items-center justify-between"
              >
                <span>مشاهده افتخارات و تندیس‌ها</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CARD 4 */}
            <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-[#E06518] space-y-3 text-right shadow-2xs transition-all flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-[#55565A] group-hover:text-[#E06518] transition-colors">
                  فاکتور رسمی و کد اقتصادی
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  فروش مستقیم با سرتیفیکیت معتبر سازنده، ارزش افزوده قانونی و کد اقتصادی معتبر جهت ثبت بی‌دردسر در امور مالی کارخانجات.
                </p>
              </div>
              <Link
                to="/about?tab=licenses"
                className="pt-2 border-t border-slate-200 text-xs font-bold text-[#E06518] hover:underline flex items-center justify-between"
              >
                <span>استعلام کد اقتصادی و شناسه ملی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAST CONTACT & PROCUREMENT CTA BANNER                                  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#55565A] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3.5 text-right">
              <div className="text-xs font-bold text-orange-400">واحد مهندسی و تدارکات کاشی و سرامیک صنعت‌پیش</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                نیاز فوری به استعلام قیمت یا اعزام کارشناس فنی دارید؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed max-w-2xl">
                کارشناسان فنی صنعت‌پیش در شهرک‌های صنعتی میبد و یزد آماده ارائه مشاوره حضوری، اندازه‌گیری در محل کارخانه و صدور پیش‌فاکتور رسمی هستند.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="tel:03538739900"
                  className="h-11 px-6 bg-[#E06518] hover:bg-[#C95210] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  dir="ltr"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span className="font-mono">۰۳۵-۳۸۷۳۹۹۰۰</span>
                </a>

                <a
                  href="https://wa.me/989120000000"
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ارسال لیست اقلام در واتساپ</span>
                </a>

                <button
                  type="button"
                  onClick={() => openRfqWithItem('استعلام فوری سبد خرید کارخانه')}
                  className="h-11 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span>تکمیل فرم درخواست پیش‌فاکتور</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-right space-y-2 text-xs text-slate-200">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                ساعات پاسخگویی واحد کاشی و سرامیک:
              </div>
              <p>شنبه تا چهارشنبه: ۸:۰۰ الی ۱۸:۰۰</p>
              <p>پشتیبانی اضطراری شبانه‌روزی برای خطوط متوقف</p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                دفتر مرکزی یزد: منطقه صنعتی ته‌بندی، مجاور شهرک جهان‌آباد میبد
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAST RFQ MODAL / DIALOG                                                */}
      {/* ========================================================================= */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-right shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E06518]" />
                <h3 className="font-black text-base text-[#55565A]">درخواست استعلام قیمت (RFQ) کاشی</h3>
              </div>
              <button
                type="button"
                onClick={() => setRfqModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {rfqSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">استعلام شما با موفقیت ثبت شد</h4>
                <p className="text-xs text-emerald-700">
                  کارشناس فنی بخش کاشی و سرامیک ظرف کمتر از ۳۰ دقیقه با شماره {toPersianDigits(rfqPhone)} تماس خواهد گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">قطعه یا موضوع استعلام:</label>
                  <input
                    type="text"
                    value={rfqItem}
                    onChange={(e) => setRfqItem(e.target.value)}
                    required
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:border-[#E06518] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی / سمت:</label>
                    <input
                      type="text"
                      placeholder="مثلاً: مهندس رضایی"
                      value={rfqName}
                      onChange={(e) => setRfqName(e.target.value)}
                      required
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#E06518] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">شماره تماس همراه:</label>
                    <input
                      type="tel"
                      placeholder="۰۹۱۲..."
                      value={rfqPhone}
                      onChange={(e) => setRfqPhone(e.target.value)}
                      required
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:border-[#E06518] focus:outline-none text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام کارخانه کاشی و شهر:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: صنایع کاشی میبد - استان یزد"
                    value={rfqPlantName}
                    onChange={(e) => setRfqPlantName(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#E06518] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات تکمیلی یا ابعاد (اختیاری):</label>
                  <textarea
                    rows={2}
                    placeholder="مثلاً: تعداد ۵۰۰ شاخه رولر قطر ۵۰ میلی‌متر طول ۳ متر"
                    value={rfqNote}
                    onChange={(e) => setRfqNote(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#E06518] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRfqModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارسال درخواست پیش‌فاکتور</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MOBILE STICKY QUICK ACTION BAR                                         */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-xl">
        <button
          type="button"
          onClick={() => openRfqWithItem('استعلام سریع پیش‌فاکتور کاشی')}
          className="flex-1 h-11 px-3 bg-[#E06518] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>استعلام سریع قیمت (RFQ)</span>
        </button>

        <a
          href="tel:03538739900"
          className="h-11 px-3.5 bg-[#55565A] text-white text-xs font-bold rounded-xl flex items-center gap-1 active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
          <span>تماس</span>
        </a>

        <a
          href="https://wa.me/989120000000"
          target="_blank"
          rel="noreferrer"
          className="h-11 px-3.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>واتساپ</span>
        </a>
      </div>

    </div>
  );
};

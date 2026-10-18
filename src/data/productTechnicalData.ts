import type { Product, ProductVariant, TechnicalSpec } from '../types';

export const TECHNICAL_REFERENCES = {
  wedge: { title: 'Optibelt — Wedge belt profiles', url: 'https://www.optibelt.com/fileadmin/pdf/kataloge/Optibelt-Power-Transmission-product-range-belts.pdf' },
  ribbed: { title: 'Optibelt — Ribbed belt drives', url: 'https://www.optibelt.com/fileadmin/extranet/power_transmission/technische_Unterlagen/OPTIBELT-TM-Ribbed-Belt-Drives.pdf' },
  timing: { title: 'Optibelt — ALPHA LINEAR', url: 'https://www.optibelt.com/fileadmin/pdf/produkte/zahnriemen-pu/optibelt-ALPHA-LINEAR-Product-range.pdf' },
  chain: { title: 'Renold — Transmission chains', url: 'https://tr.renold.com/media/165422/transmission-ren1-de-07-10.pdf' },
  bearing: { title: 'SKF — Bearing designation system', url: 'https://www.skf.com/binaries/pub12/Images/0901d196802809de-Rolling-bearings---17000_1-EN_tcm_12-121486.pdf' },
} as const;
type Reference = keyof typeof TECHNICAL_REFERENCES;
export interface TechnicalReview {
  status: 'reference-enriched' | 'catalog-extracted' | 'needs-identification';
  categoryPath: string[];
  technicalCode?: string;
  evidence: { key: string; basis: 'catalog' | 'profile-reference' | 'admin'; source?: Reference }[];
  references: { title: string; url: string }[];
  missing: string[];
  note: string;
}
const normalize = (s: string) => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\u200c/g, ' ').toUpperCase();
const wedge: Record<string, [number, number]> = { SPZ: [9.7,8], SPA:[12.7,10], SPB:[16.3,13], SPC:[22,18] };
const ribPitch: Record<string, number> = { PH:1.6, PJ:2.34, PK:3.56, PL:4.7, PM:9.4 };
const timingPitch: Record<string, number> = { T5:5,T10:10,T20:20,AT5:5,AT10:10,AT20:20 };
const chainPitch: Record<string, number> = { '04B':6,'05B':8,'06B':9.525,'08B':12.7,'10B':15.875,'12B':19.05,'16B':25.4,'20B':31.75,'24B':38.1 };

/** Read the actual SKU inscription, never the warehouse SKU as a manufacturer code.
 * Reference dimensions describe a profile, not a certified manufacturer datasheet.
 */
export function enrichTechnicalVariant(product: Product, variant: ProductVariant): ProductVariant {
  const name = normalize(variant.name);
  const rawSize = normalize(variant.size || '');
  const specs: TechnicalSpec[] = [];
  const evidence: TechnicalReview['evidence'] = [];
  const refs = new Set<Reference>();
  let model: string | undefined;
  let technicalCode: string | undefined;
  let type = product.subcategory;
  const add = (key: string, value: string, source?: Reference) => {
    specs.push({key,value});
    evidence.push({key,basis:source ? 'profile-reference' : 'catalog',...(source ? {source} : {})});
    if (source) refs.add(source);
  };
  if (/^(?:تسمه|شیاری)/.test(name) || product.categoryName === 'تسمه و انتقال نیرو') {
    const narrow = (name.match(/\b(SP[ZABC]|XP[ZABC])\s*[-/]?\s*(\d+(?:\.\d+)?)\b/) || rawSize.match(/\b(SP[ZABC]|XP[ZABC])\s*(\d+(?:\.\d+)?)\b/));
    const rib = name.match(/\b(?:(\d+)\s*)?(PH|PJ|PK|PL|PM)\s*[-/]?\s*(\d{3,5})\b/);
    const timing = name.match(/(?:^|[^A-Z])(AT20|AT10|AT5|T20|T10|T5|14M|8M|5M|3M)(?![A-Z0-9])/);
    const classic = name.match(/\b(AX|BX|CX|Z|A|B|C|D|E)\s*[-/]?\s*(\d+(?:\.\d+)?)\b/);
    if (narrow) {
      model = narrow[1]; technicalCode = `${model} ${narrow[2]}`;
      type = model.startsWith('XP') ? 'تسمه V شکل باریک دندانه‌دار' : 'تسمه V شکل باریک';
      add('پروفیل', model);
      add('طول درج‌شده در کد', `${narrow[2]} میلی‌متر`);
      if (wedge[model]) {
        add('عرض اسمی بالای پروفیل (مرجع)', `${wedge[model][0]} میلی‌متر`, 'wedge');
        add('ارتفاع اسمی پروفیل (مرجع)', `${wedge[model][1]} میلی‌متر`, 'wedge');
        add('مبنای طول پروفیل (مرجع)', 'طول مبنا Ld؛ تطبیق با دیتاشیت سازنده', 'wedge');
        add('استاندارد مرجع پروفیل', 'DIN 7753-1 / ISO 4184؛ گواهی این کالا تأیید نشده', 'wedge');
      }
    } else if (rib) {
      model = rib[2]; technicalCode = `${rib[1] || ''}${model} ${rib[3]}`;
      type = 'تسمه چندشیاری'; add('پروفیل',model);
      if(rib[1]) add('تعداد شیار درج‌شده',rib[1]);
      add('طول درج‌شده در کد',`${rib[3]} میلی‌متر`);
      add('گام شیار پروفیل (مرجع)',`${ribPitch[model]} میلی‌متر`,'ribbed');
    } else if (timing) {
      model = timing[1]; type = 'تسمه تایمینگ'; add('پروفیل',model);
      // Do not infer rounded tooth geometry from pitch alone (e.g. HTD vs GT).
      if (timingPitch[model]) add('گام دندانه پروفیل (مرجع)',`${timingPitch[model]} میلی‌متر`,'timing');
    } else if (classic) {
      model = classic[1]; technicalCode = `${model} ${classic[2]}`;
      type = /X/.test(model) ? 'تسمه V شکل کلاسیک دندانه‌دار' : 'تسمه V شکل کلاسیک';
      add('پروفیل',model); add('عدد طول درج‌شده (بدون تبدیل واحد)',classic[2]);
    }
  } else if (/^بلبرینگ/.test(name)) {
    const bearing = name.match(/\b(6\d{2,3})(?:\s*[-/]?\s*(ZZ|2RSZ|2RS|2Z|RS|Z))?(?!\d)/);
    if(bearing) { model = bearing[1]; technicalCode = bearing[0].replace(/\s+/g,''); add('مدل پایه',model);
      if(bearing[2]) add('پسوند درج‌شده',bearing[2]);
      // Only the explicit standard bore-code range; special bores are not inferred.
      if(model.length === 4 && !name.includes('/')) {
        const code = Number(model.slice(-2));
        if(code <= 3 || (code >= 4 && code <= 96)) add('قطر سوراخ اسمی از کد پایه (مرجع)',`${code <= 3 ? [10,12,15,17][code] : code * 5} میلی‌متر`,'bearing');
      }
    }
  } else if (/زنجیر/.test(name)) {
    const chain = name.match(/\b(04B|05B|06B|08B|10B|12B|16B|20B|24B)(?:[- ]([123]))?\b/);
    if(chain) { model=chain[1]; technicalCode=chain[0]; add('سری زنجیر',model);
      add('گام اسمی زنجیر (مرجع)',`${chainPitch[model]} میلی‌متر`,'chain');
      const rows = chain[2] || (/سه\s*(?:ردیفه|قلو)/.test(name) ? '3' : /دوبل|دو\s*قلو/.test(name) ? '2' : undefined);
      if(rows) add('تعداد ردیف درج‌شده',rows);
    }
  }
  // Physical descriptions are copied as written; colloquial names are not
  // converted into unverified polymer grades (e.g. تفلون is not proof of PTFE).
  const material = name.match(/سیلیکون(?:ی)?|پلی\s*یورتان|پلی\s*اورتان|پلی\s*آمید|تفلون(?:ی)?|لاستیک(?:ی)?|آلومینیوم(?:ی)?|فولاد(?:ی)?|استیل|چدن(?:ی)?|برنج(?:ی)?|پلاستیک(?:ی)?|PTFE|NBR|EPDM/);
  if(material) add('جنس توصیف‌شده در کاتالوگ',material[0]);
  const color = name.match(/قرمز|سبز|مشکی|سفید|زرد|آبی|طوسی|شفاف|نارنجی|قهوه\s*ای/);
  if(color) add('رنگ درج‌شده',color[0]);
  const construction = name.match(/مدار\s*بسته|متری|آستین|جوشی|روکش\s*دار|سیم\s*دار/);
  if(construction) add('ساختار درج‌شده',construction[0]);
  // Other catalog items: preserve explicitly labelled models and dimensions only.
  for (const [label,key] of [['قطر','قطر درج‌شده'],['عرض','عرض درج‌شده'],['ارتفاع','ارتفاع درج‌شده'],['ضخامت','ضخامت درج‌شده'],['طول','طول درج‌شده']] as const) {
    const match = name.match(new RegExp(`${label}\\s*(\\d+(?:[./]\\d+)?)\\s*(میلیمتر|میلی متر|سانتیمتر|سانتی متر|اینچ)?`));
    if(match) add(key,`${match[1]}${match[2] ? ' '+match[2] : ' (واحد در منبع مشخص نیست)'}`);
  }
  const explicitModel = name.match(/(?:مدل|MODEL)\s*[:：-]?\s*([A-Z0-9][A-Z0-9./-]*)/);
  if(!model && explicitModel) model=explicitModel[1];
  if(technicalCode) add('کد فنی خوانده‌شده از شرح کالا',technicalCode);
  add('نوع قطعه',type);
  const missing = ['دیتاشیت همان سازنده / تطبیق با پلاک کالا'];
  if(!model && !variant.model) missing.push('مدل فنی قابل‌تأیید');
  missing.push('کد کامل و پسوندهای سفارش سازنده');
  if(!product.brand || product.brand === 'ثبت نشده') missing.push('سازنده');
  const review: TechnicalReview = {
    status:refs.size ? 'reference-enriched' : model || technicalCode ? 'catalog-extracted' : 'needs-identification',
    categoryPath:[product.categoryName, product.submenu || product.subcategory, type, ...(model ? [model] : [])],
    technicalCode, evidence:evidence.map(e => variant.technicalSpecs?.some(s => s.key === e.key && s.value !== specs.find(x=>x.key === e.key)?.value) ? {key:e.key,basis:'admin' as const} : e), references:[...refs].map(key=>TECHNICAL_REFERENCES[key]), missing,
    note:'اطلاعات خوانده‌شده از شرح کاتالوگ و ابعاد اسمی مرجع؛ انطباق کالای واقعی و مشخصات اختصاصی سازنده نیازمند دیتاشیت است.',
  };
  // Manually entered specifications take precedence over automatic extraction.
  const manual = variant.technicalSpecs || [];
  return {...variant, model:variant.model || model, technicalReview:review,
    technicalSpecs:[...specs.filter(s => !manual.some(m => m.key === s.key)),...manual]};
}
export function enrichProductTechnicalData(product: Product): Product {
  return {...product,variants:product.variants?.map(v=>enrichTechnicalVariant(product,v))};
}

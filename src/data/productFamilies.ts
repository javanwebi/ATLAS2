import type { Product } from '../types';

const normalize = (value = '') => value.toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\s\u200c]+/g, ' ').trim();

// Only combine technically compatible records. Unknown/generic names stay separate.
export function groupProductFamilies(products: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    let name = normalize(product.name);
    if (/^بلبرینگ\s+(?:\d+\s*)?zz$/.test(name)) name = 'بلبرینگ zz';
    const ambiguous = /^(مدل یا نام تجاری بدون نوع کالا|دستگاه صنعتی|قطعات کوره|تسمه خارجی|بلبرینگ)$/.test(name);
    const materials = product.technicalSpecs.find(s => s.key === 'جنس‌های ثبت‌شده')?.value || '';
    const key = JSON.stringify([product.categorySlug, normalize(product.submenu), normalize(product.subcategory), name, normalize(product.brand), normalize(materials), product.unit, product.active !== false, ambiguous ? product.code : '']);
    const group = groups.get(key) || [];
    group.push(product);
    groups.set(key, group);
  }
  return [...groups.values()].map(group => {
    if (group.length === 1) return group[0];
    const canonical = group.find(p => normalize(p.name) === 'بلبرینگ zz') || group[0];
    const variants = group.flatMap(p => p.variants || []);
    // Family illustrations are not exact SKU photographs: retain that distinction.
    const images = [...new Set(group.flatMap(p => p.images || []))];
    return { ...canonical, variants, images,
      galleryImages: group.flatMap(p => p.galleryImages || []),
      imageScope: images.length ? 'family-example' as const : undefined,
      technicalSpecs: canonical.technicalSpecs.map(s => s.key === 'تعداد کد کالا' ? { ...s, value: String(variants.length) } : s),
      description: `${canonical.name}؛ ${variants.length.toLocaleString('fa-IR')} کد کالا. سایز و کد دقیق را از فهرست این خانواده انتخاب کنید.`,
    };
  });
}

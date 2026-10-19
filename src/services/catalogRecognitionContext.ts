import type {Product} from '../types';
import type {CatalogImageRecord} from './catalogImageCorpus';
const normalized=(value:unknown)=>String(value || '').normalize('NFKC').replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g,' ').trim();
export function catalogRecognitionContext(products:Product[],observation:any){
 const byFamily=new Map(products.filter(p=>p.active!==false).map(p=>[p.code,p]));
 const read=Number(observation?.code_read_confidence)>=85 ? normalized(observation?.detected_code_on_part) : '';
 const family=normalized(observation?.part_family_farsi);
 const sameText=(text:unknown)=>{const n=normalized(text);return Boolean(read && read.length>=3 && (' '+n+' ').includes(' '+read+' '));};
 const evidenceFamilies=new Set(products.filter(p=>p.active!==false && (
  sameText(p.code)||sameText(p.name)||(p.variants || []).some(v=>v.active!==false&&(sameText(v.code)||sameText(v.name)||sameText(v.model))) ||
  (family.length>=4 && normalized(p.name).includes(family))
 )).map(p=>p.code));
 return {
  supplement:(images:CatalogImageRecord[])=>images.filter(row=>row.bindings.some(binding=>evidenceFamilies.has(binding.familyCode))).slice(0,24),
  describe:(row:CatalogImageRecord,detail:'coarse'|'fine'='fine')=>[...new Set(row.bindings.map(b=>b.familyCode))].slice(0,3).flatMap(code=>{
   const p=byFamily.get(code);if(!p)return [];
   const variants=(p.variants || []).filter(v=>v.active!==false).sort((a,b)=>Number(sameText(b.code)||sameText(b.name))-Number(sameText(a.code)||sameText(a.name)));
   return [{family:p.name,category:p.categoryName,type:p.subcategory,specifications:(p.technicalSpecs || []).slice(0,detail==='coarse'?4:12),
    variants:variants.slice(0,detail==='coarse'?1:8).map(v=>({code:v.code,name:v.name,model:v.model,size:v.size,specifications:v.technicalSpecs}))}];
  }),
  familyNames:(row:CatalogImageRecord)=>[...new Set(row.bindings.map(b=>byFamily.get(b.familyCode)?.name).filter((name):name is string=>Boolean(name)))]
 };
}

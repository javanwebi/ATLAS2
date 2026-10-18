import test from 'node:test';
import assert from 'node:assert/strict';
import { USER_PRODUCTS, USER_PRODUCTS_RAW } from '../src/data/userProducts';
import { enrichTechnicalVariant } from '../src/data/productTechnicalData';
const belt = USER_PRODUCTS_RAW.find(p=>p.subcategory === 'تسمه پروفیل باریک')!;
const spec = (v: ReturnType<typeof enrichTechnicalVariant>, key: string) => v.technicalSpecs?.find(s=>s.key===key)?.value;
test('SPA designation yields reference cross section without invented inside/outside lengths', () => {
  const v = enrichTechnicalVariant(belt,{code:'warehouse-1',name:'تسمه SPA 1250',size:'SPA1250'});
  assert.equal(v.model,'SPA');
  assert.equal(v.technicalReview?.technicalCode,'SPA 1250');
  assert.equal(spec(v,'عرض اسمی بالای پروفیل (مرجع)'),'12.7 میلی‌متر');
  assert.equal(spec(v,'ارتفاع اسمی پروفیل (مرجع)'),'10 میلی‌متر');
  assert.ok(!v.technicalSpecs?.some(s=>/طول داخلی|طول خارجی/.test(s.key)));
  assert.ok(v.technicalReview?.references.length);
});
test('ribbed belts preserve profile, rib count and recorded length',()=>{
  const v=enrichTechnicalVariant(belt,{code:'x',name:'تسمه شیاری 6PK1268',size:''});
  assert.equal(v.model,'PK');
  assert.equal(spec(v,'تعداد شیار درج‌شده'),'6');
  assert.equal(spec(v,'گام شیار پروفیل (مرجع)'),'3.56 میلی‌متر');
});
test('every SKU has a review and original commercial data is untouched',()=>{
  const original=new Map(USER_PRODUCTS_RAW.flatMap(p=>(p.variants||[]).map(v=>[v.code,v] as const)));
  for(const p of USER_PRODUCTS)for(const v of p.variants||[]){
    assert.ok(v.technicalReview?.categoryPath.length);
    assert.equal(v.name,original.get(v.code)?.name);
    assert.equal(v.size,original.get(v.code)?.size);
    assert.equal(v.price,original.get(v.code)?.price);
  }
});
test('unknown warehouse SKU is never fabricated into a manufacturer model',()=>{
  const p={...belt,categoryName:'قطعات تولید و قالب',subcategory:'قطعه صنعتی'};
  const v=enrichTechnicalVariant(p,{code:'6202',name:'قطعه صنعتی',size:'نامشخص'});
  assert.equal(v.model,undefined);
  assert.equal(v.technicalReview?.technicalCode,undefined);
  assert.equal(v.technicalReview?.status,'needs-identification');
});
test('manual values win and unitless source dimensions stay unitless',()=>{
  const v=enrichTechnicalVariant(belt,{code:'x',name:'تسمه SPA1250 قطر40',size:'',technicalSpecs:[{key:'ارتفاع اسمی پروفیل (مرجع)',value:'اندازه‌گیری شود'}]});
  assert.equal(spec(v,'ارتفاع اسمی پروفیل (مرجع)'),'اندازه‌گیری شود');
  assert.equal(spec(v,'قطر درج‌شده'),'40 (واحد در منبع مشخص نیست)');
  assert.equal(v.technicalReview?.evidence.find(e=>e.key==='ارتفاع اسمی پروفیل (مرجع)')?.basis,'admin');
});

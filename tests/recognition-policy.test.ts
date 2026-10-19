import test from 'node:test';
import assert from 'node:assert/strict';
import { recognitionWorkerUrl, recognitionApiKey, recognitionCatalog, finalizeRecognition } from '../src/utils/recognitionPolicy';
import { workerVision } from '../src/services/partRecognitionGateway';
import { getManagedCatalogProducts } from '../src/data/mockGenerator';
import inventorySource from '../src/data/catalogueSource.json';
import type { Product } from '../src/types';

test('worker is default, explicit empty disables it, and direct key aliases remain server-side',()=>{
 assert.equal(recognitionWorkerUrl({}),'https://atlas-aishenasaei.javanwebio.workers.dev');
 assert.equal(recognitionWorkerUrl({PART_RECOGNITION_WORKER_URL:'  '}),'');
 assert.throws(()=>recognitionWorkerUrl({PART_RECOGNITION_WORKER_URL:'http://example.com'}));
 assert.throws(()=>recognitionWorkerUrl({PART_RECOGNITION_WORKER_URL:'https://example.com/path'}));
 assert.equal(recognitionApiKey({'ai-forza':'secret',GEMINI_API_KEY:'other'}),'secret');
 assert.equal(recognitionApiKey({AI_FORZA_API_KEY:'alias'}),'alias');
 assert.equal(recognitionApiKey({'ai-forza':'',GEMINI_API_KEY:'MY_GEMINI_API_KEY'}),undefined);
});
const products: Product[]=[{code:'family',name:'قطعه',brand:'ATLAS',categorySlug:'parts',categoryName:'قطعات',subcategory:'قطعه',technicalSpecs:[],prices:{base:0,retail:0,wholesale:0,dealer:0},stock:0,inquiryOnly:true,tags:[],unit:'عدد',images:['family.png'],variants:[
 {code:'123',name:'قطعه ۱',size:'10',images:[],technicalSpecs:[{key:'سایز',value:'10'}]},
 {code:'124',name:'قطعه ۲',size:'20',images:[],technicalSpecs:[{key:'سایز',value:'20'}]},
] }];
test('real inventory is indexed, never legacy AT-E identifiers or fabricated images',()=>{
 const catalog=recognitionCatalog(getManagedCatalogProducts(),new Set(inventorySource.flatMap(p=>p.variants.map(v=>v.code))));
 assert.equal(catalog.length,10435);
 assert.ok(!catalog.some(c=>/^AT-E/.test(c.code)));
 assert.equal(recognitionCatalog(products)[0].imageScope,'family');
});
test('same family photo and 100-percent model confidence cannot certify a warehouse SKU',()=>{
 const result=finalizeRecognition({summary:{confidence:100},matchedProducts:[{code:'123',visualVerdict:'exact_match',similarityScore:100,visualDistance:0}],similarCandidates:[{code:'INVENTED'}]},recognitionCatalog(products));
 assert.equal(result.matchedProducts.length,0);
 assert.equal(result.similarCandidates.length,1);
 assert.equal(result.summary.exactVisualMatch,false);
 assert.equal(result.summary.catalogAvailability.status,'similar_in_catalog');
 assert.equal(result.similarCandidates[0].specs[0].value,'10');
});
test('read existing code retains exact hit and still presents real family alternatives',()=>{
 const result=finalizeRecognition({summary:{},matchedProducts:[{code:'123'}]},recognitionCatalog(products),{detected_code_on_part:'۱۲۳',code_read_confidence:95});
 assert.equal(result.matchedProducts[0].code,'123');
 assert.equal(result.similarCandidates[0].code,'124');
 assert.equal(result.similarCandidates[0].specs[0].value,'20');
});
test('a dedicated but shared photo cannot uniquely certify two codes; unavailable AI is explicit',()=>{
 const copy=structuredClone(products);copy[0].variants!.forEach(v=>v.images=['shared.png']);
 const result=finalizeRecognition({summary:{},matchedProducts:[{code:'123',visualDistance:0}]},recognitionCatalog(copy),{},false);
 assert.equal(result.matchedProducts.length,0);assert.equal(result.isAiGenerated,false);
});
test('worker multimodal transport sends images and prompt, never direct keys or invented authentication',async()=>{
 let sent:any;
 const answer=await workerVision([{role:'user',parts:[{text:'inspect'},{inlineData:{mimeType:'image/png',data:'YWJj'}}]}],{
  env:{'ai-forza':'PRIVATE-KEY',GEMINI_API_KEY:'OTHER-PRIVATE'},
  fetch:(async(url,options)=>{sent={url,...options};return new Response(JSON.stringify({choices:[{message:{content:'{"detected_part_type":"فنر"}'}}]}),{status:200});}) as typeof fetch,
 });
 assert.ok(answer.text.includes('فنر'));
 assert.ok(!JSON.stringify(sent).includes('PRIVATE'));
 assert.equal(sent.headers.Authorization,undefined);
 assert.ok(sent.body.includes('data:image/png;base64,YWJj'));
});
test('worker malformed reply and HTTP failure are not successful recognition',async()=>{
 for (const response of [new Response('bad',{status:502}),new Response('{"success":true}',{status:200})])
  await assert.rejects(()=>workerVision([],{env:{},fetch:(async()=>response) as typeof fetch}));
});

test('only an explicitly reviewed dedicated photo can support image identity',()=>{
 const copy=structuredClone(products);
 copy[0].galleryImages=[{id:'a',url:'a.png',scope:'variant',variantCode:'123',identityVerified:true}];
 const result=finalizeRecognition({summary:{},matchedProducts:[{code:'123',visualDistance:0}]},recognitionCatalog(copy));
 assert.equal(result.matchedProducts[0].identityEvidence,'dedicated-catalogue-photo');
 assert.equal(result.similarCandidates[0].code,'124');
 copy[0].galleryImages[0].identityVerified=false;
 assert.equal(finalizeRecognition({summary:{},matchedProducts:[{code:'123',visualDistance:0}]},recognitionCatalog(copy)).matchedProducts.length,0);
});

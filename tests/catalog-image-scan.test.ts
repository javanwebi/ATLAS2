import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { buildCatalogImageCorpus,officialImageFile,corpusFingerprint } from '../src/services/catalogImageCorpus';
import { scanEveryCatalogImage } from '../src/services/exhaustiveImageScan';
import { RecognitionJobs } from '../src/services/recognitionJobs';
import type { Product } from '../src/types';

const photo=()=>sharp({create:{width:64,height:64,channels:3,background:'#f46b20'}}).png().toBuffer();
test('corpus contains all 869 unbound official images and every admin variant photo, without guessing numbered uploads',()=>{
 const product={code:'f',name:'parts',images:[],variants:[{code:'real',name:'real',images:['https://example.org/new2026.jpg','data:image/png;base64,YQ==']}],galleryImages:[{id:'g',url:'https://example.org/new2026.jpg',scope:'variant',variantCode:'real',identityVerified:true}]} as unknown as Product;
 const corpus=buildCatalogImageCorpus([product],'revision1');assert.equal(corpus.length,871);
 assert.equal(corpus[868].id,'e(869).png');
 const newer=corpus.find(p=>p.url==='https://example.org/new2026.jpg')!;assert.equal(newer.bindings[0].code,'real');assert.equal(newer.bindings[0].verified,true);
 assert.equal(officialImageFile('https://example.org/new2026.jpg'),undefined);
 assert.equal(officialImageFile('https://other.example/e(1).png'),undefined);
 assert.equal(officialImageFile('https://cdn.jsdelivr.net/gh/javanweb/imagesatlas@main/e(001).png'),'e(1).png');
 assert.notEqual(corpusFingerprint(corpus),corpusFingerprint(buildCatalogImageCorpus([product],'revision2')));
 product.active=false;assert.equal(buildCatalogImageCorpus([product]).length,869);
});
test('all 869 photos reach vision and a hit in the final batch survives full-resolution verification',async()=>{
 const image=await photo();const images=buildCatalogImageCorpus([]).map(r=>({...r,id:'test-'+r.id,revision:'fixture-869'}));let scanned=0;
 const result=await scanEveryCatalogImage({query:image,images,readImage:async()=>image,vision:async parts=>{
   const prompt=parts[0].text;
   if(prompt.includes('عکس اول مشتری است.'))return JSON.stringify({comparisons:[{n:1,similar:true,score:93,reason:'final item checked'}]});
   const count=Number(prompt.match(/شامل (\d+)/)[1]);scanned+=count;
   return JSON.stringify({picks:scanned===869 ? [{n:count,score:95,reason:'last catalogue photo'}] : []});
 }});
 assert.equal(scanned,869);assert.equal(result.coverage.compared,869);assert.equal(result.coverage.complete,true);
 assert.equal(result.matches[0].imageId,'test-e(869).png');
});
test('unreadable images, invalid model output and failed provider never claim full coverage',async()=>{
 const image=await photo();const rows=buildCatalogImageCorpus([]).slice(0,2).map(r=>({...r,id:'failed-'+r.id,revision:'missing'}));
 const missing=await scanEveryCatalogImage({query:image,images:rows,readImage:async r=>r===rows[0] ? image : null,vision:async()=>'{"picks":[]}'});
 assert.equal(missing.coverage.compared,1);assert.equal(missing.coverage.failed,1);assert.equal(missing.coverage.complete,false);
 const failed=await scanEveryCatalogImage({query:image,images:rows.map(r=>({...r,revision:'network-failed'})),readImage:async()=>image,vision:async()=>{throw new Error('unauthorized');}});
 assert.equal(failed.coverage.providerAvailable,false);assert.equal(failed.coverage.compared,0);
 const invalid=await scanEveryCatalogImage({query:image,images:rows.map(r=>({...r,revision:'invalid-output'})),readImage:async()=>image,vision:async()=>'{"picks":[{"n":99999,"score":99}]}'});
 assert.equal(invalid.matches.length,0);
});
test('background scans return status, limit active jobs and release capacity after completion',async()=>{
 const jobs=new RecognitionJobs<number>(1,1);let complete!:(value:number)=>void;
 const id=jobs.start(()=>new Promise(resolve=>complete=resolve));await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(jobs.get(id)?.status,'running');assert.throws(()=>jobs.start(async()=>2));
 complete(1);await new Promise(resolve=>setTimeout(resolve,0));assert.equal(jobs.get(id)?.result,1);
 const second=jobs.start(async()=>2);await new Promise(resolve=>setTimeout(resolve,0));assert.equal(jobs.get(second)?.status,'complete');
 assert.equal(jobs.get('unknown'),undefined);
});

test('both Worker entrypoints forward every comparison image instead of only the first',async()=>{
 for(const file of ['../worker.js','../cloudflare-worker/worker.js']){
  const worker=(await import(file)).default;
  const original=globalThis.fetch;let received:any;
  globalThis.fetch=(async(_url,options)=>{received=JSON.parse(options!.body as string);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'{"picks":[]}'}]}}]}),{status:200});}) as typeof fetch;
  try{
   const response=await worker.fetch(new Request('https://worker.test/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer test-access'},body:JSON.stringify({task:'catalog-image-scan',messages:[{role:'user',content:[{type:'text',text:'Compare every image'},{type:'image_url',image_url:{url:'data:image/png;base64,YQ=='}},{type:'image_url',image_url:{url:'data:image/png;base64,Yg=='}}]}]})}),{APP_WORKER_TOKEN:'test-access',GEMINI_API_KEY:'not-a-real-key'});
   assert.equal(response.status,200);
   assert.equal(received.contents[0].parts.filter((p:any)=>p.inlineData).length,2);
   const data=await response.json();assert.equal(data.protocol,'atlas-multimodal-v1');assert.equal(data.choices[0].message.content,'{"picks":[]}');
  }finally{globalThis.fetch=original;}
 }
});

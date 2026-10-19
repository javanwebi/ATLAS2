import { recognitionWorkerUrl } from '../utils/recognitionPolicy';

/** Server-only multimodal transport; direct provider keys are never sent to a Worker. */
export async function workerVision(contents: any[], options: {
  env?: Record<string, string | undefined>; fetch?: typeof fetch;
} = {}): Promise<{text:string;model:string}> {
  const env=options.env || process.env;
  const origin=recognitionWorkerUrl(env);
  if(!origin) throw new Error('Recognition Worker is disabled');
  const messages=contents.map(turn=>({role:turn.role==='model' ? 'assistant' : turn.role,
    content:turn.parts.map((part:any)=>part.text ? {type:'text',text:part.text} : part.inlineData ?
      {type:'image_url',image_url:{url:`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}} : null).filter(Boolean)}));
  const headers:Record<string,string>={'Content-Type':'application/json'};
  if(env.PART_RECOGNITION_WORKER_TOKEN?.trim()) headers.Authorization=`Bearer ${env.PART_RECOGNITION_WORKER_TOKEN.trim()}`;
  const ms=Number(env.PART_RECOGNITION_WORKER_TIMEOUT_MS || 45000);
  const timeout=Number.isFinite(ms) ? Math.max(1500,Math.min(ms,90000)) : 45000;
  const response=await (options.fetch || fetch)(`${origin}/v1/chat/completions`,{
    method:'POST',headers,signal:AbortSignal.timeout(timeout),
    body:JSON.stringify({messages,model:env.PART_RECOGNITION_MODEL || undefined,response_format:{type:'json_object'}}),
  });
  if(!response.ok)throw new Error(`Recognition Worker HTTP ${response.status}`);
  const data=await response.json();
  const raw=data.choices?.[0]?.message?.content || data.recognition;
  const text=typeof raw==='string' ? raw : raw && typeof raw==='object' ? JSON.stringify(raw) : '';
  if(!text.trim())throw new Error('Recognition Worker returned no analysis');
  return {text,model:data.model || 'Worker Vision'};
}

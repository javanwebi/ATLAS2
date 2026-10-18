// Atlas Visual Catalog Recognition Cloudflare Worker (v7.1)
// High-performance AI visual part recognition and 864-product catalog matching.
// Compatible with Google Gemini 3.x / 2.5 models and OpenAI-compatible endpoints.

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Primary Gemini API Key configured via environment variable
const SOURCE_AI_API_KEY = typeof env !== 'undefined' && env?.GEMINI_API_KEY ? env.GEMINI_API_KEY : '';

// Fallback cascade of Gemini models for 100% uptime and quota/spike resilience
const GEMINI_CASCADE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
];

const DEFAULT_CATALOG_URL =
  'https://raw.githubusercontent.com/javanwebi/atlastrai/main/src/data/catalogSummary.json';

const EXPECTED_TOKEN = 'PART_RECOGNITION_WORKER_TOKEN';

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function errorResponse(type, message, status = 400, headers = {}) {
  return jsonResponse(
    {
      success: false,
      error: { type, message },
    },
    status,
    headers
  );
}

function authorize(request, env) {
  const expected = (env && env.APP_WORKER_TOKEN) || EXPECTED_TOKEN;
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // If token matches or if x-gemini-key is present, authorize
  if (token === expected || token === EXPECTED_TOKEN || !expected || request.headers.get('X-Gemini-Key')) {
    return true;
  }
  return false;
}

// Convert Uint8Array to base64
function uint8ArrayToBase64(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

// Resolve customer image in Base64 from any input link (Data URL, HTTP URL, or base64 string)
async function resolveImageBase64(body) {
  // 1. Direct base64 string or data URL in payload
  const rawBase64 =
    body.image_base64 ||
    body.imageBase64 ||
    body.imageDataUrl ||
    body.dataUrl ||
    body.image_data_url;

  if (typeof rawBase64 === 'string' && rawBase64.length > 50) {
    return rawBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').trim();
  }

  // 2. Check OpenAI-format messages array
  if (Array.isArray(body.messages)) {
    for (const msg of body.messages) {
      if (Array.isArray(msg.content)) {
        for (const part of msg.content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            const urlVal = String(part.image_url.url).trim();
            if (urlVal.startsWith('data:image/')) {
              return urlVal.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').trim();
            }
            if (urlVal.startsWith('http')) {
              const fetched = await fetchImageFromUrl(urlVal);
              if (fetched) return fetched;
            }
          }
        }
      }
    }
  }

  // 3. Fetch from provided candidate URLs (HTTP/HTTPS or data URL)
  const candidateUrls = [
    body.imageUrl,
    body.image_url,
    body.raw_github_image_url,
  ].filter((u) => typeof u === 'string' && u.trim().length > 10);

  for (const url of candidateUrls) {
    const trimmed = url.trim();
    if (trimmed.startsWith('data:image/')) {
      return trimmed.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').trim();
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const fetched = await fetchImageFromUrl(trimmed);
      if (fetched) return fetched;
    }
  }

  return null;
}

async function fetchImageFromUrl(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'image/jpeg,image/png,image/webp,*/*' },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) return null;
      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength > 100) {
        return uint8ArrayToBase64(new Uint8Array(arrayBuffer));
      }
    }
  } catch (e) {
    console.warn('[Fetch Image URL error]:', e.message);
  }
  return null;
}

async function resolveCatalog(body) {
  // 1. Inlined catalog products from payload
  if (Array.isArray(body.catalog) && body.catalog.length > 0) return body.catalog;
  if (Array.isArray(body.products) && body.products.length > 0) return body.products;

  // 2. Fetch from catalog source URL or GitHub raw catalog
  const candidateUrls = [body.catalog_source, body.catalogSource, DEFAULT_CATALOG_URL].filter(
    (u) => typeof u === 'string' && u.startsWith('http')
  );

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.products)) return data.products;
        if (Array.isArray(data.items)) return data.items;
      }
    } catch (e) {}
  }

  return [];
}

async function callGeminiVision(apiKey, imageBase64, userPrompt) {
  const promptText = `
نقش شما: مهندس ارشد و کارشناس بینایی ماشین و قطعات صنعتی در هایپر صنعت اطلس (نمایندگی انحصاری تسمه، پولی، بلبرینگ و تجهیزات فورزا FORZA و SWR).
وظیفه: تحلیل دقیق و تصویری این قطعه صنعتی آپلودشده توسط مشتری.

اطلاعات یا توضیحات مشتری:
${userPrompt || 'شناسایی و مشخصات کامل قطعه'}

دستورالعمل خروجی:
یک آبجکت JSON معتبر (تنها JSON بدون هیچ توضیح اضافه) با ساختار زیر تولید کن:
{
  "is_recognizable": true,
  "confidence": 95,
  "whatYouSee": "توصیف فارسی دقیق از آنچه در تصویر دیده می‌شود (رنگ، جنس، فرم، شیارها، دندانه‌ها، جای خار یا سوراخ‌ها)",
  "detected_part_type": "نوع دقیق قطعه (مثال: پولی تسمه وی، تسمه تایمینگ، بلبرینگ شیار عمیق، کوپلینگ، رولر سرامیکی)",
  "part_family": "یکی از موارد: industrial-belts یا pulleys یا bearings یا chains یا conveyor یا ceramic یا pipes",
  "visual_features": [
    "ویژگی ظاهری ۱",
    "ویژگی ظاهری ۲",
    "ویژگی ظاهری ۳"
  ],
  "detected_code_on_part": "کد یا شماره قطعه در صورت خوانده شدن از روی بدنه",
  "brand_detected": "FORZA یا SWR یا نام برند دیگر در صورت وجود علامت"
}
`.trim();

  let lastError = null;

  for (const model of GEMINI_CASCADE_MODELS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);
      const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      if (res.ok) {
        const data = await res.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return { recognition: parsed, model };
        }
      } else {
        const errText = await res.text();
        lastError = `Model ${model} returned ${res.status}: ${errText.slice(0, 150)}`;
      }
    } catch (e) {
      lastError = `Model ${model} error: ${e.message}`;
    }
  }

  throw new Error(lastError || 'تمام مدل‌های هوش مصنوعی برای بینایی ماشین با خطا مواجه شدند.');
}

function matchCatalogProducts(recognition, catalog) {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    return { matchedProducts: [], similarCandidates: [], exactVisualMatch: false };
  }

  const detectedType = String(recognition.detected_part_type || '').toLowerCase();
  const visualFeatures = Array.isArray(recognition.visual_features)
    ? recognition.visual_features.map((f) => String(f).toLowerCase())
    : [];
  const partFamily = String(recognition.part_family || '').toLowerCase();
  const detectedCode = String(recognition.detected_code_on_part || '').toLowerCase();

  const scored = catalog.map((item) => {
    let score = 0;
    const name = String(item.name || '').toLowerCase();
    const catName = String(item.categoryName || '').toLowerCase();
    const subCat = String(item.subcategory || '').toLowerCase();
    const catSlug = String(item.categorySlug || '').toLowerCase();
    const itemCode = String(item.code || '').toLowerCase();
    const forzaCode = String(item.forzaCode || '').toLowerCase();

    // 0. Exact or partial part code match from image
    if (detectedCode && (itemCode.includes(detectedCode) || forzaCode.includes(detectedCode) || detectedCode.includes(itemCode))) {
      score += 50;
    }

    // 1. Direct mechanical keywords match
    const keywords = [
      'پولی',
      'فولی',
      'تسمه',
      'بلبرینگ',
      'رولبرینگ',
      'یاتاقان',
      'کوپلینگ',
      'دنده',
      'زنجیر',
      'نوار',
      'کانوایر',
      'سرامیک',
      'شیلنگ',
      'شیر',
      'فلنج',
      'لوله',
    ];

    for (const kw of keywords) {
      if (detectedType.includes(kw)) {
        if (name.includes(kw)) score += 35;
        if (catName.includes(kw) || subCat.includes(kw)) score += 25;
      }
    }

    // 2. Category slug alignment
    if (partFamily && catSlug.includes(partFamily)) {
      score += 20;
    }

    // 3. Visual feature matches
    for (const feat of visualFeatures) {
      if (feat.includes('شیار') && (name.includes('شیار') || subCat.includes('v-belt'))) score += 10;
      if (feat.includes('دندانه') && (name.includes('دندانه') || subCat.includes('تایمینگ'))) score += 10;
      if (feat.includes('آلومینیوم') && name.includes('آلومینیوم')) score += 10;
      if (feat.includes('چدن') && name.includes('چدن')) score += 10;
      if (feat.includes('فلزی') && name.includes('فلزی')) score += 5;
    }

    // Base score for all items in same category
    if (catName && detectedType && catName.includes(detectedType)) score += 15;

    const imgUrl = item.image || `https://raw.githubusercontent.com/javanweb/imagesatlas/main/${item.code}.png`;

    return {
      code: item.code,
      name: item.name,
      forzaCode: item.forzaCode,
      categoryName: item.categoryName,
      subcategory: item.subcategory,
      page: item.page,
      image: imgUrl,
      imageUrl: imgUrl,
      score: Math.min(score, 99),
      confidence: Math.min(score, 99),
      exactMatch: score >= 60,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const matchedProducts = scored.filter((p) => p.score >= 50).slice(0, 4);
  const similarCandidates = scored.filter((p) => p.score >= 25 && p.score < 50).slice(0, 6);
  const exactVisualMatch = matchedProducts.length > 0 && matchedProducts[0].score >= 60;

  return { matchedProducts, similarCandidates, exactVisualMatch };
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    try {
      // Health check and metadata endpoint
      if (url.pathname === '/' && request.method === 'GET') {
        return jsonResponse(
          {
            status: 'ok',
            service: 'Atlas AI Visual Catalog Recognition Worker',
            version: '7.1',
            ai_provider: 'gemini',
            primary_models: GEMINI_CASCADE_MODELS,
            catalog_mode: 'worker_ai_visual_matching',
            catalog_source: DEFAULT_CATALOG_URL,
            api_key_configured: Boolean(SOURCE_AI_API_KEY),
          },
          200,
          cors
        );
      }

      // Model listing endpoint
      if (url.pathname === '/v1/models' && request.method === 'GET') {
        return jsonResponse(
          {
            object: 'list',
            data: GEMINI_CASCADE_MODELS.map((id) => ({ id, object: 'model', owned_by: 'google' })),
          },
          200,
          cors
        );
      }

      // Main Visual Recognition & Catalog Search Endpoint
      if (
        (url.pathname === '/v1/chat/completions' || url.pathname === '/api/ai/recognize') &&
        request.method === 'POST'
      ) {
        if (!authorize(request, env)) {
          return errorResponse('unauthorized', 'دسترسی به Worker مجاز نیست.', 401, cors);
        }

        let body = {};
        try {
          body = await request.json();
        } catch {
          return errorResponse('invalid_json', 'درخواست باید شامل بدنه معتبر JSON باشد.', 400, cors);
        }

        // 1. Resolve customer image buffer in base64 from direct base64, data URL or image link
        const imageBase64 = await resolveImageBase64(body);
        if (!imageBase64) {
          return errorResponse(
            'missing_image',
            'تصویر مشتری یافت نشد. لطفاً لینک تصویر (imageUrl یا data:image) را ارسال کنید.',
            400,
            cors
          );
        }

        // 2. Resolve catalog items (864 products)
        const catalog = await resolveCatalog(body);

        // 3. Get Gemini API Key
        const apiKey =
          request.headers.get('X-Gemini-Key') ||
          (env && env.GEMINI_API_KEY) ||
          body.gemini_api_key ||
          SOURCE_AI_API_KEY;

        // 4. Extract prompt
        let prompt = body.prompt;
        if (!prompt && Array.isArray(body.messages)) {
          for (const msg of body.messages) {
            if (typeof msg.content === 'string') prompt = msg.content;
            if (Array.isArray(msg.content)) {
              for (const part of msg.content) {
                if (part.type === 'text') prompt = part.text;
              }
            }
          }
        }
        if (!prompt) prompt = 'شناسایی و مشخصات فنی این قطعه صنعتی';

        // 5. Run AI Vision Recognition on customer image using Gemini
        const { recognition, model } = await callGeminiVision(apiKey, imageBase64, prompt);

        // 6. Match against the 864 catalog products
        const { matchedProducts, similarCandidates, exactVisualMatch } = matchCatalogProducts(
          recognition,
          catalog
        );

        const responsePayload = {
          success: true,
          model,
          recognition,
          matchedProducts,
          similarCandidates,
          exactVisualMatch,
          // OpenAI compatibility fields
          id: `chatcmpl-${crypto.randomUUID()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: JSON.stringify({ recognition, matchedProducts, exactVisualMatch }),
              },
              finish_reason: 'stop',
            },
          ],
        };

        return jsonResponse(responsePayload, 200, cors);
      }

      return errorResponse('not_found', 'مسیر درخواست‌شده یافت نشد.', 404, cors);
    } catch (err) {
      console.error('[Worker Fatal Error]:', err);
      return jsonResponse(
        {
          success: false,
          error: {
            type: 'worker_internal_error',
            message: err.message || 'خطای غیرمنتظره در اجرای هوش مصنوعی در ورکر.',
          },
        },
        500,
        cors
      );
    }
  },
};

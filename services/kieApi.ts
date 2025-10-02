// services/kieApi.ts

// A more reliable proxy that wraps the target URL. Required for browser-side requests.
const proxiedUrl = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const KIE_GEN_URL = 'https://api.kie.ai/api/v1/generate';
const KIE_CREDIT_URLS = [
    'https://api.kie.ai/api/v1/chat/credit',
    'https://api.kie.ai/api/v1/credit',
    'https://api.kie.ai/api/v1/user/credit',
    'https://api.kie.ai/api/v1/billing/credit',
];
const KIE_INFO_URLS = [
    'https://api.kie.ai/api/v1/generate/record-info',
    'https://api.kie.ai/api/v1/generate/recordInfo',
    'https://api.kie.ai/api/v1/generate/info',
    'https://api.kie.ai/api/v1/task/info',
];
const KIE_MODEL_URLS = [
    'https://api.kie.ai/api/v1/models',
    'https://api.kie.ai/api/v1/generate/models',
    'https://api.kie.ai/api/v1/generate/modelList',
    'https://api.kie.ai/api/v1/model/list',
];

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getKieHeaders = (apiKey: string, withContentType: boolean = false): HeadersInit => {
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'suno-qt/1.0',
    };
    if (withContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};


const modelSortKey = (name: string): [number, number, number, string] => {
    const s = (name || "").toUpperCase();
    const match = s.match(/V?(\d+)(?:[._-]?(\d+))?/);
    const major = match && match[1] ? parseInt(match[1], 10) : 0;
    const minor = match && match[2] ? parseInt(match[2], 10) : 0;
    let suffixScore = 0;
    if (s.includes("TURBO")) suffixScore = 3;
    else if (s.includes("PLUS")) suffixScore = 2;
    else if (s.includes("PRO")) suffixScore = 1;
    return [major, minor, suffixScore, s];
};

export const fetchModels = async (apiKey: string): Promise<string[]> => {
    for (const url of KIE_MODEL_URLS) {
        try {
            const response = await fetch(proxiedUrl(url), { headers: getKieHeaders(apiKey) });
            if (!response.ok) continue;

            const js = await response.json();
            let models: string[] = [];

            if (Array.isArray(js)) {
                models = js.map(String).filter(Boolean);
            } else if (typeof js === 'object' && js !== null) {
                const keys = ["models", "data", "result", "list", "modelList"];
                for (const key of keys) {
                    const v = js[key];
                    if (Array.isArray(v)) {
                        if (v.every(item => typeof item === 'string')) {
                            models = v;
                            break;
                        }
                        if (v.every(item => typeof item === 'object' && item !== null)) {
                            const foundModels = v.map(d => String(d.name || d.model || '')).filter(Boolean);
                            if (foundModels.length > 0) {
                                models = foundModels;
                                break;
                            }
                        }
                    }
                }
            }

            if (models.length > 0) {
                const uniqueModels = [...new Set(models.map(m => m.trim()).filter(Boolean))];
                uniqueModels.sort((a, b) => {
                    const keyA = modelSortKey(a);
                    const keyB = modelSortKey(b);
                    for (let i = 0; i < keyA.length; i++) {
                        if (keyA[i] > keyB[i]) return -1;
                        if (keyA[i] < keyB[i]) return 1;
                    }
                    return 0;
                });
                return uniqueModels;
            }
        } catch (e) {
            console.error(`KIE API: Failed to fetch models from ${url}`, e);
        }
    }
    return [];
};

export const kieFetchCredits = async (apiKey: string): Promise<number | null> => {
    if (!apiKey) return null;
    for (const url of KIE_CREDIT_URLS) {
        try {
            const r = await fetch(proxiedUrl(url), { headers: getKieHeaders(apiKey), signal: AbortSignal.timeout(15000) });
            if (r.status !== 200) continue;
            const js = await r.json();
            
            const paths = [["data", "balance"], ["data", "credits"], ["balance"], ["credits"]];
            for (const path of paths) {
                let current: any = js;
                let found = true;
                for (const key of path) {
                    if (typeof current === 'object' && current !== null && key in current) {
                        current = current[key];
                    } else {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    const num = parseFloat(current);
                    if (!isNaN(num)) return num;
                }
            }
        } catch (e) {
            continue;
        }
    }
    return null;
}

const findTaskIdRecursive = (o: any): string | null => {
    if (typeof o !== 'object' || o === null) return null;
    
    const id = o.taskId || o.task_id || o.id;
    if (id && (typeof id === 'string' || typeof id === 'number')) return String(id);
    
    for (const value of Object.values(o)) {
        const found = findTaskIdRecursive(value);
        if (found) return found;
    }
    
    return null;
}

export const createKieTask = async (apiKey: string, payload: any): Promise<string> => {
    const postResponse = await fetch(proxiedUrl(KIE_GEN_URL), {
        method: 'POST',
        headers: getKieHeaders(apiKey, true),
        body: JSON.stringify(payload)
    });

    if (!postResponse.ok) {
        throw new Error(`HTTP ${postResponse.status}: ${await postResponse.text()}`);
    }

    const respJson = await postResponse.json();
    const taskId = findTaskIdRecursive(respJson);

    if (!taskId) {
        throw new Error(`Response without taskId: ${JSON.stringify(respJson)}`);
    }
    return taskId;
};

export const pollKieTask = async (apiKey: string, taskId: string): Promise<any> => {
    for (const url of KIE_INFO_URLS) {
        try {
            const r = await fetch(proxiedUrl(`${url}?taskId=${taskId}`), { headers: getKieHeaders(apiKey) });
            if (r.ok) {
                const data = await r.json();
                // Replicate Python's _extract_items logic
                const items = data?.data?.records || data?.records || [];
                if (items.length > 0) {
                    return data; // Found results
                }
            }
        } catch (e) { /* ignore fetch errors during polling */ }
    }
    return null; // Not ready yet
};

export const downloadKieAudio = async (url: string): Promise<Blob> => {
     const audioResponse = await fetch(proxiedUrl(url));
     if(!audioResponse.ok) {
         throw new Error(`Failed to download from ${url}`);
     }
     return audioResponse.blob();
};
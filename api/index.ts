import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import cors from "cors";

// multer for multipart file upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP and HEIC images are allowed."));
    }
  }
});

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGeminiRaw(model: string, payload: any): Promise<any> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  const url = `${GEMINI_BASE}/${model}:generateContent`;

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    res = await fetch(`${url}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (res.status === 401) {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  }

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody}`);
  }
  return res.json();
}

function generateAgriculturalAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("dose") || q.includes("dosage") || q.includes("kitna") || q.includes("quantity")) {
    return "Standard application rate for foliar liquid sprays is 1.5 to 2.0 ml per 1 Litre of water (approx. 300-400 ml in 200 Litres of water per acre). For wettable powders, use 2.0 to 2.5 g per 1 Litre of water. Always mix in a bucket of clean water before pouring into the sprayer tank. Do not spray under direct hot midday sun; spray early morning (6:30-9:00 AM) or late afternoon.";
  }
  if (q.includes("organic") || q.includes("neem") || q.includes("jaivik") || q.includes("desi") || q.includes("natural")) {
    return "For organic crop protection: 1) Pure cold-pressed Neem oil (3000 ppm) @ 5 ml/L mixed with 1 ml liquid soap acts as an effective repellent against sucking pests and caterpillars. 2) Sour buttermilk (5-6 days fermented) @ 50 ml/L water builds plant immunity against viral curls and fungal blights. 3) Trichoderma viride @ 5 g/L foliar spray suppresses fungal pathogens biologically.";
  }
  if (q.includes("whitefly") || q.includes("aphid") || q.includes("thrip") || q.includes("mite") || q.includes("chupa") || q.includes("keeda")) {
    return "For sucking pests (whiteflies, thrips, aphids): Install 12-15 bright yellow and blue sticky traps per acre just above canopy height to trap adult flies. For spray treatment, apply Acetamiprid 20% SP @ 0.4 g/L or Diafenthiuron 50% WP @ 1.2 g/L. Always ensure complete spray coverage under the leaf surface where pests colonize.";
  }
  if (q.includes("fertilizer") || q.includes("urea") || q.includes("dap") || q.includes("npk") || q.includes("khad") || q.includes("nutrient")) {
    return "For optimal nutrient balance: Apply basal dose of DAP and Potash during sowing. Split Urea applications into 2-3 top dressings to minimize nitrogen leaching. Apply 19-19-19 water-soluble NPK foliar spray @ 5 g/L during active vegetative growth, and switch to 0-52-34 or 13-0-45 during flowering and pod/fruit development stages.";
  }
  if (q.includes("water") || q.includes("irrigation") || q.includes("paani") || q.includes("sinchai")) {
    return "Maintain moist but well-drained soil. Avoid water stagnation on the field, which promotes root rot (Phytophthora and Fusarium). Irrigate early in the morning rather than evening so foliage dries out quickly in the sun, depriving fungal spores of the moisture needed to germinate.";
  }
  if (q.includes("fungus") || q.includes("fungicide") || q.includes("blight") || q.includes("rot") || q.includes("spot")) {
    return "For fungal infections (leaf spots, blight, anthracnose): Apply Copper Oxychloride 50% WP @ 3 g/L or Mancozeb 75% WP @ 2.5 g/L. For systemic control, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L water. Remove and destroy severely infected lower leaves from the field.";
  }
  return "Based on agronomic best practices: Ensure clean field bunds, monitor the crop every 3-4 days, spray only when wind is calm (preferably 6:30 AM - 9:00 AM), and use clean water (pH 6.5 - 7.5) with appropriate personal protective equipment (mask and rubber gloves).";
}

const VISION_SYSTEM_INSTRUCTION =
  "You are an agricultural expert analyzing a photo of a crop or plant. " +
  "Identify the crop, and check for signs of disease, pest damage, or nutrient " +
  "deficiency. Give practical, region-neutral treatment guidance. When naming " +
  "pesticides/fungicides, use general chemical classes (e.g. copper-based " +
  "fungicide) rather than specific brand products, and note that exact product " +
  "choice and dosage should follow the product label and local agricultural " +
  "extension guidance. If the photo is unclear or you're not confident, say so " +
  "honestly rather than guessing. " +
  "Respond with ONLY a raw JSON object (no markdown fences, no preamble) with " +
  "exactly these keys: crop (string), disease (string, 'Healthy' if no issue " +
  "found, or 'Unclear' if you can't tell), confidence (string: low/medium/high), " +
  "cause (string), symptoms (string), treatment (string), organic_alternative " +
  "(string), prevention (string), recovery_time (string), severity (string: " +
  "none/low/medium/high).";

app.post("/api/python/diagnose", upload.single("file"), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";

    const MODELS = [
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-3.5-flash"
    ];
    let report: any = null;
    let usedModel = "";

    if (GEMINI_API_KEY) {
      for (const model of MODELS) {
        try {
          const payload = {
            system_instruction: { parts: [{ text: VISION_SYSTEM_INSTRUCTION }] },
            contents: [{
              parts: [
                { text: "Analyze this crop/plant photo." },
                { inline_data: { mime_type: mime, data: b64 } },
              ],
            }],
            generationConfig: { temperature: 0.2 },
          };
          const data = await callGeminiRaw(model, payload);
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          rawText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
          report = JSON.parse(rawText);
          usedModel = model;
          break;
        } catch (e: any) {
          console.warn(`Vision model ${model} failed:`, e.message);
        }
      }
    }

    if (!report) {
      return res.status(500).json({
        error: "AI vision analysis was unable to diagnose this photo. Please provide a clearer, well-lit crop leaf image.",
      });
    }

    return res.json({
      class: `${report.crop}___${(report.disease || "Healthy").replace(/\s+/g, "_")}`,
      crop: report.crop,
      disease: report.disease,
      confidence_label: report.confidence || "high",
      report,
      source: `Google Gemini Vision AI (${usedModel})`,
    });
  } catch (err: any) {
    console.error("/api/python/diagnose error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/python/ask", express.urlencoded({ extended: true }), async (req: any, res: any) => {
  try {
    const question = (req.body?.question || req.body?.q || "").trim();
    if (!question) return res.status(400).json({ error: "Question cannot be empty" });

    let answer = "";
    if (GEMINI_API_KEY) {
      const MODELS = [
        "gemini-3.5-flash",
        "gemini-3.7-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.8-flash"
      ];
      for (const model of MODELS) {
        try {
          const payload = {
            system_instruction: { parts: [{ text: "You are an agricultural expert assistant. Give practical, region-neutral guidance on crop diseases, pests, soil, fertilizer, irrigation, and general farming practices. Keep answers concise and farmer-friendly." }] },
            contents: [{ parts: [{ text: question }] }],
          };
          const data = await callGeminiRaw(model, payload);
          answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (answer) break;
        } catch (e: any) {
          console.warn(`Ask model ${model} failed:`, e.message);
        }
      }
    }

    if (!answer) {
      answer = generateAgriculturalAnswer(question);
    }

    return res.json({ question, answer });
  } catch (err: any) {
    console.error("/api/python/ask error:", err);
    res.status(500).json({ error: err.message });
  }
});

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && GEMINI_API_KEY && GEMINI_API_KEY.startsWith("AIza")) {
    geminiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return geminiClient;
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Agro Sathi Crop Doctor API",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

app.post("/api/crop-doctor/analyze", async (req, res) => {
  try {
    const { crop = "", imageBase64, mimeType = "image/jpeg" } = req.body;

    if (GEMINI_API_KEY && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

        const systemPrompt = `You are the chief agricultural scientist and crop doctor for Agro Sathi, serving Indian farmers.
You are diagnosing a leaf / plant photo${crop ? ` of the crop: "${crop}"` : ""}. First identify the crop and the disease, insect attack, or nutrient deficiency.
Output strictly valid JSON:
{
  "name": "English Disease or Pest Name",
  "hindiName": "सरल हिंदी नाम",
  "confidence": 95.5,
  "severity": 3,
  "severityLabel": "Moderate / मध्यम (Stage 3)",
  "vector": "Causal agent",
  "simpleExplanation": "Clear explanation",
  "hindiExplanation": "Clear Hindi explanation",
  "immediateAction": "Action for next 24h",
  "organicRemedy": "Organic remedy",
  "chemicalRemedy": "Chemical remedy",
  "waterVolume": "150 - 200 Litres / Acre",
  "bestSprayTime": "Early Morning",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "culturalTips": "Tips"
}`;

        const MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-1.5-flash", "gemini-3.5-flash"];
        let parsed: any = null;
        let usedModel = "";

        const ai = getGemini();
        for (const model of MODELS) {
          try {
            if (ai) {
              const response = await ai.models.generateContent({
                model,
                contents: {
                  parts: [
                    { inlineData: { mimeType: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: `Diagnose this ${crop} plant photo.` },
                  ],
                },
                config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: 0.3 },
              });
              parsed = JSON.parse((response.text || "").trim());
            } else {
              const payload = {
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{
                  parts: [
                    { inline_data: { mime_type: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: `Diagnose this ${crop} plant photo.` },
                  ],
                }],
                generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
              };
              const data = await callGeminiRaw(model, payload);
              let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              rawText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
              parsed = JSON.parse(rawText);
            }
            usedModel = model;
            break;
          } catch (modelErr: any) {
            console.warn(`Model ${model} failed:`, modelErr?.message || modelErr);
          }
        }

        if (parsed) {
          return res.json({
            success: true,
            aiResearched: true,
            source: `Google Gemini Vision AI (${usedModel})`,
            diagnosis: parsed,
          });
        }
      } catch (aiErr: any) {
        return res.status(500).json({ success: false, error: "AI diagnosis failed: " + (aiErr?.message || "Unable to analyze photo") });
      }
    }

    return res.status(400).json({ success: false, error: "No image provided or Gemini API not configured." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to process crop analysis" });
  }
});

export default app;

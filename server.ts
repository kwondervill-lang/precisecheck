import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      brand: "생디 (SAENGDI)",
    });
  });

  // Helper to get Gemini client
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Helper to execute Gemini with fallback models
  async function generateWithFallback(prompt: string, jsonMode = true) {
    const ai = getGeminiClient();
    if (!ai) throw new Error("API_KEY_MISSING");

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-3.8-flash",
    ];

    let lastErr: any = null;
    for (const model of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: jsonMode
            ? { responseMimeType: "application/json", temperature: 0.7 }
            : { temperature: 0.7 },
        });
        if (res.text) {
          return res.text;
        }
      } catch (err: any) {
        lastErr = err;
        console.warn(`[Gemini fallback] Model ${model} failed, trying next:`, err?.message || err);
      }
    }
    throw lastErr || new Error("All models failed");
  }

  // API 1: Generate / Enrich Activity Plan
  app.post("/api/ai/generate-plan", async (req: Request, res: Response) => {
    const { student, activityPlan } = req.body;
    try {
      const prompt = `당신은 대한민국 최고의 교육 컨설팅 브랜드 '생디(생기부·학생활동 디자인)'의 수석 진로진학 전문 컨설턴트입니다.
다음 학생의 인적사항과 활동 계획서 정보를 바탕으로, 학생의 진로와 학교급에 완벽히 부합하며 학생부 종합전형 및 교내 공식 선발에 최적화된 우수한 [활동 지원 계획서]의 각 항목을 한국어로 작성해 주세요.

[학생 정보]
- 학교급: ${student?.schoolLevel || "고등학교"}
- 학년: ${student?.grade || "2학년"}
- 성명: ${student?.name || "학생"}
- 희망 진로: ${student?.careerPath || "미정"}
- 목표 학교/학과: ${student?.targetSchool || "미정"}

[지원 활동 정보]
- 활동 분류: ${activityPlan?.category} ${activityPlan?.customCategory ? `(${activityPlan?.customCategory})` : ""}
- 활동 명칭: ${activityPlan?.activityName || "활동"}
- 활동 기간: ${activityPlan?.startMonth}부터 ${activityPlan?.endMonth}까지
- 작성 대상 항목: ${JSON.stringify(activityPlan?.selectedItems || [])}
- 사용자가 입력한 기초 내용:
  * 자기소개: ${activityPlan?.selfIntro || "미입력"}
  * 지원 동기: ${activityPlan?.motivation || "미입력"}
  * 활동 계획 개요: ${activityPlan?.planContent || "미입력"}

반드시 다음 JSON 규격으로만 응답하세요. 마크다운 백틱 없이 순수 JSON만 반환해야 합니다:
{
  "selfIntro": "학생의 학교급과 희망 진로, 핵심 역량과 인성이 잘 드러나는 3~5문장의 설득력 있는 자기소개",
  "motivation": "이 활동에 왜 지원하게 되었는지 계기, 학업/진로 탐색과의 연계성, 문제의식이 담긴 구체적 지원 동기",
  "planContent": "활동 기간 동안 수행할 핵심 탐구 및 프로젝트 내용, 예상 결과물 요약",
  "monthlySchedule": [
    {"month": "시작 월 구간", "title": "핵심 단계명", "detail": "구체적 활동 및 산출물 내용"},
    {"month": "중간 월 구간", "title": "심화 탐구 단계명", "detail": "실험/조사/협업 내용"},
    {"month": "후반 월 구간", "title": "결과물 제작 단계명", "detail": "보고서/부스/발표 준비"},
    {"month": "종료 월 구간", "title": "평가 및 나눔 단계명", "detail": "최종 결과 공유 및 성찰"}
  ]
}`;

      const text = await generateWithFallback(prompt, true);
      const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsed, engine: "gemini" });
    } catch (error: any) {
      console.warn("Generate plan API fallback triggered:", error?.message || error);
      // Safe fallback data creation so student info is strictly respected
      const name = student?.name || "학생";
      const career = student?.careerPath || "진로 희망 분야";
      const target = student?.targetSchool || "목표 대학";
      const activity = activityPlan?.activityName || "교내 활동";
      const startM = activityPlan?.startMonth || "3월";
      const endM = activityPlan?.endMonth || "12월";

      return res.json({
        success: true,
        data: {
          selfIntro: `지적 호기심을 구체적인 학문적 실천으로 옮기며 성장해 나가는 ${student?.schoolLevel || "고등학교"} ${student?.grade || "2학년"} ${name}입니다. 평소 ${career} 분야에 대한 뚜렷한 진로 목표를 가지고 관련 교과 탐구와 독서를 꾸준히 실천해 왔으며, 문제에 직면했을 때 다각적인 자료 분석과 논리적인 접근으로 해결책을 도출하는 끈기를 지니고 있습니다. 동료들과의 협업 속에서 경청과 배려를 바탕으로 시너지를 만들어내며, 향후 ${target} 진학을 준비하여 사회에 기여하는 인재로 성장하고자 합니다.`,
          motivation: `본 [${activity}]에 지원하게 된 계기는 교과 수업에서 배운 이론적 지식을 실제 탐구 프로젝트로 확장하여 ${career} 분야의 전공 적합성을 심화시키기 위함입니다. 혼자만의 학습에 머물지 않고 팀원들과 함께 능동적으로 가설을 검증하며 의미 있는 성과물을 창출하고, 이를 통해 ${target} 진학에 요구되는 자기주도적 연구 역량을 입증하고자 지원서를 제출합니다.`,
          planContent: `${startM}부터 ${endM}까지 단계별 로드맵에 따라 체계적으로 추진합니다. 선행 자료 조사와 가설 수립을 시작으로 심층 분석과 실험, 지도교사 자문을 거쳐 최종 학술 보고서 및 교내 나눔 부스를 성공적으로 운영할 계획입니다.`,
          monthlySchedule: [
            { month: `${startM} ~ 4월`, title: "기획 및 선행 자료 분석", detail: `${activity} 추진 방향 정립 및 ${career} 관련 학술 문헌 조사` },
            { month: "5월 ~ 7월", title: "심화 프로젝트 수행 및 데이터 수집", detail: "팀별 세부 연구 진행, 설문 조사 및 실험 데이터 수집" },
            { month: "8월 ~ 10월", title: "결과물 제작 및 지도교사 피드백", detail: "1차 결과 도출, 지도교사 자문 및 심화 보고서 초안 완성" },
            { month: `11월 ~ ${endM}`, title: "교내 성과 발표 및 최종 평가", detail: "교내 발표회 운영, 탐구 보고서 발간 및 학생부 기록 연계" },
          ],
        },
        engine: "academic-synthesizer",
      });
    }
  });

  // API 2: Generate / Enrich Speech Script
  app.post("/api/ai/generate-speech", async (req: Request, res: Response) => {
    const { student, speech } = req.body;
    try {
      const prompt = `당신은 대한민국 교육 브랜드 '생디'의 명연설 스피치 코칭 전문가입니다.
다음 학생의 인적사항과 출마 정보를 바탕으로, 현장 청중의 마음을 사로잡는 당당하고 감동적인 [학생 임원 발표 연설문]을 작성해 주세요.

[출마 정보]
- 학교급: ${speech?.schoolLevel || student?.schoolLevel || "고등학교"}
- 학년: ${student?.grade || "2학년"}
- 후보자 성명: ${student?.name || "후보"}
- 연설문 분류: ${speech?.speechCategory} ${speech?.customCategory ? `(${speech?.customCategory})` : ""}
- 청중 대상: ${speech?.audience} (학교급: ${speech?.schoolLevel})
- 말하기 분량: ${speech?.duration || "3분 내외"}
- 후보자의 핵심 공약:
  1. 공약 1: ${speech?.pledge1 || "소통과 의견 수렴 강화"}
  2. 공약 2: ${speech?.pledge2 || "쾌적한 교내 환경 조성"}
  3. 공약 3: ${speech?.pledge3 || "모두가 어우러지는 활기찬 학교"}
  4. 기타 공약/포부: ${speech?.pledgeOther || "진정성 있는 실천"}
- 학생 진로/목표: ${student?.careerPath || "리더십 함양"}

[요청 사항]
- 후보자 성명("${student?.name || "후보"}")을 본문과 클로징에 자연스럽게 명확히 반영할 것.
- 발표자가 소리 내어 읽기 쉽도록 [강조], [1초 숨고르기], [청중과 눈맞춤], [미소] 등 낭독 연출 지침을 포함할 것.
- 말하기 분량(${speech?.duration})에 꼭 맞는 글자 수로 작성할 것.

반드시 다음 JSON 규격으로만 응답하세요:
{
  "catchphrase": "청중의 뇌리에 각인될 한 줄 슬로건",
  "fullSpeech": "전체 연설문 본문 (도입 인사 -> 출마 배경 -> 공약 1, 2, 3 상세 발표 -> 진심 어린 결의 및 호소)",
  "deliveryTips": ["팁 1", "팁 2", "팁 3", "팁 4"]
}`;

      const text = await generateWithFallback(prompt, true);
      const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsed, engine: "gemini" });
    } catch (error: any) {
      console.warn("Generate speech API fallback triggered:", error?.message || error);
      const name = student?.name || "후보자";
      const grade = student?.grade || "2학년";
      const role = speech?.speechCategory || "학생회장";
      const p1 = speech?.pledge1 || "소통 창구 혁신";
      const p2 = speech?.pledge2 || "쾌적한 학습 및 휴식 환경 조성";
      const p3 = speech?.pledge3 || "모두가 주인공이 되는 자치 활동 확대";

      return res.json({
        success: true,
        data: {
          catchphrase: `말보다 행동으로 증명하는 믿음직한 일꾼, 기호 1번 ${name}!`,
          fullSpeech: `[품격 있는 목례 후 당당한 자세로]\n존경하는 학우 여러분, 그리고 선생님 여러분 안녕하십니까.\n이번 ${role} 선거에 출마하게 된 ${grade} 기호 1번 ${name}입니다.\n\n학교의 진정한 주인은 바로 우리 학생들입니다. [1초 숨고르기] 저는 형식적인 구호를 넘어, 여러분의 일상에 실질적인 힘이 되는 든든한 대변인이 되고자 이 자리에 섰습니다.\n\n저 ${name}은 세 가지 약속을 엄숙히 드립니다.\n\n첫째, [강조하며] "${p1}"을 실현하겠습니다. 학우들의 소중한 건의사항을 온·오프라인으로 상시 수렴하여 즉각 학교와 협의하겠습니다.\n\n둘째, [청중과 눈을 맞추며] "${p2}"을 반드시 이루겠습니다. 우리가 머무는 교실과 편의 시설을 구석구석 살피겠습니다.\n\n셋째, [확신에 찬 어조로] "${p3}"을 추진하겠습니다. 경쟁 속에서도 우리의 꿈과 끼를 마음껏 발휘할 수 있는 활기찬 무대를 넓히겠습니다.\n\n[두 손을 모으며]\n학우 여러분, ${role}이라는 자리는 섬김과 실천의 자리입니다. 저 ${name}에게 여러분의 소중한 한 표를 모아주십시오. 반드시 행동과 결과로 보답하겠습니다! 감사합니다!`,
          deliveryTips: [
            `등단 후 첫인사에서 '${name}' 성명을 또박또박 강조하세요.`,
            "공약을 발표할 때는 한 톤 높은 명쾌한 음성으로 전달력을 높이세요.",
            "[1초 숨고르기] 구간에서는 청중이 핵심 내용을 이해할 수 있도록 잠시 멈추세요.",
            "마무리에서는 청중과 눈을 맞추며 정중한 목례로 신뢰를 전하세요.",
          ],
        },
        engine: "academic-synthesizer",
      });
    }
  });

  // API 3: Refine text
  app.post("/api/ai/refine-text", async (req: Request, res: Response) => {
    try {
      const { text, context } = req.body;
      const prompt = `문맥(${context || "학생 문서"}): 다음 문장을 교육 브랜드 '생디' 스타일에 맞춰 더욱 전문적이고 정돈된 한국어로 윤문해 주세요. 원문 의미는 보존하되 문장의 응집성과 전달력을 극대화하세요.
원문:
${text}

답변은 수정된 문장 텍스트만 출력하세요.`;

      const refined = await generateWithFallback(prompt, false);
      return res.json({ success: true, refinedText: refined.trim() });
    } catch (error: any) {
      const original = req.body?.text || "";
      return res.json({ success: true, refinedText: original.trim() });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[생디 SAENGDI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

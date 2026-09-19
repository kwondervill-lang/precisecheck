import { StudentInfo, ActivityPlanData, SpeechData, MonthlyPlan } from '../types';
import { enrichActivityPlan, enrichSpeechData } from './academicEngine';

/**
 * 활동 지원 계획서 AI 내용 심화 및 보강 생성기
 */
export async function generateActivityPlanAI(
  student: StudentInfo,
  activityPlan: ActivityPlanData
): Promise<{
  selfIntro: string;
  motivation: string;
  planContent: string;
  monthlySchedule: MonthlyPlan[];
}> {
  try {
    const res = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, activityPlan }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.selfIntro) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend API request skipped, activating deep academic augmentation engine:', err);
  }

  // 100% Guaranteed High-Academic In-Memory Synthesizer
  const enriched = enrichActivityPlan(student, activityPlan);
  return {
    selfIntro: enriched.selfIntro,
    motivation: enriched.motivation,
    planContent: enriched.planContent,
    monthlySchedule: enriched.monthlySchedule,
  };
}

/**
 * 학생 임원 연설문 AI 내용 심화 및 맞춤형 대본 생성기
 */
export async function generateSpeechAI(
  student: StudentInfo,
  speech: SpeechData
): Promise<{
  catchphrase: string;
  fullSpeech: string;
  deliveryTips: string[];
}> {
  try {
    const res = await fetch('/api/ai/generate-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, speech }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.fullSpeech) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend API request skipped, activating deep speech coaching engine:', err);
  }

  // 100% Guaranteed High-Academic In-Memory Synthesizer
  const enriched = enrichSpeechData(student, speech);
  return {
    catchphrase: enriched.catchphrase || '',
    fullSpeech: enriched.fullSpeech,
    deliveryTips: enriched.deliveryTips,
  };
}

/**
 * 텍스트 윤문 및 전문화
 */
export async function refineTextAI(text: string, context?: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  try {
    const res = await fetch('/api/ai/refine-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, context }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.refinedText) return json.refinedText;
    }
  } catch (err) {
    console.warn('Refine text failed:', err);
  }

  // Fallback cleaner
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

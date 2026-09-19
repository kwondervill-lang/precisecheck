export type SchoolLevel = '초등학교' | '중학교' | '고등학교';

export type DocumentType = '활동 지원 계획서' | '임원 연설문';

export type ActivityCategory = '동아리활동' | '봉사활동' | '프로젝트활동' | '자율활동' | '기타';

export type ActivityItemOption = '자기소개' | '지원 동기' | '활동 계획';

export type SpeechCategory = '학급 회장' | '학생회장' | '동아리회장' | '기타';

export type SpeechAudience = '학급학생들' | '전체학생들';

export interface StudentInfo {
  schoolLevel: SchoolLevel;
  grade: string;
  name: string;
  careerPath: string;
  targetSchool: string;
}

export interface MonthlyPlan {
  month: string;
  title: string;
  detail: string;
}

export interface ActivityPlanData {
  category: ActivityCategory;
  customCategory?: string;
  activityName: string;
  selectedItems: ActivityItemOption[];
  startMonth: string; // YYYY-MM or '3월'
  endMonth: string;   // YYYY-MM or '12월'
  selfIntro: string;
  motivation: string;
  planContent: string;
  monthlySchedule: MonthlyPlan[];
}

export interface SpeechData {
  speechCategory: SpeechCategory;
  customCategory?: string;
  schoolLevel: SchoolLevel;
  audience: SpeechAudience;
  duration: string; // e.g. '2분 내외', '3분 내외'
  pledge1: string;
  pledge2: string;
  pledge3: string;
  pledgeOther: string;
  fullSpeech: string;
  catchphrase?: string;
  deliveryTips: string[];
}

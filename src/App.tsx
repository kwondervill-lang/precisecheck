import React, { useState } from 'react';
import {
  DocumentType,
  StudentInfo,
  ActivityPlanData,
  SpeechData,
} from './types';
import { SaengDiLogo } from './components/SaengDiLogo';
import { StudentInfoForm } from './components/StudentInfoForm';
import { ActivityPlanForm } from './components/ActivityPlanForm';
import { SpeechForm } from './components/SpeechForm';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { SAMPLE_PRESETS, SamplePreset } from './data/sampleTemplates';
import { enrichActivityPlan, enrichSpeechData } from './services/academicEngine';
import {
  FileText,
  Mic,
  Sparkles,
  Printer,
  BookOpen,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ImageIcon,
  Upload,
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [documentType, setDocumentType] = useState<DocumentType>('활동 지원 계획서');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Student Info State (Default: 이윤지 학생)
  const [student, setStudent] = useState<StudentInfo>({
    schoolLevel: '고등학교',
    grade: '2학년',
    name: '이윤지',
    careerPath: '소프트웨어 엔지니어 / AI 연구원',
    targetSchool: '서울대학교 컴퓨터공학부',
  });

  // Activity Plan State (Initialized tailored to 이윤지)
  const [activityPlan, setActivityPlan] = useState<ActivityPlanData>(() =>
    enrichActivityPlan(
      {
        schoolLevel: '고등학교',
        grade: '2학년',
        name: '이윤지',
        careerPath: '소프트웨어 엔지니어 / AI 연구원',
        targetSchool: '서울대학교 컴퓨터공학부',
      },
      {
        category: '동아리활동',
        activityName: '인공지능 윤리 및 알고리즘 탐구 동아리',
        selectedItems: ['자기소개', '지원 동기', '활동 계획'],
        startMonth: '3월',
        endMonth: '12월',
        selfIntro: '',
        motivation: '',
        planContent: '',
        monthlySchedule: [],
      }
    )
  );

  // Speech State (Initialized tailored to 이윤지)
  const [speech, setSpeech] = useState<SpeechData>(() =>
    enrichSpeechData(
      {
        schoolLevel: '고등학교',
        grade: '2학년',
        name: '이윤지',
        careerPath: '소프트웨어 엔지니어 / AI 연구원',
        targetSchool: '서울대학교 컴퓨터공학부',
      },
      {
        speechCategory: '학생회장',
        schoolLevel: '고등학교',
        audience: '전체학생들',
        duration: '3분 내외',
        pledge1: '학생 소리함의 디지털화와 월간 피드백 투명 보고',
        pledge2: '자율학습실 쾌적화 및 시험 기간 힐링 부스 운영',
        pledge3: '학생 주도형 동아리 연합 학술제 및 진로 멘토링 신설',
        pledgeOther: '말이 아닌 실천으로 학생들의 하루를 행복하게 바꾸겠습니다.',
        catchphrase: '',
        fullSpeech: '',
        deliveryTips: [],
      }
    )
  );

  // Custom Logo URL state (persisted in localStorage)
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('saengdi_custom_logo');
    } catch {
      return null;
    }
  });

  const handleCustomLogoChange = (url: string | null) => {
    setCustomLogoUrl(url);
    try {
      if (url) {
        localStorage.setItem('saengdi_custom_logo', url);
        setEnrichNotice('생디 원본 로고 이미지가 프로그램에 성공적으로 반영되었습니다.');
      } else {
        localStorage.removeItem('saengdi_custom_logo');
        setEnrichNotice('생디 기본 공식 벡터 로고로 복원되었습니다.');
      }
      setTimeout(() => setEnrichNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // UI status states
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichNotice, setEnrichNotice] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // 1. Preset loader
  const loadPreset = (preset: SamplePreset) => {
    setStudent({ ...preset.student });
    if (preset.activityPlan) {
      const enriched = enrichActivityPlan(preset.student, preset.activityPlan);
      setActivityPlan(enriched);
      setDocumentType('활동 지원 계획서');
    } else if (preset.speech) {
      const enriched = enrichSpeechData(preset.student, preset.speech);
      setSpeech(enriched);
      setDocumentType('임원 연설문');
    }
    setEnrichNotice(`[${preset.title}] 예시가 성공적으로 적용되었습니다.`);
    setTimeout(() => setEnrichNotice(null), 3000);
  };

  // 2. Comprehensive AI Enrichment & Augmentation
  const handleEnrichAll = () => {
    setIsEnriching(true);
    setTimeout(() => {
      const currentName = student.name?.trim() || '학생';
      const enrichedPlan = enrichActivityPlan(student, activityPlan);
      const enrichedSpeech = enrichSpeechData(student, speech);
      setActivityPlan(enrichedPlan);
      setSpeech(enrichedSpeech);
      setIsEnriching(false);
      setEnrichNotice(
        `'${currentName}' 학생의 인적사항과 진로 목표에 맞춰 리포트 내용이 최적화 및 대폭 보강되었습니다.`
      );
      setTimeout(() => setEnrichNotice(null), 4000);
    }, 450);
  };

  // 3. Document preview generator (automatically enriches so name & profile are 100% synchronized)
  const handleGenerateDocument = () => {
    const enrichedPlan = enrichActivityPlan(student, activityPlan);
    const enrichedSpeech = enrichSpeechData(student, speech);
    setActivityPlan(enrichedPlan);
    setSpeech(enrichedSpeech);
    setActiveTab('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Reset Everything to Start Fresh
  const handleConfirmReset = () => {
    setStudent({
      schoolLevel: '고등학교',
      grade: '1학년',
      name: '',
      careerPath: '',
      targetSchool: '',
    });
    setActivityPlan({
      category: '자율활동',
      activityName: '',
      selectedItems: ['자기소개', '지원 동기', '활동 계획'],
      startMonth: '3월',
      endMonth: '12월',
      selfIntro: '',
      motivation: '',
      planContent: '',
      monthlySchedule: [
        { month: '3~4월', title: '기획 및 기초 연구', detail: '' },
        { month: '5~7월', title: '실행 및 탐구', detail: '' },
        { month: '8~10월', title: '결과물 도출', detail: '' },
        { month: '11~12월', title: '성과 발표 및 나눔', detail: '' },
      ],
    });
    setSpeech({
      speechCategory: '학생회장',
      schoolLevel: '고등학교',
      audience: '전체학생들',
      duration: '3분 내외',
      pledge1: '',
      pledge2: '',
      pledge3: '',
      pledgeOther: '',
      catchphrase: '',
      fullSpeech: '',
      deliveryTips: [],
    });
    setShowResetModal(false);
    setActiveTab('form');
    setEnrichNotice('모든 내용이 초기화되었습니다. 새로운 학생의 정보를 입력하세요.');
    setTimeout(() => setEnrichNotice(null), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateActivityField = (field: string, val: any) => {
    setActivityPlan((prev) => ({ ...prev, [field]: val }));
  };

  const updateSpeechText = (text: string) => {
    setSpeech((prev) => ({ ...prev, fullSpeech: text }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Brand Navigation Header */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group flex items-center">
              <SaengDiLogo size="md" variant="full" customLogoUrl={customLogoUrl} />
              {/* Quick Logo Replace Tooltip / Action on Hover */}
              <label 
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer text-white text-[11px] font-bold gap-1 backdrop-blur-2xs"
                title="클릭하여 원본 로고 이미지(생디로고.png) 업로드"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>로고 변경</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        if (ev.target?.result) {
                          handleCustomLogoChange(ev.target.result as string);
                        }
                      };
                      r.readAsDataURL(f);
                    }
                  }}
                />
              </label>
            </div>

            {customLogoUrl && (
              <button
                type="button"
                onClick={() => handleCustomLogoChange(null)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-rose-50 transition-colors"
                title="기본 공식 벡터 로고로 복원"
              >
                <RotateCcw className="w-3 h-3" />
                <span>로고 복원</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>활동 지원 계획 &amp; 연설문 출력 솔루션</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Sample Presets Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/80 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">추천 예시 불러오기</span>
                <span className="sm:hidden">예시</span>
              </button>

              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2 hidden group-hover:block z-50">
                <p className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  초·중·고 완성 예시
                </p>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors block text-xs"
                  >
                    <span className="font-bold text-slate-900 block truncate">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-teal-600 font-medium">
                      {preset.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI 맞춤 내용 심화 증강 버튼 */}
            <button
              type="button"
              onClick={handleEnrichAll}
              disabled={isEnriching}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-300/80 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="현재 학생의 인적사항에 맞춰 자기소개, 지원동기, 연설문을 최상급으로 심화 증강합니다"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-700 ${isEnriching ? 'animate-spin' : ''}`} />
              <span>{isEnriching ? 'AI 내용 증강 중...' : '✨ AI 맞춤 내용 심화'}</span>
            </button>

            {/* 처음부터 다시 작성하기 버튼 */}
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-all cursor-pointer"
              title="모든 내용을 초기화하고 처음부터 새로 작성합니다"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">처음부터 다시 작성</span>
              <span className="sm:hidden">초기화</span>
            </button>

            {/* View Mode Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'form') {
                  handleGenerateDocument();
                } else {
                  setActiveTab('form');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs'
              }`}
            >
              {activeTab === 'form' ? (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>문서 출력 미리보기</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>입력 화면으로 이동</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {enrichNotice && (
        <div className="no-print fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{enrichNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Brand Banner / Introduction */}
        <div className="no-print mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
            <SaengDiLogo size="xl" variant="symbol" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-teal-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>생디(SAENGDI) 브랜드 공식 학생 활동 지원 솔루션</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              학생 맞춤형 활동 지원 계획서 &amp; 임원 연설문
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              학생의 인적사항(성명: <span className="text-teal-300 font-bold">{student.name || '미입력'}</span>, 진로: <span className="text-teal-300 font-bold">{student.careerPath || '미입력'}</span>)과 희망 목표에 완벽히 부합하도록
              내용을 풍부하게 보강·창작하여 공식 공문서 양식 및 당선 연설문으로 즉시 출력합니다.
            </p>
          </div>
        </div>

        {/* Document Classification Selector (문서 분류 선택) */}
        <div className="no-print mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
                문서 분류 선택
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                작성하고자 하는 문서 종류를 선택하세요
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              선택한 문서에 맞추어 전용 작성 서식이 표시됩니다
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: 활동 지원 계획서 */}
            <button
              type="button"
              onClick={() => {
                setDocumentType('활동 지원 계획서');
              }}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                documentType === '활동 지원 계획서'
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      documentType === '활동 지원 계획서'
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      활동 지원 계획서
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      동아리활동, 봉사활동, 프로젝트활동, 자율활동 지원서
                    </p>
                  </div>
                </div>
                {documentType === '활동 지원 계획서' && (
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    선택됨
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">포함 항목:</span>
                <span>학생 인적사항 · 자기소개 · 지원 동기 · 월별 세부 추진 일정</span>
              </div>
            </button>

            {/* Option 2: 임원 연설문 */}
            <button
              type="button"
              onClick={() => {
                setDocumentType('임원 연설문');
              }}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                documentType === '임원 연설문'
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      documentType === '임원 연설문'
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      임원 연설문
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      학생회장, 부회장, 학급회장, 동아리회장 출마 발표 대본
                    </p>
                  </div>
                </div>
                {documentType === '임원 연설문' && (
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    선택됨
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">포함 항목:</span>
                <span>후보자 성명 · 연설 대상 · 분량(1~5분) · 3대 공약 · 낭독 연출 가이드</span>
              </div>
            </button>
          </div>
        </div>

        {/* View Switcher: Form Mode vs Preview Mode */}
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step 1: Student Information Form */}
            <div className="lg:col-span-5 space-y-6">
              <StudentInfoForm student={student} onChange={setStudent} />

              <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>생디의 지능형 학생 맞춤 보강 안내</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  성명(<strong className="text-slate-900">{student.name || '미입력'}</strong>), 학교급, 희망 진로 및 목표 학교가 계획서와 연설문의 모든 문장과 공약에 실시간 반영되며, [AI 맞춤 내용 심화] 버튼을 통해 더욱 풍부한 내용으로 자동 창작됩니다.
                </p>
              </div>
            </div>

            {/* Step 2: Document Specific Form */}
            <div className="lg:col-span-7">
              {documentType === '활동 지원 계획서' ? (
                <ActivityPlanForm
                  student={student}
                  activityPlan={activityPlan}
                  onChange={setActivityPlan}
                  onGenerateDocument={handleGenerateDocument}
                />
              ) : (
                <SpeechForm
                  student={student}
                  speech={speech}
                  onChange={setSpeech}
                  onGenerateDocument={handleGenerateDocument}
                />
              )}
            </div>
          </div>
        ) : (
          /* Preview Mode with Toolbar & High Quality Document */
          <div className="space-y-6">
            <DocumentViewerModal
              documentType={documentType}
              student={student}
              activityPlan={activityPlan}
              speech={speech}
              customLogoUrl={customLogoUrl}
              onCustomLogoChange={handleCustomLogoChange}
              onUpdateActivityField={updateActivityField}
              onUpdateSpeechText={updateSpeechText}
              onEnrichWithAI={handleEnrichAll}
              isEnriching={isEnriching}
              onResetAll={() => setShowResetModal(true)}
            />
          </div>
        )}
      </main>

      {/* Confirmation Modal for Resetting to Start Fresh */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  처음부터 다시 작성하시겠습니까?
                </h3>
                <span className="text-xs text-slate-500">신규 학생 문서 작성 시작</span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
              현재 입력된 학생 정보(<strong className="text-slate-800">{student.name || '학생'}</strong>)와 작성 중인 활동 지원서 및 연설문 내용이 모두 초기화되고 깨끗한 새 양식으로 시작됩니다. 계속하시겠습니까?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화하고 새로 작성</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <SaengDiLogo size="sm" variant="symbol" customLogoUrl={customLogoUrl} />
            <div>
              <p className="font-bold text-slate-800">
                생디 (SAENGDI) · 학생 활동 지원 계획 시스템
              </p>
              <p className="text-[11px] text-slate-400">
                학생부·활동 설계 및 연설문 표준 양식 출력 플랫폼
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>공문서 표준 서식 준수</span>
            <span>A4 인쇄 최적화</span>
            <span>HTML &amp; PDF 다운로드 지원</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

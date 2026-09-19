import React, { useState } from 'react';
import { SpeechData, SpeechCategory, SpeechAudience, SchoolLevel, StudentInfo } from '../types';
import { Mic, Users, Clock, CheckCircle2, Sparkles, Loader2, ArrowRight, Award } from 'lucide-react';
import { generateSpeechAI } from '../services/aiService';

interface SpeechFormProps {
  student: StudentInfo;
  speech: SpeechData;
  onChange: (updated: SpeechData) => void;
  onGenerateDocument: () => void;
}

const SPEECH_CATEGORIES: SpeechCategory[] = ['학급 회장', '학생회장', '동아리회장', '기타'];
const AUDIENCE_OPTIONS: { key: SpeechAudience; label: string; desc: string }[] = [
  { key: '학급학생들', label: '학급 학생들', desc: '우리 반 친구들 대상 (친근하고 따뜻한 어조)' },
  { key: '전체학생들', label: '전체 학생들', desc: '전교생 대상 (당차고 설득력 있는 리더십 어조)' },
];

const DURATION_PRESETS = ['1분 내외', '2분 내외', '3분 내외', '5분 내외'];

export const SpeechForm: React.FC<SpeechFormProps> = ({
  student,
  speech,
  onChange,
  onGenerateDocument,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIAutoFill = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateSpeechAI(student, speech);
      onChange({
        ...speech,
        catchphrase: generated.catchphrase || speech.catchphrase,
        fullSpeech: generated.fullSpeech || speech.fullSpeech,
        deliveryTips: generated.deliveryTips && generated.deliveryTips.length > 0
          ? generated.deliveryTips
          : speech.deliveryTips,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="speech-form" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              2. 임원 연설문 상세 설정
            </h2>
            <p className="text-xs text-slate-500">
              출마 직책, 연설 대상, 말하기 분량 및 3대 핵심 공약을 설정하세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAIAutoFill}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          )}
          <span>생디 AI 맞춤 연설문 대본 완성</span>
        </button>
      </div>

      {/* 1. 연설문의 분류 */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          연설문 분류 선택 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SPEECH_CATEGORIES.map((cat) => {
            const isSelected = speech.speechCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...speech, speechCategory: cat })}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {speech.speechCategory === '기타' && (
          <input
            type="text"
            placeholder="기타 임원 직책을 입력하세요 (예: 학년 부회장, 학술부장)"
            value={speech.customCategory || ''}
            onChange={(e) => onChange({ ...speech, customCategory: e.target.value })}
            className="mt-2.5 w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20"
          />
        )}
      </div>

      {/* 2. 대상 선택: 학교급 (초/중/고) + 청중 (학급학생들 / 전체학생들) */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            연설 대상: 학교급 선택 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['초등학교', '중학교', '고등학교'] as SchoolLevel[]).map((lvl) => {
              const isSelected = speech.schoolLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChange({ ...speech, schoolLevel: lvl })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            연설 청중 선택 (학급 학생들 / 전체 학생들) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AUDIENCE_OPTIONS.map((opt) => {
              const isSelected = speech.audience === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onChange({ ...speech, audience: opt.key })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500/50'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 말하기 분량 (OO분 내외) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          말하기 분량 (OO분 내외) <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DURATION_PRESETS.map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => onChange({ ...speech, duration: dur })}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                speech.duration === dur
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="직접 입력 (예: 2분 30초 내외, 3분 내외)"
          value={speech.duration}
          onChange={(e) => onChange({ ...speech, duration: e.target.value })}
          className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          일반적으로 1분당 약 300~350자 내외로 낭독할 때 청중에게 가장 명확히 전달됩니다.
        </p>
      </div>

      {/* 4. 공약 1, 공약 2, 공약 3, 기타 */}
      <div className="space-y-3.5">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-teal-600" />
          후보 공약 입력 (공약1, 공약2, 공약3, 기타) <span className="text-red-500">*</span>
        </label>

        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            공약 1 <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            placeholder="예: 소통하는 온라인·오프라인 건의함 개설 및 매월 피드백 보고"
            value={speech.pledge1}
            onChange={(e) => onChange({ ...speech, pledge1: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white"
          />
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            공약 2 <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            placeholder="예: 깨끗하고 쾌적한 교실 환경 및 편의 물품 구비"
            value={speech.pledge2}
            onChange={(e) => onChange({ ...speech, pledge2: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white"
          />
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            공약 3 <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            placeholder="예: 모두가 소외되지 않고 즐거운 학급 이벤트 및 멘토링 운영"
            value={speech.pledge3}
            onChange={(e) => onChange({ ...speech, pledge3: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white"
          />
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            기타 공약 및 다짐
          </span>
          <input
            type="text"
            placeholder="예: 말뿐이 아닌 행동으로 먼저 실천하는 솔선수범의 리더십"
            value={speech.pledgeOther}
            onChange={(e) => onChange({ ...speech, pledgeOther: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white"
          />
        </div>
      </div>

      {/* 캐치프레이즈 & 연설문 본문 미리보기/수정 */}
      <div className="space-y-3 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            슬로건 / 캐치프레이즈 (선택)
          </label>
          <input
            type="text"
            placeholder="예: 여러분의 1분을 가장 보람찬 1년으로 바꾸겠습니다!"
            value={speech.catchphrase || ''}
            onChange={(e) => onChange({ ...speech, catchphrase: e.target.value })}
            className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white text-teal-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>발표 연설문 본문 (직접 수정 가능)</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {speech.fullSpeech.length}자 ({speech.duration})
            </span>
          </label>
          <textarea
            rows={8}
            placeholder="'생디 AI 맞춤 연설문 대본 완성' 버튼을 누르거나 직접 연설문을 입력하세요."
            value={speech.fullSpeech}
            onChange={(e) => onChange({ ...speech, fullSpeech: e.target.value })}
            className="w-full p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed border border-slate-200 bg-white font-sans focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* 완료 및 발표 연설문 출력 버튼 */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onGenerateDocument}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>생디 학생 발표 연설문 출력 및 미리보기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

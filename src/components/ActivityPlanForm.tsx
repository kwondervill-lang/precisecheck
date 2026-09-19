import React, { useState } from 'react';
import { ActivityPlanData, ActivityCategory, ActivityItemOption, StudentInfo } from '../types';
import { FileText, Calendar, CheckSquare, Sparkles, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { generateActivityPlanAI } from '../services/aiService';

interface ActivityPlanFormProps {
  student: StudentInfo;
  activityPlan: ActivityPlanData;
  onChange: (updated: ActivityPlanData) => void;
  onGenerateDocument: () => void;
}

const CATEGORIES: ActivityCategory[] = ['동아리활동', '봉사활동', '프로젝트활동', '기타'];
const ITEM_OPTIONS: ActivityItemOption[] = ['자기소개', '지원 동기', '활동 계획'];
const MONTHS = [
  '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '다음해 1월', '다음해 2월'
];

export const ActivityPlanForm: React.FC<ActivityPlanFormProps> = ({
  student,
  activityPlan,
  onChange,
  onGenerateDocument,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleItem = (item: ActivityItemOption) => {
    let next: ActivityItemOption[];
    if (activityPlan.selectedItems.includes(item)) {
      if (activityPlan.selectedItems.length === 1) return; // Keep at least one
      next = activityPlan.selectedItems.filter((i) => i !== item);
    } else {
      next = [...activityPlan.selectedItems, item];
    }
    onChange({ ...activityPlan, selectedItems: next });
  };

  const handleAIAutoFill = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateActivityPlanAI(student, activityPlan);
      onChange({
        ...activityPlan,
        selfIntro: generated.selfIntro || activityPlan.selfIntro,
        motivation: generated.motivation || activityPlan.motivation,
        planContent: generated.planContent || activityPlan.planContent,
        monthlySchedule: generated.monthlySchedule && generated.monthlySchedule.length > 0
          ? generated.monthlySchedule
          : activityPlan.monthlySchedule,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addMonthlyPlan = () => {
    onChange({
      ...activityPlan,
      monthlySchedule: [
        ...activityPlan.monthlySchedule,
        { month: '활동 기간', title: '세부 계획', detail: '실행 내용 및 목표' },
      ],
    });
  };

  const updateMonthlyPlan = (index: number, field: 'month' | 'title' | 'detail', value: string) => {
    const next = [...activityPlan.monthlySchedule];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...activityPlan, monthlySchedule: next });
  };

  const removeMonthlyPlan = (index: number) => {
    const next = activityPlan.monthlySchedule.filter((_, i) => i !== index);
    onChange({ ...activityPlan, monthlySchedule: next });
  };

  return (
    <div id="activity-plan-form" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              2. 활동 지원 계획서 세부 정보
            </h2>
            <p className="text-xs text-slate-500">
              프로젝트 활동 분류, 활동 이름, 기록 항목 및 활동 기간을 설정하세요.
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
          <span>생디 AI 맞춤 초안 완성</span>
        </button>
      </div>

      {/* 프로젝트 활동의 분류 */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          프로젝트 활동 분류 선택 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = activityPlan.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...activityPlan, category: cat })}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {activityPlan.category === '기타' && (
          <input
            type="text"
            placeholder="기타 활동 분류를 직접 입력하세요 (예: 자율동아리, 학술연구회)"
            value={activityPlan.customCategory || ''}
            onChange={(e) => onChange({ ...activityPlan, customCategory: e.target.value })}
            className="mt-2.5 w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        )}
      </div>

      {/* 활동의 이름 */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          활동의 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="예: 생성형 AI 윤리 및 알고리즘 탐구 동아리, 소외계층 디지털 코딩 교육 봉사"
          value={activityPlan.activityName}
          onChange={(e) => onChange({ ...activityPlan, activityName: e.target.value })}
          className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
        />
      </div>

      {/* 내용을 기록할 항목 선택 */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
          <span>
            내용을 기록할 항목 선택 (복수 선택) <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-slate-500">선택된 항목만 지원서 양식에 포함됩니다</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {ITEM_OPTIONS.map((item) => {
            const isChecked = activityPlan.selectedItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                  isChecked
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 활동 계획 기간: 몇 월부터 몇 월까지 인지 */}
      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
        <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          활동 계획 기간 (몇 월부터 몇 월까지) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <span className="text-[11px] text-slate-500 block mb-1 font-medium">시작 월</span>
            <select
              value={activityPlan.startMonth}
              onChange={(e) => onChange({ ...activityPlan, startMonth: e.target.value })}
              className="w-full py-2 px-3 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}부터
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block mb-1 font-medium">종료 월</span>
            <select
              value={activityPlan.endMonth}
              onChange={(e) => onChange({ ...activityPlan, endMonth: e.target.value })}
              className="w-full py-2 px-3 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}까지
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          선택 기간: <span className="font-semibold text-teal-700">{activityPlan.startMonth}부터 {activityPlan.endMonth}까지</span>
        </p>
      </div>

      {/* 선택된 각 항목별 세부 텍스트 입력창 */}
      <div className="space-y-4 pt-2">
        {activityPlan.selectedItems.includes('자기소개') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>[자기소개] 자신의 강점, 가치관 및 역량</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {activityPlan.selfIntro.length}자
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="학생의 성격, 학업적 관심사, 팀워크 및 책임감에 대해 서술하세요."
              value={activityPlan.selfIntro}
              onChange={(e) => onChange({ ...activityPlan, selfIntro: e.target.value })}
              className="w-full p-3 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
            />
          </div>
        )}

        {activityPlan.selectedItems.includes('지원 동기') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>[지원 동기] 활동 참여 계기 및 목표</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {activityPlan.motivation.length}자
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="왜 이 활동에 지원하게 되었는지, 진로와 연계하여 달성하고자 하는 목표를 서술하세요."
              value={activityPlan.motivation}
              onChange={(e) => onChange({ ...activityPlan, motivation: e.target.value })}
              className="w-full p-3 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
            />
          </div>
        )}

        {activityPlan.selectedItems.includes('활동 계획') && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>[활동 계획] 활동 총괄 개요 및 산출물 목표</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {activityPlan.planContent.length}자
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="활동 기간 동안의 전체적인 실행 계획과 최종 산출물(보고서, 전시, 발표 등)을 작성하세요."
                value={activityPlan.planContent}
                onChange={(e) => onChange({ ...activityPlan, planContent: e.target.value })}
                className="w-full p-3 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>

            {/* 단계별/월별 세부 계획 일정표 */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-800">
                  월별 / 단계별 추진 일정표
                </span>
                <button
                  type="button"
                  onClick={addMonthlyPlan}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  일정 단계 추가
                </button>
              </div>

              <div className="space-y-2">
                {activityPlan.monthlySchedule.map((plan, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="기간 (예: 3~4월)"
                        value={plan.month}
                        onChange={(e) => updateMonthlyPlan(idx, 'month', e.target.value)}
                        className="w-full text-xs font-semibold py-1.5 px-2 rounded border border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="단계명 (예: 기초 문헌 분석)"
                        value={plan.title}
                        onChange={(e) => updateMonthlyPlan(idx, 'title', e.target.value)}
                        className="w-full text-xs py-1.5 px-2 rounded border border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="상세 내용"
                        value={plan.detail}
                        onChange={(e) => updateMonthlyPlan(idx, 'detail', e.target.value)}
                        className="w-full text-xs py-1.5 px-2 rounded border border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right sm:text-center">
                      <button
                        type="button"
                        onClick={() => removeMonthlyPlan(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 완료 및 지원서 출력 버튼 */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onGenerateDocument}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>생디 활동 지원 계획서 출력 및 미리보기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

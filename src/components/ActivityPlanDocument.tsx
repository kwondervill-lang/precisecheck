import React from 'react';
import { StudentInfo, ActivityPlanData } from '../types';
import { SaengDiLogo } from './SaengDiLogo';
import { CheckCircle } from 'lucide-react';

interface ActivityPlanDocumentProps {
  student: StudentInfo;
  activityPlan: ActivityPlanData;
  customLogoUrl?: string | null;
  isEditable?: boolean;
  onUpdateField?: (field: string, val: any) => void;
}

export const ActivityPlanDocument: React.FC<ActivityPlanDocumentProps> = ({
  student,
  activityPlan,
  customLogoUrl,
  isEditable = false,
  onUpdateField,
}) => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const categoryName =
    activityPlan.category === '기타' && activityPlan.customCategory
      ? `${activityPlan.category} (${activityPlan.customCategory})`
      : activityPlan.category;

  return (
    <div
      id="printable-activity-document"
      className="bg-white text-slate-900 mx-auto max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full font-sans transition-all relative"
    >
      {/* Document Official Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900 mb-7">
        <SaengDiLogo size="md" variant="document" customLogoUrl={customLogoUrl} />
        <div className="text-right">
          <span className="text-[10px] tracking-wider font-bold text-slate-400 uppercase block">
            Official Document
          </span>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            문서번호: SD-{today.getFullYear()}-{String(today.getMonth() + 1).padStart(2, '0')}-082
          </span>
        </div>
      </div>

      {/* Main Document Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          학 생 활 동 지 원 계 획 서
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          [ {categoryName} · {student.schoolLevel} {student.grade} ]
        </p>
      </div>

      {/* 1. 학생 기본 인적사항 표 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-4 bg-teal-600 rounded-xs" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            1. 신청 학생 기본 인적사항
          </h2>
        </div>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                소속 학교급
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-medium text-slate-800">
                {student.schoolLevel || '-'}
              </td>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                학년 / 성명
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-bold text-slate-900">
                {student.grade || '-'} / {student.name || '미입력'}
              </td>
            </tr>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 text-slate-700 font-bold text-center">
                희망 진로
              </th>
              <td className="border border-slate-300 p-2.5 font-medium text-slate-800">
                {student.careerPath || '미입력'}
              </td>
              <th className="bg-slate-100 border border-slate-300 p-2.5 text-slate-700 font-bold text-center">
                목표 학교·학과
              </th>
              <td className="border border-slate-300 p-2.5 font-medium text-slate-800">
                {student.targetSchool || '미입력'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 신청 활동 개요 표 */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-4 bg-sky-600 rounded-xs" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            2. 지원 활동 개요
          </h2>
        </div>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                활동 분류
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-semibold text-slate-800">
                {categoryName}
              </td>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                활동 기간
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-semibold text-teal-800">
                {activityPlan.startMonth}부터 {activityPlan.endMonth}까지
              </td>
            </tr>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 text-slate-700 font-bold text-center">
                활동 명칭
              </th>
              <td colSpan={3} className="border border-slate-300 p-2.5 font-bold text-slate-900">
                {activityPlan.activityName || '활동 명칭 미입력'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. 본문 세부 내용 섹션 */}
      <div className="space-y-6 mb-8">
        {/* 자기소개 */}
        {activityPlan.selectedItems.includes('자기소개') && (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                자기소개 (핵심 역량 및 인성)
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">항목 1</span>
            </div>
            {isEditable ? (
              <textarea
                rows={4}
                value={activityPlan.selfIntro}
                onChange={(e) => onUpdateField && onUpdateField('selfIntro', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded text-xs leading-relaxed"
              />
            ) : (
              <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 text-xs sm:text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                {activityPlan.selfIntro || '자기소개 내용이 입력되지 않았습니다.'}
              </div>
            )}
          </div>
        )}

        {/* 지원 동기 */}
        {activityPlan.selectedItems.includes('지원 동기') && (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                지원 동기 (진로 연계 및 문제의식)
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">항목 2</span>
            </div>
            {isEditable ? (
              <textarea
                rows={4}
                value={activityPlan.motivation}
                onChange={(e) => onUpdateField && onUpdateField('motivation', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded text-xs leading-relaxed"
              />
            ) : (
              <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 text-xs sm:text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                {activityPlan.motivation || '지원 동기 내용이 입력되지 않았습니다.'}
              </div>
            )}
          </div>
        )}

        {/* 활동 계획 */}
        {activityPlan.selectedItems.includes('활동 계획') && (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                활동 계획 (총괄 목표 및 추진 일정)
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">항목 3</span>
            </div>

            {isEditable ? (
              <textarea
                rows={3}
                value={activityPlan.planContent}
                onChange={(e) => onUpdateField && onUpdateField('planContent', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded text-xs leading-relaxed mb-3"
              />
            ) : (
              <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 text-xs sm:text-[13px] leading-relaxed text-slate-800 mb-3 whitespace-pre-wrap">
                {activityPlan.planContent || '총괄 활동 계획이 입력되지 않았습니다.'}
              </div>
            )}

            {/* 월별 일정표 */}
            {activityPlan.monthlySchedule && activityPlan.monthlySchedule.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-300 p-2 w-1/5 text-center font-bold">
                        추진 기간
                      </th>
                      <th className="border border-slate-300 p-2 w-2/5 text-center font-bold">
                        주요 활동 및 단계
                      </th>
                      <th className="border border-slate-300 p-2 w-2/5 text-center font-bold">
                        세부 내용 및 산출물
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityPlan.monthlySchedule.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="border border-slate-300 p-2 text-center font-semibold text-teal-800">
                          {row.month}
                        </td>
                        <td className="border border-slate-300 p-2 font-medium text-slate-900">
                          {row.title}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {row.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 제출 확인문 및 서명란 */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center space-y-4">
        <p className="text-xs sm:text-sm font-semibold text-slate-800">
          본인은 위와 같이 성실하게 계획을 수립하고 실천하고자 활동 지원 계획서를 제출합니다.
        </p>

        <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-wider">
          {dateStr}
        </p>

        <div className="flex items-center justify-end gap-6 pt-2 pr-4 text-xs sm:text-sm font-bold text-slate-900">
          <span>신청자 (학생) :</span>
          <span className="min-w-[70px] text-right font-black">{student.name || '홍 길 동'}</span>
          <span className="w-10 h-10 rounded-full border-2 border-dashed border-red-400 text-red-500 flex items-center justify-center text-[10px] select-none font-bold">
            (서명)
          </span>
        </div>
      </div>

      {/* Footer Verified Brand Mark */}
      <div className="mt-12 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold text-teal-700">생디 (SAENGDI) 학생기록부 및 활동 디자인</span>
        <span>공문서 표준 규격 인증 양식 v2.4</span>
      </div>
    </div>
  );
};

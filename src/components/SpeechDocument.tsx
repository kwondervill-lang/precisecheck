import React from 'react';
import { StudentInfo, SpeechData } from '../types';
import { SaengDiLogo } from './SaengDiLogo';
import { Mic, Clock, Users, Award, Lightbulb } from 'lucide-react';

interface SpeechDocumentProps {
  student: StudentInfo;
  speech: SpeechData;
  customLogoUrl?: string | null;
  isEditable?: boolean;
  onUpdateSpeechText?: (text: string) => void;
}

export const SpeechDocument: React.FC<SpeechDocumentProps> = ({
  student,
  speech,
  customLogoUrl,
  isEditable = false,
  onUpdateSpeechText,
}) => {
  const roleTitle =
    speech.speechCategory === '기타' && speech.customCategory
      ? speech.customCategory
      : speech.speechCategory;

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div
      id="printable-speech-document"
      className="bg-white text-slate-900 mx-auto max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full font-sans transition-all relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900 mb-7">
        <SaengDiLogo size="md" variant="document" customLogoUrl={customLogoUrl} />
        <div className="text-right">
          <span className="text-[10px] tracking-wider font-bold text-slate-400 uppercase block">
            Speech Script
          </span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            {speech.duration || '3분 내외'} 대본
          </span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-white mb-2">
          {speech.schoolLevel} · {speech.audience}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {roleTitle} 출마 당선 발표 연설문
        </h1>
        {speech.catchphrase && (
          <p className="text-sm font-bold text-teal-700 mt-2 bg-teal-50 py-1 px-4 rounded-lg inline-block border border-teal-200/60">
            "{speech.catchphrase}"
          </p>
        )}
      </div>

      {/* Overview Metadata Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                후보자 정보
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-bold text-slate-900">
                {student.schoolLevel} {student.grade} {student.name || '후보'}
              </td>
              <th className="bg-slate-100 border border-slate-300 p-2.5 w-1/6 text-slate-700 font-bold text-center">
                연설 대상 / 분량
              </th>
              <td className="border border-slate-300 p-2.5 w-2/6 font-semibold text-slate-800">
                {speech.audience} / {speech.duration}
              </td>
            </tr>
            <tr>
              <th className="bg-slate-100 border border-slate-300 p-2.5 text-slate-700 font-bold text-center">
                출마 직책
              </th>
              <td className="border border-slate-300 p-2.5 font-bold text-teal-800">
                {roleTitle}
              </td>
              <th className="bg-slate-100 border border-slate-300 p-2.5 text-slate-700 font-bold text-center">
                희망 진로
              </th>
              <td className="border border-slate-300 p-2.5 font-medium text-slate-800">
                {student.careerPath || '미입력'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3대 핵심 공약 요약 카드 */}
      <div className="mb-7 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-teal-600" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            후보자의 핵심 공약 요약 (3대 약속 + α)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs mb-2">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="font-extrabold text-teal-700 block mb-1">약속 1.</span>
            <p className="text-slate-800 leading-snug font-medium">
              {speech.pledge1 || '공약 1 미입력'}
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="font-extrabold text-teal-700 block mb-1">약속 2.</span>
            <p className="text-slate-800 leading-snug font-medium">
              {speech.pledge2 || '공약 2 미입력'}
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="font-extrabold text-teal-700 block mb-1">약속 3.</span>
            <p className="text-slate-800 leading-snug font-medium">
              {speech.pledge3 || '공약 3 미입력'}
            </p>
          </div>
        </div>
        {speech.pledgeOther && (
          <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-600 mr-2">기타 실천 다짐:</span>
            <span className="text-slate-800">{speech.pledgeOther}</span>
          </div>
        )}
      </div>

      {/* Full Speech Script */}
      <div className="mb-8">
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              발표 연설문 전문 (대본)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            ※ [강조], [숨고르기] 등 표시는 낭독 연출 가이드입니다
          </span>
        </div>

        {isEditable ? (
          <textarea
            rows={14}
            value={speech.fullSpeech}
            onChange={(e) => onUpdateSpeechText && onUpdateSpeechText(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-lg text-xs sm:text-[13px] leading-relaxed font-sans"
          />
        ) : (
          <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-200 text-xs sm:text-[13.5px] leading-loose text-slate-900 whitespace-pre-wrap font-sans">
            {speech.fullSpeech.split('\n').map((para, pIdx) => {
              if (!para.trim()) return <br key={pIdx} />;
              // Highlight tags like [강조], [숨고르기], [시선 맞추기], [미소]
              const parts = para.split(/(\[[^\]]+\])/g);
              return (
                <p key={pIdx} className="mb-3">
                  {parts.map((segment, sIdx) => {
                    if (segment.startsWith('[') && segment.endsWith(']')) {
                      return (
                        <span
                          key={sIdx}
                          className="mx-1 px-1.5 py-0.5 text-[11px] font-bold text-teal-700 bg-teal-100/70 rounded border border-teal-300/60 print:bg-slate-200 print:text-black"
                        >
                          {segment}
                        </span>
                      );
                    }
                    return segment;
                  })}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* 스피치 리허설 및 딜리버리 가이드 */}
      {speech.deliveryTips && speech.deliveryTips.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
          <div className="flex items-center gap-1.5 mb-2 text-amber-900 font-bold text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>생디 스피치 코칭: 성공적인 연설을 위한 발표 팁</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-950 font-medium">
            {speech.deliveryTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-200/80 text-amber-800 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold text-teal-700">생디 (SAENGDI) 학생기록부 및 활동 디자인</span>
        <span>학생 임원 선거 공식 스피치 양식</span>
      </div>
    </div>
  );
};

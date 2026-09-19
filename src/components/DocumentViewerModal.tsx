import React, { useState } from 'react';
import { DocumentType, StudentInfo, ActivityPlanData, SpeechData } from '../types';
import { ActivityPlanDocument } from './ActivityPlanDocument';
import { SpeechDocument } from './SpeechDocument';
import {
  Printer,
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  FileCode,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';

interface DocumentViewerModalProps {
  documentType: DocumentType;
  student: StudentInfo;
  activityPlan: ActivityPlanData;
  speech: SpeechData;
  customLogoUrl: string | null;
  onCustomLogoChange: (url: string | null) => void;
  onUpdateActivityField: (field: string, val: any) => void;
  onUpdateSpeechText: (text: string) => void;
  onEnrichWithAI?: () => void;
  isEnriching?: boolean;
  onResetAll?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documentType,
  student,
  activityPlan,
  speech,
  customLogoUrl,
  onCustomLogoChange,
  onUpdateActivityField,
  onUpdateSpeechText,
  onEnrichWithAI,
  isEnriching = false,
  onResetAll,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHtmlCode, setShowHtmlCode] = useState(false);

  // 1. Trigger native high-quality PDF print
  const handlePrint = () => {
    window.print();
  };

  // 2. Export Standalone HTML File
  const handleDownloadHtml = () => {
    const targetElementId =
      documentType === '활동 지원 계획서'
        ? 'printable-activity-document'
        : 'printable-speech-document';

    const element = document.getElementById(targetElementId);
    if (!element) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentType} - 생디(SAENGDI)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
  <style>
    body { font-family: Pretendard, sans-serif; background-color: #f8fafc; padding: 24px; margin: 0; }
    @media print {
      body { background: white !important; padding: 0 !important; }
      @page { size: A4; margin: 15mm; }
    }
  </style>
</head>
<body>
  <div style="max-width: 210mm; margin: 0 auto;">
    ${element.outerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${student.name || '학생'}_생디_${documentType.replace(/\s+/g, '_')}.html`;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Copy Text to Clipboard
  const handleCopyText = async () => {
    let content = '';
    if (documentType === '활동 지원 계획서') {
      content = `[생디 - 활동 지원 계획서]
■ 기본 인적사항
- 소속: ${student.schoolLevel} ${student.grade}
- 성명: ${student.name}
- 희망 진로: ${student.careerPath}
- 목표 학교/학과: ${student.targetSchool}

■ 지원 활동 개요
- 분류: ${activityPlan.category}
- 명칭: ${activityPlan.activityName}
- 기간: ${activityPlan.startMonth}부터 ${activityPlan.endMonth}까지

■ 세부 내용
[자기소개]
${activityPlan.selfIntro}

[지원 동기]
${activityPlan.motivation}

[활동 계획]
${activityPlan.planContent}
`;
    } else {
      content = `[생디 - 임원 연설문]
■ 후보자: ${student.schoolLevel} ${student.grade} ${student.name}
■ 직책: ${speech.speechCategory} (${speech.schoolLevel} / ${speech.audience})
■ 분량: ${speech.duration}
■ 슬로건: ${speech.catchphrase || ''}

■ 핵심 공약
1. ${speech.pledge1}
2. ${speech.pledge2}
3. ${speech.pledge3}
${speech.pledgeOther ? `기타: ${speech.pledgeOther}` : ''}

■ 연설문 전문
${speech.fullSpeech}
`;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCustomLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Document Action Bar */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            {documentType} 출력 양식
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            A4 표준 규격
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI 내용 심화 보강 버튼 */}
          {onEnrichWithAI && (
            <button
              type="button"
              onClick={onEnrichWithAI}
              disabled={isEnriching}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-300/80 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              title="학생 인적사항(이름, 학교급, 진로 목표)을 분석하여 최적화된 내용으로 즉시 심화 보강합니다"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-700 ${isEnriching ? 'animate-spin' : ''}`} />
              <span>{isEnriching ? 'AI 내용 증강 중...' : '✨ AI 맞춤 내용 심화 증강'}</span>
            </button>
          )}

          {/* Direct Editing Toggle */}
          <button
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isEditable
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isEditable ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditable ? '수정 완료 (미리보기)' : '문서 직접 수정'}</span>
          </button>

          {/* HTML 보기 / 코드 토글 */}
          <button
            type="button"
            onClick={() => setShowHtmlCode(!showHtmlCode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>{showHtmlCode ? '서식 보기' : 'HTML 소스 보기'}</span>
          </button>

          {/* Copy Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-teal-700 font-bold">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>텍스트 복사</span>
              </>
            )}
          </button>

          {/* HTML Download */}
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML 저장</span>
          </button>

          {/* Print / PDF Download */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF 다운로드 / 인쇄</span>
          </button>

          {/* 처음부터 다시 작성 */}
          {onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
              title="모든 내용을 초기화하고 처음부터 새로 작성합니다"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>처음부터 다시 작성</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Bar: Logo Setting & Print Notice */}
      <div className="no-print bg-slate-100/80 px-4 py-2.5 rounded-xl text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
            생디 로고:
          </span>
          {customLogoUrl ? (
            <span className="inline-flex items-center gap-1 text-teal-800 font-bold bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              첨부 원본 로고(생디로고.png) 적용 중
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              생디(SAENGDI) 정밀 벡터 로고 기본 적용
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs cursor-pointer text-slate-800 hover:text-teal-700 font-bold text-[11px] transition-colors">
            <Upload className="w-3 h-3 text-teal-600" />
            <span>원본 로고 파일 불러오기 (생디로고.png)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </label>
          {customLogoUrl && (
            <button
              type="button"
              onClick={() => onCustomLogoChange(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 font-medium text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>기본 로고 복원</span>
            </button>
          )}
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            인쇄 시 '배경 그래픽 포함' 옵션을 켜면 색상이 원본 그대로 선명하게 출력됩니다.
          </span>
        </div>
      </div>

      {/* HTML Source Code View Mode */}
      {showHtmlCode ? (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-[650px] leading-relaxed">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-teal-400 font-bold font-sans">
              HTML 원본 소스 미리보기
            </span>
            <button
              onClick={() => setShowHtmlCode(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded"
            >
              서식 화면으로 돌아가기
            </button>
          </div>
          <pre className="whitespace-pre-wrap">
            {documentType === '활동 지원 계획서'
              ? document.getElementById('printable-activity-document')?.outerHTML
              : document.getElementById('printable-speech-document')?.outerHTML}
          </pre>
        </div>
      ) : (
        /* Document Canvas Preview */
        <div className="print-container overflow-x-auto py-2">
          {documentType === '활동 지원 계획서' ? (
            <ActivityPlanDocument
              student={student}
              activityPlan={activityPlan}
              customLogoUrl={customLogoUrl}
              isEditable={isEditable}
              onUpdateField={onUpdateActivityField}
            />
          ) : (
            <SpeechDocument
              student={student}
              speech={speech}
              customLogoUrl={customLogoUrl}
              isEditable={isEditable}
              onUpdateSpeechText={onUpdateSpeechText}
            />
          )}
        </div>
      )}
    </div>
  );
};

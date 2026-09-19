import React from 'react';
import { StudentInfo, SchoolLevel } from '../types';
import { User, School, Compass, GraduationCap, Sparkles } from 'lucide-react';

interface StudentInfoFormProps {
  student: StudentInfo;
  onChange: (updated: StudentInfo) => void;
}

const CAREER_SUGGESTIONS = [
  '소프트웨어 엔지니어 / AI 연구원',
  '의사 / 보건의료 전문가',
  '친환경 신소재 공학자',
  '경영 컨설턴트 및 창업가',
  '초등·중등 교사',
  '공공정책 및 행정 전문가',
  '콘텐츠 기획자 / 미디어 디렉터',
];

const TARGET_SUGGESTIONS = [
  '서울대학교 컴퓨터공학부',
  '연세대학교 행정학과',
  '고려대학교 경영대학',
  '한국과학기술원(KAIST)',
  '서울교육대학교 초등교육과',
  '한국과학영재학교 / 과학고',
];

export const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ student, onChange }) => {
  const handleSchoolLevelChange = (level: SchoolLevel) => {
    // Reset grade if invalid
    let nextGrade = student.grade;
    if (level === '초등학교') {
      if (!['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'].includes(student.grade)) {
        nextGrade = '5학년';
      }
    } else {
      if (!['1학년', '2학년', '3학년'].includes(student.grade)) {
        nextGrade = '2학년';
      }
    }
    onChange({ ...student, schoolLevel: level, grade: nextGrade });
  };

  const getGrades = () => {
    if (student.schoolLevel === '초등학교') {
      return ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'];
    }
    return ['1학년', '2학년', '3학년'];
  };

  return (
    <div id="student-info-section" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              1. 학생 인적사항 입력
            </h2>
            <p className="text-xs text-slate-500">
              학교급과 학년, 희망 진로를 기반으로 문서의 어휘와 구조가 맞춤 설정됩니다.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
          기초 정보
        </span>
      </div>

      <div className="space-y-5">
        {/* 학교급 및 학년 선택 */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-500" />
              학교급 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['초등학교', '중학교', '고등학교'] as SchoolLevel[]).map((lvl) => {
                const isSelected = student.schoolLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSchoolLevelChange(lvl)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              학년 선택 <span className="text-red-500">*</span>
            </label>
            <select
              value={student.grade}
              onChange={(e) => onChange({ ...student, grade: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
            >
              {getGrades().map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 학생 성명 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            학생 성명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 홍길동"
            value={student.name}
            onChange={(e) => onChange({ ...student, name: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
        </div>

        {/* 희망 진로 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              희망 진로 <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">예시 클릭 시 자동 입력</span>
          </div>
          <input
            type="text"
            placeholder="예: 인공지능 연구원, 소아청소년과 의사, 경영 컨설턴트 등"
            value={student.careerPath}
            onChange={(e) => onChange({ ...student, careerPath: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all mb-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {CAREER_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ ...student, careerPath: item })}
                className="text-[11px] py-1 px-2.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-transparent hover:border-teal-200"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>

        {/* 목표 학교 및 학과 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              목표 학교 / 학과 <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">지망 고교/대학교/학과</span>
          </div>
          <input
            type="text"
            placeholder="예: 서울대학교 컴퓨터공학부, 한국과학영재학교, 꿈나무 초등 중학교 등"
            value={student.targetSchool}
            onChange={(e) => onChange({ ...student, targetSchool: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all mb-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {TARGET_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ ...student, targetSchool: item })}
                className="text-[11px] py-1 px-2.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition-colors border border-transparent hover:border-sky-200"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

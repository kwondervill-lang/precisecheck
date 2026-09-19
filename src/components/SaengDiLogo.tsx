import React from 'react';

interface SaengDiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'document' | 'compact';
  isDark?: boolean;
  customLogoUrl?: string | null;
}

export const SaengDiLogo: React.FC<SaengDiLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  isDark = false,
  customLogoUrl,
}) => {
  // If user provided custom logo (e.g. uploaded 생디로고.png)
  if (customLogoUrl) {
    const imgHeight =
      variant === 'document'
        ? 'h-12 sm:h-14'
        : size === 'sm'
        ? 'h-8 sm:h-9'
        : size === 'md'
        ? 'h-10 sm:h-11'
        : size === 'lg'
        ? 'h-13 sm:h-15'
        : 'h-16 sm:h-18';

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="생디 (SAENGDI) 브랜드 로고"
          className={`${imgHeight} w-auto max-w-[340px] object-contain shrink-0 drop-shadow-2xs`}
        />
      </div>
    );
  }

  // Base navy palette matching the authentic SaengDi brand
  const navyColor = isDark ? '#FFFFFF' : '#08326E';
  const sloganNavy = isDark ? '#FFFFFF' : '#082855';
  const subtitleNavy = isDark ? '#93C5FD' : '#36537A';

  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-13 sm:h-15',
    xl: 'h-16 sm:h-18',
  };

  // 1. Symbol Only ('생디' Graphic Mark)
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 570 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto object-contain shrink-0 select-none ${className}`}
      >
        <defs>
          <linearGradient id={`saengdiSymLeft_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="#004AD7" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0088FF" />
          </linearGradient>
          <linearGradient id={`saengdiSymRight_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="#006EFF" />
            <stop offset="50%" stopColor="#00A2FF" />
            <stop offset="100%" stopColor="#00D7D0" />
          </linearGradient>
          <linearGradient id={`saengdiSymHead_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor="#00C4D6" />
            <stop offset="40%" stopColor="#00D8C0" />
            <stop offset="75%" stopColor="#02EE9E" />
            <stop offset="100%" stopColor="#34FCA4" />
          </linearGradient>
          <linearGradient id={`saengdiSymMintPill_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B876" />
            <stop offset="50%" stopColor="#02E08A" />
            <stop offset="100%" stopColor="#3EF8A6" />
          </linearGradient>
        </defs>

        {/* '생' Consonant 'ㅅ' Left Leg */}
        <path d="M 75 245 L 165 155" stroke={navyColor} strokeWidth="44" strokeLinecap="round" />

        {/* '생' Consonant 'ㅅ' Right 3D Ribbon Arrow */}
        <path d="M 148 217 L 221 144 L 235 158 L 162 231 Z" fill={`url(#saengdiSymLeft_${isDark ? 'dark' : 'light'})`} />
        <path d="M 162 231 L 235 158 L 249 144 L 176 217 Z" fill={`url(#saengdiSymRight_${isDark ? 'dark' : 'light'})`} />
        <path d="M 148 217 C 141 224 141 236 148 243 C 155 250 167 250 174 243 L 176 241 L 148 217 Z" fill="#004AD7" />

        {/* Arrowhead */}
        <path d="M 318 47 L 237 57 L 258 78 L 287 107 L 308 128 Z" fill={`url(#saengdiSymHead_${isDark ? 'dark' : 'light'})`} strokeLinejoin="round" />

        {/* '생' Vowel and Consonant */}
        <rect x="172" y="104" width="56" height="32" rx="16" fill={navyColor} />
        <rect x="236" y="110" width="32" height="68" rx="16" fill={navyColor} />
        <circle cx="196" cy="246" r="46" fill="none" stroke={navyColor} strokeWidth="36" />

        {/* '디' */}
        <path d="M 455 76 L 395 76 C 365 76 350 91 350 121 L 350 199 C 350 229 365 244 395 244 L 455 244" 
              fill="none" stroke={navyColor} strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 485 115 L 530 70" stroke={`url(#saengdiSymMintPill_${isDark ? 'dark' : 'light'})`} strokeWidth="36" strokeLinecap="round" />
        <rect x="494" y="124" width="38" height="146" rx="19" fill={navyColor} />
      </svg>
    );
  }

  // 2. Full Brand Identity (Symbol + Typography: 학생부를 디자인하다 / AI 기반 학생부 디자인 플랫폼)
  const containerHeight = variant === 'document' ? 'h-12 sm:h-14' : heights[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 1180 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${containerHeight} w-auto object-contain shrink-0`}
      >
        <defs>
          <linearGradient id={`saengdiLeftFacet_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="#004AD7" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0088FF" />
          </linearGradient>

          <linearGradient id={`saengdiRightFacet_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="#006EFF" />
            <stop offset="50%" stopColor="#00A2FF" />
            <stop offset="100%" stopColor="#00D7D0" />
          </linearGradient>

          <linearGradient id={`saengdiHead_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor="#00C4D6" />
            <stop offset="40%" stopColor="#00D8C0" />
            <stop offset="75%" stopColor="#02EE9E" />
            <stop offset="100%" stopColor="#34FCA4" />
          </linearGradient>

          <linearGradient id={`saengdiPillMint_${isDark ? 'dark' : 'light'}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B876" />
            <stop offset="50%" stopColor="#02E08A" />
            <stop offset="100%" stopColor="#3EF8A6" />
          </linearGradient>
        </defs>

        {/* ==================== Symbol Mark: '생디' ==================== */}
        <g id="saengdi-symbol-mark">
          {/* '생' ㅅ Left Leg */}
          <path d="M 75 245 L 165 155" stroke={navyColor} strokeWidth="44" strokeLinecap="round" />

          {/* '생' ㅅ Right 3D Ribbon Arrow (Dual-Facet Fold) */}
          <path d="M 148 217 L 221 144 L 235 158 L 162 231 Z" fill={`url(#saengdiLeftFacet_${isDark ? 'dark' : 'light'})`} />
          <path d="M 162 231 L 235 158 L 249 144 L 176 217 Z" fill={`url(#saengdiRightFacet_${isDark ? 'dark' : 'light'})`} />
          <path d="M 148 217 C 141 224 141 236 148 243 C 155 250 167 250 174 243 L 176 241 L 148 217 Z" fill="#004AD7" />

          {/* Arrowhead (Perfect Symmetrical Geometry) */}
          <path d="M 318 47 L 237 57 L 258 78 L 287 107 L 308 128 Z" fill={`url(#saengdiHead_${isDark ? 'dark' : 'light'})`} strokeLinejoin="round" />

          {/* '생' Horizontal Bar */}
          <rect x="172" y="104" width="56" height="32" rx="16" fill={navyColor} />

          {/* '생' Vertical Bar */}
          <rect x="236" y="110" width="32" height="68" rx="16" fill={navyColor} />

          {/* '생' Circular Base Ring */}
          <circle cx="196" cy="246" r="46" fill="none" stroke={navyColor} strokeWidth="36" />

          {/* '디' Consonant 'ㄷ' */}
          <path d="M 455 76 L 395 76 C 365 76 350 91 350 121 L 350 199 C 350 229 365 244 395 244 L 455 244" 
                fill="none" stroke={navyColor} strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />

          {/* '디' Vowel 'ㅣ' Upper Mint Accent Pill (45° angle) */}
          <path d="M 485 115 L 530 70" stroke={`url(#saengdiPillMint_${isDark ? 'dark' : 'light'})`} strokeWidth="36" strokeLinecap="round" />

          {/* '디' Vowel 'ㅣ' Lower Main Vertical Stem */}
          <rect x="494" y="124" width="38" height="146" rx="19" fill={navyColor} />
        </g>

        {/* ==================== Brand Typography ==================== */}
        <g id="saengdi-brand-text">
          {/* Main Slogan: "학생부를 디자인하다" */}
          <text
            x="585"
            y="165"
            fontFamily="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
            fontSize="76"
            fontWeight="900"
            letterSpacing="-0.035em"
            fill={sloganNavy}
          >
            학생부를 디자인하다
          </text>

          {/* Subtitle: "A I   기 반   학 생 부   디 자 인   플 랫 폼" */}
          <text
            x="590"
            y="242"
            fontFamily="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
            fontSize="28"
            fontWeight="700"
            letterSpacing="0.23em"
            fill={subtitleNavy}
          >
            A I   기 반   학 생 부   디 자 인   플 랫 폼
          </text>
        </g>
      </svg>
    </div>
  );
};

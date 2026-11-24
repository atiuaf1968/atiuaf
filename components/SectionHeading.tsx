import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  badgeColor?: 'green' | 'red';
  title: string;
  highlightText?: string;
  highlightColor?: 'green' | 'red';
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeColor = 'green',
  title,
  highlightText,
  highlightColor = 'red',
  subtitle,
  centered = true,
  className = ''
}) => {
  const badgeClasses =
    badgeColor === 'green'
      ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-200'
      : 'bg-brand-red-50 text-brand-red-700 border-brand-red-200';

  const highlightClass =
    highlightColor === 'red' ? 'text-brand-red-600' : 'text-brand-green-600';

  return (
    <div className={`mb-6 sm:mb-8 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {/* Badge */}
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${badgeClasses}`}>
          <span className={`w-2 h-2 rounded-full ${badgeColor === 'green' ? 'bg-brand-green-600' : 'bg-brand-red-600'} animate-pulse`} />
          {badge}
        </div>
      )}

      {/* Main Title */}
      <h2 className={`${badge ? 'mt-3 sm:mt-4' : 'mt-0 sm:mt-1'} text-2xl sm:text-4xl font-extrabold text-brand-black tracking-tight leading-tight`}>
        {title}{' '}
        {highlightText && (
          <span className={`relative inline-block ${highlightClass}`}>
            {highlightText}
            {/* Subtle decorative underline */}
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2 text-current opacity-30"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              fill="none"
            >
              <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}

      {/* Balanced Red & Green Accent Divider */}
      <div className={`mt-3.5 sm:mt-4 flex items-center gap-2 ${centered ? 'justify-center' : 'justify-start'}`}>
        <span className="w-10 h-1 bg-brand-green-600 rounded-full" />
        <span className="w-3 h-1 bg-brand-red-600 rounded-full" />
        <span className="w-10 h-1 bg-brand-green-600 rounded-full" />
      </div>
    </div>
  );
};

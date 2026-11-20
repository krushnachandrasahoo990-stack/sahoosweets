import React from 'react';

export const SwiggyVegBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const outerSize = size === 'sm' ? 'w-3.5 h-3.5 p-0.5' : size === 'lg' ? 'w-5 h-5 p-1' : 'w-4 h-4 p-[3px]';
  const innerSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  return (
    <div className={`border-[1.5px] border-emerald-600 rounded-[4px] flex items-center justify-center shrink-0 bg-white ${outerSize}`} title="100% Pure Vegetarian">
      <div className={`rounded-full bg-emerald-600 ${innerSize}`}></div>
    </div>
  );
};

export default SwiggyVegBadge;

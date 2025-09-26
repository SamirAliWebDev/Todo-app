import React from 'react';
import type { PredefinedCategory, TaskCategory } from '../types';
import { 
    BriefcaseIcon, 
    HomeIcon, 
    ShoppingCartIcon, 
    HeartIcon, 
    DumbbellIcon, 
    BookOpenIcon, 
    TagIcon 
} from '../components/Icons';

export const categoryConfig: { 
  [key in PredefinedCategory]: { 
    label: string; 
    icon: React.FC<{className?: string}>;
    color: string;
    iconColor: string;
  } 
} = {
  Work: { label: 'Work', icon: BriefcaseIcon, color: 'bg-sky-500', iconColor: 'text-sky-100' },
  Personal: { label: 'Personal', icon: HomeIcon, color: 'bg-green-500', iconColor: 'text-green-100' },
  Shopping: { label: 'Shopping', icon: ShoppingCartIcon, color: 'bg-amber-500', iconColor: 'text-amber-100' },
  Health: { label: 'Health', icon: HeartIcon, color: 'bg-red-500', iconColor: 'text-red-100' },
  Fitness: { label: 'Fitness', icon: DumbbellIcon, color: 'bg-indigo-500', iconColor: 'text-indigo-100' },
  Study: { label: 'Study', icon: BookOpenIcon, color: 'bg-purple-500', iconColor: 'text-purple-100' },
  Other: { label: 'Other', icon: TagIcon, color: 'bg-slate-500', iconColor: 'text-slate-100' },
};

export const categoryList = (Object.keys(categoryConfig) as PredefinedCategory[]).map(key => {
    return {
        id: key,
        ...categoryConfig[key],
    };
});

export const CategoryDisplay: React.FC<{ category: TaskCategory; className?: string }> = ({ category, className }) => {
    const baseClasses = `flex items-center justify-center rounded-full ${className}`;

    if (category.type === 'icon' && category.value in categoryConfig) {
        const config = categoryConfig[category.value];
        const IconComponent = config.icon;
        const iconSize = 'h-[55%] w-[55%]'; 
        return (
            <div className={`${baseClasses} ${config.color}`}>
                <IconComponent className={`${iconSize} ${config.iconColor}`} />
            </div>
        );
    }
    
    const customBgColor = 'bg-slate-500';
    let graphemeCount = category.value.length;
    try {
        graphemeCount = [...new (Intl as any).Segmenter().segment(category.value)].length;
    } catch (e) {
      // Fallback for older browsers
    }
    
    let fontSizeClass;
    if (graphemeCount === 1) fontSizeClass = 'text-lg';
    else if (graphemeCount === 2) fontSizeClass = 'text-sm';
    else fontSizeClass = 'text-[0.6rem] leading-none text-center';

    return (
        <div className={`${baseClasses} ${customBgColor}`}>
            <span className={`text-slate-100 font-medium ${fontSizeClass} overflow-hidden`}>
                {category.value}
            </span>
        </div>
    );
};

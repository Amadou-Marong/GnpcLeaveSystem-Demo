import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  gradientBarColor?: string;
}

const StatCard = ({ title, value, subtitle, icon, iconBgColor = 'bg-primary/10', gradientBarColor = 'bg-primary' }: StatCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border animate-fade-in relative">
      <div className="flex items-start p-5 justify-between gap-4">
        {/* Content */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBgColor)}>
          {icon}
        </div>
      </div>
      {/* Gradient Bar */}
      <div className={cn('h-2 w-full mt-4 rounded-b-xl bg-linear-to-r absolute bottom-0', gradientBarColor)} />
    </div>
  );
};

export default StatCard;


// import { cn } from '@/lib/utils';
// import type { ReactNode } from 'react';

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   icon: ReactNode;
//   accentColor?: 'primary' | 'warning' | 'success' | 'destructive' | 'info';
// }

// const accentStyles = {
//   primary: {
//     iconBg: 'bg-primary',
//     gradient: 'from-primary/80 to-primary/40',
//   },
//   warning: {
//     iconBg: 'bg-warning',
//     gradient: 'from-warning/80 to-warning/40',
//   },
//   success: {
//     iconBg: 'bg-success',
//     gradient: 'from-success/80 to-success/40',
//   },
//   destructive: {
//     iconBg: 'bg-destructive',
//     gradient: 'from-destructive/80 to-destructive/40',
//   },
//   info: {
//     iconBg: 'bg-info',
//     gradient: 'from-info/80 to-info/40',
//   },
// };

// const StatCard = ({ 
//   title, 
//   value, 
//   subtitle, 
//   icon, 
//   accentColor = 'primary' 
// }: StatCardProps) => {
//   const styles = accentStyles[accentColor];

//   return (
//     <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in hover:shadow-lg transition-shadow duration-300">
//       <div className="p-5 pb-4">
//         <div className="flex items-start gap-4">
//           {/* Icon */}
//           <div className={cn(
//             'w-11 h-11 rounded-full flex items-center justify-center shadow-lg',
//             styles.iconBg
//           )}>
//             <div className="text-white [&>svg]:w-5 [&>svg]:h-5">
//               {icon}
//             </div>
//           </div>
          
//           {/* Content */}
//           <div className="flex-1">
//             <p className="text-xs font-medium text-muted-foreground">{title}</p>
//             <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
//             {subtitle && (
//               <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Gradient Bar */}
//       <div className={cn(
//         'h-1.5 w-full bg-linear-to-r',
//         styles.gradient
//       )} />
//     </div>
//   );
// };

// export default StatCard;

import React from 'react';

import { cn } from '@/lib/utils';

const Wrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn('mx-auto px-4', className)} style={{ maxWidth: '1200px' }}>
      {children}
    </div>
  )
);
Wrapper.displayName = 'Wrapper';

export default Wrapper;

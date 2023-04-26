'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function TitterListSkeleton() {
  return (
    <div data-cy="loading-titter-list">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="flex p-4" key={`titter-load-${index}`}>
          <div className="flex flex-col">
            <Skeleton className="h-[56px] w-[56px] rounded-full bg-slate-200" />
          </div>

          <div className="flex flex-1 flex-col gap-2 pl-2">
            <div className="flex flex-row gap-2">
              <Skeleton className="h-[20px] w-[80px] bg-slate-200" />
              <Skeleton className="h-[20px] w-[120px] bg-slate-200" />
            </div>
            <Skeleton className="h-[70px] w-full bg-slate-200" />
            <div className="flex flex-row gap-2">
              <Skeleton className="h-[30px] w-[70px] bg-slate-200" />
              <Skeleton className="h-[30px] w-[70px] bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

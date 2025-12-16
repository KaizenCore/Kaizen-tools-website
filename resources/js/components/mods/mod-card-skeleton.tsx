import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ModCardSkeletonProps {
    count?: number;
}

export function ModCardSkeleton({ count = 1 }: ModCardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card
                    key={index}
                    className="h-full animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'backwards',
                    }}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Skeleton className="size-14 shrink-0 rounded-lg" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex gap-1.5">
                                <Skeleton className="h-5 w-8 rounded" />
                                <Skeleton className="h-5 w-8 rounded" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ResourcePackCardSkeletonProps {
    count?: number;
}

export function ResourcePackCardSkeleton({
    count = 1,
}: ResourcePackCardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="h-full">
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
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        <div className="mt-3 flex gap-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

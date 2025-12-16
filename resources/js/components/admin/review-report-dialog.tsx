import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { AdminReport } from '@/types/admin';
import { Archive, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ReviewReportDialogProps {
    report: AdminReport | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const reviewOptions = [
    {
        value: 'verified',
        label: 'Verify Report',
        description:
            "Confirm this report is valid. This will affect the player's trust score.",
        icon: CheckCircle2,
        className: 'text-green-600 dark:text-green-400',
    },
    {
        value: 'rejected',
        label: 'Reject Report',
        description: 'This report is invalid, false, or lacks evidence.',
        icon: XCircle,
        className: 'text-red-600 dark:text-red-400',
    },
    {
        value: 'resolved',
        label: 'Mark as Resolved',
        description: 'The issue has been addressed. No score impact.',
        icon: Archive,
        className: 'text-gray-600 dark:text-gray-400',
    },
];

export function ReviewReportDialog({
    report,
    open,
    onOpenChange,
    onSuccess,
}: ReviewReportDialogProps) {
    const [status, setStatus] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!report || !status) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/admin/reports/${report.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ status, notes }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Failed to review report');
                return;
            }

            onOpenChange(false);
            setStatus('');
            setNotes('');
            onSuccess?.();
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Review Report</DialogTitle>
                    <DialogDescription>
                        {report && (
                            <>
                                Report against{' '}
                                <strong>{report.player.username}</strong> for{' '}
                                <strong>{report.report_type_label}</strong>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {report && (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="mb-1 text-sm font-medium">Reason:</p>
                            <p className="text-sm text-muted-foreground">
                                {report.reason}
                            </p>
                            {report.evidence_url && (
                                <a
                                    href={report.evidence_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-sm text-primary hover:underline"
                                >
                                    View Evidence →
                                </a>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label>Decision</Label>
                            <RadioGroup
                                value={status}
                                onValueChange={setStatus}
                            >
                                {reviewOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            id={option.value}
                                            className="mt-0.5"
                                        />
                                        <Label
                                            htmlFor={option.value}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <span
                                                className={`flex items-center gap-2 font-medium ${option.className}`}
                                            >
                                                <option.icon className="size-4" />
                                                {option.label}
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                {option.description}
                                            </p>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">
                                Admin Notes (Optional)
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about this decision..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !status}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

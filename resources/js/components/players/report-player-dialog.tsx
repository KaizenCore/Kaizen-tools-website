import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { Player, ReportType, ReportTypeOption } from '@/types/players';
import { useForm } from '@inertiajs/react';
import { Flag, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ReportPlayerDialogProps {
    player: Player;
    onSuccess?: () => void;
}

const reportTypes: ReportTypeOption[] = [
    {
        value: 'cheating',
        label: 'Cheating',
        description: 'Using hacks, exploits, or unfair advantages',
    },
    {
        value: 'scamming',
        label: 'Scamming',
        description: 'Fraudulent trading or deceptive behavior',
    },
    {
        value: 'toxicity',
        label: 'Toxicity',
        description: 'Harassment, hate speech, or abusive behavior',
    },
    {
        value: 'suspicious_account',
        label: 'Suspicious Account',
        description: 'Bot account, compromised account, or impersonation',
    },
];

export function ReportPlayerDialog({
    player,
    onSuccess,
}: ReportPlayerDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { data, setData, reset } = useForm({
        report_type: '' as ReportType | '',
        reason: '',
        evidence_url: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/players/${player.id}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Failed to submit report');
                return;
            }

            setSuccess(true);
            reset();
            onSuccess?.();

            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 2000);
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Flag className="size-4" />
                    Report Player
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Report {player.username}</DialogTitle>
                    <DialogDescription>
                        Help keep the community safe by reporting suspicious
                        behavior. All reports are reviewed by moderators.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <Flag className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-lg font-medium">Report Submitted</p>
                        <p className="text-sm text-muted-foreground">
                            Thank you for your report.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <Label>Report Type</Label>
                            <RadioGroup
                                value={data.report_type}
                                onValueChange={(value: string) =>
                                    setData('report_type', value as ReportType)
                                }
                            >
                                {reportTypes.map((type) => (
                                    <div
                                        key={type.value}
                                        className="flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <RadioGroupItem
                                            value={type.value}
                                            id={type.value}
                                            className="mt-0.5"
                                        />
                                        <Label
                                            htmlFor={type.value}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <span className="font-medium">
                                                {type.label}
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                {type.description}
                                            </p>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Please describe what happened..."
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                                className="min-h-24"
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 10 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evidence_url">
                                Evidence URL (Optional)
                            </Label>
                            <Input
                                id="evidence_url"
                                type="url"
                                placeholder="https://..."
                                value={data.evidence_url}
                                onChange={(e) =>
                                    setData('evidence_url', e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Link to screenshot, video, or other evidence
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    !data.report_type ||
                                    data.reason.length < 10
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

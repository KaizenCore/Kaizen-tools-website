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
import type { AdminPlayer } from '@/types/admin';
import type { TrustLevel } from '@/types/players';
import {
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    Loader2,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';

interface OverrideTrustDialogProps {
    player: AdminPlayer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const trustOptions: {
    value: TrustLevel;
    label: string;
    icon: typeof CheckCircle2;
    className: string;
}[] = [
    {
        value: 'trusted',
        label: 'Trusted',
        icon: CheckCircle2,
        className: 'text-green-600 dark:text-green-400',
    },
    {
        value: 'neutral',
        label: 'Neutral',
        icon: HelpCircle,
        className: 'text-gray-600 dark:text-gray-400',
    },
    {
        value: 'suspect',
        label: 'Suspect',
        icon: AlertTriangle,
        className: 'text-orange-600 dark:text-orange-400',
    },
    {
        value: 'unknown',
        label: 'No Reports (Reset)',
        icon: ShieldAlert,
        className: 'text-blue-600 dark:text-blue-400',
    },
];

export function OverrideTrustDialog({
    player,
    open,
    onOpenChange,
    onSuccess,
}: OverrideTrustDialogProps) {
    const [trustLevel, setTrustLevel] = useState<TrustLevel | ''>('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!player || !trustLevel) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(
                `/admin/players/${player.id}/override`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ trust_level: trustLevel, notes }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Failed to override trust level');
                return;
            }

            onOpenChange(false);
            setTrustLevel('');
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Override Trust Level</DialogTitle>
                    <DialogDescription>
                        {player && (
                            <>
                                Manually set trust level for{' '}
                                <strong>{player.username}</strong>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label>Trust Level</Label>
                        <RadioGroup
                            value={trustLevel}
                            onValueChange={(v) =>
                                setTrustLevel(v as TrustLevel)
                            }
                        >
                            {trustOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                >
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`trust-${option.value}`}
                                    />
                                    <Label
                                        htmlFor={`trust-${option.value}`}
                                        className={`flex flex-1 cursor-pointer items-center gap-2 ${option.className}`}
                                    >
                                        <option.icon className="size-4" />
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="override-notes">
                            Reason for Override
                        </Label>
                        <Textarea
                            id="override-notes"
                            placeholder="Explain why you're overriding the trust level..."
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
                            disabled={isSubmitting || !trustLevel}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                'Apply Override'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

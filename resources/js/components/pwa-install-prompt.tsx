import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    if (window.matchMedia('(display-mode: browser)').matches) return 'desktop';
    return 'unknown';
}

function isStandalone(): boolean {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
}

export function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<Platform>('unknown');
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already installed or dismissed
        if (isStandalone()) return;

        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismiss < 7) {
                setDismissed(true);
                return;
            }
        }

        setPlatform(detectPlatform());

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after a delay for better UX
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, show manual instructions after delay
        const detectedPlatform = detectPlatform();
        if (detectedPlatform === 'ios' && !dismissed) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [dismissed]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (dismissed || isStandalone()) return null;

    return (
        <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <img src="/icons/icon-192x192.png" alt="Kaizen Tools" className="size-12 rounded-xl" />
                        <span>Installer Kaizen Tools</span>
                    </DialogTitle>
                    <DialogDescription>
                        Installez Kaizen Tools sur votre appareil pour un accès rapide et une meilleure expérience.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {platform === 'ios' ? (
                        <div className="bg-muted rounded-lg p-4 space-y-3">
                            <p className="text-sm font-medium">Pour installer sur iOS :</p>
                            <ol className="text-muted-foreground space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs">
                                        1
                                    </span>
                                    Appuyez sur le bouton{' '}
                                    <Share className="text-primary inline size-4" /> Partager
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs">
                                        2
                                    </span>
                                    Sélectionnez &quot;Sur l&apos;écran d&apos;accueil&quot;
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs">
                                        3
                                    </span>
                                    Appuyez sur &quot;Ajouter&quot;
                                </li>
                            </ol>
                        </div>
                    ) : (
                        <div className="bg-muted rounded-lg p-4">
                            <ul className="text-muted-foreground space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <Download className="text-primary size-4" />
                                    Accès hors-ligne aux fonctionnalités de base
                                </li>
                                <li className="flex items-center gap-2">
                                    <Download className="text-primary size-4" />
                                    Lancement rapide depuis l&apos;écran d&apos;accueil
                                </li>
                                <li className="flex items-center gap-2">
                                    <Download className="text-primary size-4" />
                                    Expérience plein écran
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={handleDismiss} className="w-full sm:w-auto">
                        <X className="size-4" />
                        Plus tard
                    </Button>
                    {platform !== 'ios' && deferredPrompt && (
                        <Button onClick={handleInstall} className="w-full sm:w-auto">
                            <Download className="size-4" />
                            Installer
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

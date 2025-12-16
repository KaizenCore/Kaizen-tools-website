import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                autoFocus
                                aria-invalid={
                                    errors.password ? 'true' : 'false'
                                }
                                className="transition-all duration-200"
                            />
                            <InputError
                                message={errors.password}
                                className="animate-in duration-300 fade-in slide-in-from-top-1"
                            />
                        </div>

                        <Button
                            className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            {processing ? 'Confirming...' : 'Confirm password'}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title="Reset password"
            description="Please enter your new password below"
        >
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                                className="bg-muted/50 transition-all duration-200"
                            />
                            <InputError
                                message={errors.email}
                                className="animate-in duration-300 fade-in slide-in-from-top-1"
                            />
                        </div>

                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                New password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Enter your new password"
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

                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-medium"
                            >
                                Confirm new password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Re-enter your new password"
                                aria-invalid={
                                    errors.password_confirmation
                                        ? 'true'
                                        : 'false'
                                }
                                className="transition-all duration-200"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="animate-in duration-300 fade-in slide-in-from-top-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            {processing
                                ? 'Resetting password...'
                                : 'Reset password'}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

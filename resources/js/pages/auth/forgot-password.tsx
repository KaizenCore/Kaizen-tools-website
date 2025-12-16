// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-6 animate-in rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 duration-500 fade-in slide-in-from-top-2 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    aria-invalid={
                                        errors.email ? 'true' : 'false'
                                    }
                                    className="transition-all duration-200"
                                />
                                <InputError
                                    message={errors.email}
                                    className="animate-in duration-300 fade-in slide-in-from-top-1"
                                />
                            </div>

                            <div className="mt-6">
                                <Button
                                    className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 size-4 animate-spin" />
                                    )}
                                    {processing
                                        ? 'Sending link...'
                                        : 'Email password reset link'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    <span>Or, return to </span>
                    <TextLink
                        href={login()}
                        className="font-medium transition-colors duration-200 hover:text-primary"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}

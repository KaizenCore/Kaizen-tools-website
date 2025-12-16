// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 animate-in rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 duration-500 fade-in slide-in-from-top-2 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form {...send.form()} className="space-y-5 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="secondary"
                            className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {processing && <Spinner className="mr-2" />}
                            {processing
                                ? 'Sending email...'
                                : 'Resend verification email'}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm font-medium transition-colors duration-200 hover:text-primary"
                        >
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

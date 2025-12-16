import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import PasswordStrengthIndicator from '@/components/password-strength-indicator';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { useState } from 'react';

export default function Register() {
    const [password, setPassword] = useState('');

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    aria-invalid={
                                        errors.name ? 'true' : 'false'
                                    }
                                    className="transition-all duration-200"
                                />
                                <InputError
                                    message={errors.name}
                                    className="animate-in duration-300 fade-in slide-in-from-top-1"
                                />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
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
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    aria-invalid={
                                        errors.password ? 'true' : 'false'
                                    }
                                    className="transition-all duration-200"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="animate-in duration-300 fade-in slide-in-from-top-1"
                                />
                                <PasswordStrengthIndicator
                                    password={password}
                                />
                            </div>

                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium"
                                >
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Re-enter your password"
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
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {processing
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium transition-colors duration-200 hover:text-primary"
                            >
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const CodeForm = z.object({
    email: z.string().email({
        message: 'Must be a valid email address',
    }),
});

type CodeFormType = z.infer<typeof CodeForm>;

export function LoginCodeForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<CodeFormType>({
        resolver: zodResolver(CodeForm),
        defaultValues: {
            email: '',
        },
    });

    const { isValid } = form.formState;

    const onSubmit = async (values: CodeFormType) => {
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: values.email,
                type: 'sign-in',
            });

            if (error) {
                setError('Failed to send verification code. Please try again.');
            } else {
                navigate({
                    to: '/login/code',
                    search: { email: values.email },
                });
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="text-sm text-destructive">{error}</div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading || !isValid}
                    >
                        Continue with Email
                    </Button>
                </div>
            </form>
        </Form>
    );
}

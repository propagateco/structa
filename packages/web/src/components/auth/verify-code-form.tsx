import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';

const CodeSchema = z.object({
    code: z.string().min(6, {
        message: 'Verification code must be 6 characters.',
    }),
});

type CodeFormType = z.infer<typeof CodeSchema>;

interface VerifyCodeFormProps {
    email: string;
}

export function VerifyCodeForm({ email }: VerifyCodeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasSubmittedRef = useRef(false);
    const navigate = useNavigate();

    const form = useForm<CodeFormType>({
        resolver: zodResolver(CodeSchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (data: CodeFormType) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authClient.signIn.emailOtp({
                email,
                otp: data.code,
            });

            if (response.error) {
                setError('Invalid verification code. Please try again.');
                hasSubmittedRef.current = false;
                form.reset();
            } else {
                navigate({ to: '/' });
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
            hasSubmittedRef.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        // Remove any non-numeric characters and limit to 6 digits
        const cleanedCode = pastedData.replace(/\D/g, '').slice(0, 6);
        if (cleanedCode.length > 0) {
            form.setValue('code', cleanedCode, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const code = form.watch('code');

    // Auto-submit when 6 digits are entered (typing or paste)
    useEffect(() => {
        if (code.length === 6 && !isLoading && !hasSubmittedRef.current) {
            hasSubmittedRef.current = true;
            form.handleSubmit(onSubmit)();
        }
    }, [code, isLoading]);

    // Reset submission guard when code is cleared
    useEffect(() => {
        if (code.length === 0) {
            hasSubmittedRef.current = false;
        }
    }, [code]);

    return (
        <Form {...form}>
            <form
                onSubmit={e => e.preventDefault()}
                className="space-y-2 w-full"
            >
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputOTP
                                    maxLength={6}
                                    {...field}
                                    onPaste={handlePaste}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={1} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="text-sm text-destructive">{error}</div>
                )}

                <Button
                    type="button"
                    variant="link"
                    className="text-muted mt-10"
                    onClick={() => navigate({ to: '/login' })}
                    disabled={isLoading}
                    isLoading={isLoading}
                    icon={<MoveLeft className="h-4 w-4" />}
                >
                    {isLoading ? 'Verifying' : 'Back'}
                </Button>
            </form>
        </Form>
    );
}

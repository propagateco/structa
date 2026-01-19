import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AppleModel } from "@core/apple/apple.model";
import {
  useConnectAppleMutation,
  useValidateAppleCredentialsMutation,
  useTestAppleConnectionMutation,
} from "@/clients/apple/apple.mutation.client";

/**
 * Apple Integration Wizard
 * ------------------------
 *
 * Multi-step wizard for connecting Apple App Store Connect accounts.
 * Guides users through the complex process of setting up API keys.
 */

interface AppleWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = AppleModel.WizardForm;

type FormData = AppleModel.WizardFormType;

const WIZARD_STEPS = [
  {
    id: "agreements",
    title: "Sign Developer Agreements",
    description:
      "Confirm you've signed the necessary agreements in App Store Connect",
  },
  {
    id: "intro",
    title: "Generate an App Store Connect API Key",
    description:
      "We'll generate an API key to allow Structa to publish apps to the App Store on your behalf",
  },
  {
    id: "credentials",
    title: "Enter API Credentials",
    description: "Provide your App Store Connect API key details",
  },
];

export function AppleWizard({ open, onOpenChange }: AppleWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [showKeyId, setShowKeyId] = useState(false);
  const [showIssuerId, setShowIssuerId] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paidAppsAgreement: false,
      dsaCompliance: false,
      keyId: "",
      issuerId: "",
      privateKey: "",
    },
  });

  const connectMutation = useConnectAppleMutation();
  const validateMutation = useValidateAppleCredentialsMutation();
  const testConnectionMutation = useTestAppleConnectionMutation();

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          form.setValue("privateKey", content);
          // Trigger validation for the privateKey field
          form.trigger("privateKey");
        };
        reader.readAsText(file);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-pkcs8": [".p8"],
      "text/plain": [".p8"],
    },
    multiple: false,
  });

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    form.setValue("privateKey", "");
  };

  // Navigate between steps
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Handle verification
  const handleVerify = async () => {
    const formData = form.getValues();
    setVerificationError(null);

    try {
      // Extract just the credential fields for validation
      const credentials = {
        keyId: formData.keyId,
        issuerId: formData.issuerId,
        privateKey: formData.privateKey,
      };

      // First validate the format
      const validation = await validateMutation.mutateAsync(credentials);

      if (!validation.valid) {
        setVerificationError(
          validation.errors?.join(", ") || "Invalid credentials format",
        );
        return;
      }

      // Then connect and test with contract status
      const contractStatus: string[] = ["FREE_APP_AGREEMENT_ACTIVE"]; // Always active by default

      if (formData.paidAppsAgreement) {
        contractStatus.push("PAID_APP_AGREEMENT_ACTIVE");
      }

      if (formData.dsaCompliance) {
        contractStatus.push("DSA_AGREEMENT_ACTIVE");
      }

      await connectMutation.mutateAsync({
        ...credentials,
        contractStatus,
      });

      // Success - close the modal
      handleClose();
    } catch (error) {
      setVerificationError(
        error instanceof Error ? error.message : "Connection failed",
      );
    }
  };

  // Close wizard
  const handleClose = () => {
    setCurrentStep(0);
    setUploadedFile(null);
    setVerificationError(null);
    form.reset();
    onOpenChange(false);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Agreements
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              <div>
                <h4 className="font-medium text-sm">Before we begin:</h4>
                <p className="text-sm text-muted-foreground mt-3">
                  You'll need to sign the necessary agreements in App Store
                  Connect to publish apps through Structa.
                </p>

                <div className="space-y-4 mt-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Go to App Store Connect
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Visit{" "}
                        <a
                          href="https://appstoreconnect.apple.com/business"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-link hover:underline font-medium"
                        >
                          appstoreconnect.apple.com/business
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Sign the Paid Apps Agreement
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Required to offer paid apps and in-app purhcases.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Complete DSA Compliance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Required to make your app available on the App Store in
                        the European Union (EU).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="paidAppsAgreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I have signed the Paid Apps Agreement
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormDescription>
                              This agreement is required to offer apps or other
                              in-app purchases.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dsaCompliance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I have completed Digital Services Act (DSA)
                              compliance
                            </FormLabel>
                            <FormDescription>
                              Optional but recommended for EU availability
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Introduction
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Follow these steps:</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Open App Store Connect
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Go to{" "}
                        <a
                          href="https://appstoreconnect.apple.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-link hover:underline font-medium"
                        >
                          appstoreconnect.apple.com
                        </a>{" "}
                        and sign in with your Apple ID
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Navigate to API Keys
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click{" "}
                        <span className="font-medium">Users and Access</span> →{" "}
                        <span className="font-medium">Integrations</span> →{" "}
                        <span className="font-medium">
                          App Store Connect API
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Select Team Keys Tab
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click the <span className="font-medium">Team Keys</span>{" "}
                        tab (not Individual Keys) to ensure proper permissions
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Generate New Admin Key
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click the <span className="font-medium">+</span> button
                        to create a new key. Give it a name (e.g., "Structa")
                        and select <span className="font-medium">Admin</span>{" "}
                        role
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      5
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Download the Private Key
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click <span className="font-medium">Generate</span>,
                        then{" "}
                        <span className="font-medium">Download API Key</span> to
                        save the .p8 file.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ds-powder/40 text-primary flex items-center justify-center text-sm font-medium">
                      6
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Copy Your Credentials
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Note down the{" "}
                        <span className="font-medium">Key ID</span> (shown after
                        creation) and{" "}
                        <span className="font-medium">Issuer ID</span> (at the
                        top of the API page)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Credentials
        return (
          <div className="space-y-6">
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="keyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key ID</FormLabel>
                      <FormDescription>
                        Unique Key ID is a column in the table of Active keys
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showKeyId ? "text" : "password"}
                            placeholder="ABC123DEF4"
                            {...field}
                            className="font-mono pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowKeyId(!showKeyId)}
                          >
                            {showKeyId ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer ID</FormLabel>
                      <FormDescription>
                        Find this above the table of Active keys
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showIssuerId ? "text" : "password"}
                            placeholder="abcd1234-abcd-1234-abcd-123456789abc"
                            {...field}
                            className="font-mono pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowIssuerId(!showIssuerId)}
                          >
                            {showIssuerId ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Key File</FormLabel>
                      <FormDescription>
                        Download this .p8 file after creating the key. You can
                        only download it once.
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-3">
                          {!uploadedFile ? (
                            <div
                              {...getRootProps()}
                              className={`
																border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
																${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
															`}
                            >
                              <input {...getInputProps()} />
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm font-medium">
                                {isDragActive
                                  ? "Drop the Private Key file here"
                                  : "Drop your Private Key file, or click to browse"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Only .p8 private key files are accepted
                              </p>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {uploadedFile.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeFile}
                                  className="h-6 w-6 p-0 bg-gray-800/0 hover:bg-gray-800/5"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            {/* Error message */}
            {verificationError && (
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">
                      Connection Failed
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {verificationError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl h-[600px] sm:h-[650px] md:h-[700px] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{WIZARD_STEPS[currentStep]?.title}</DialogTitle>
          <DialogDescription>
            {WIZARD_STEPS[currentStep]?.description}
          </DialogDescription>
        </DialogHeader>

        {/* Close button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Progress indicator */}
        <div className="flex justify-center my-4">
          <div className="w-full max-w-md">
            <Progress
              value={((currentStep + 1) / WIZARD_STEPS.length) * 100}
              className="h-2"
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="max-w-md mx-auto">{renderStepContent()}</div>
        </div>

        {/* Navigation */}
        <DialogFooter className="flex justify-between flex-shrink-0">
          <div className="flex space-x-2">
            {currentStep > 0 && currentStep < WIZARD_STEPS.length - 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {currentStep === 0 && (
              <Button
                onClick={nextStep}
                disabled={!form.watch("paidAppsAgreement")}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {currentStep === 1 && (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                onClick={handleVerify}
                disabled={
                  !form.watch("keyId") ||
                  !form.watch("issuerId") ||
                  !form.watch("privateKey") ||
                  connectMutation.isPending ||
                  validateMutation.isPending
                }
                isLoading={
                  connectMutation.isPending || validateMutation.isPending
                }
              >
                Verify Credentials
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

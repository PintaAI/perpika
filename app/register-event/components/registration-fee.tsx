"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { CreditCard } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { PresentationCategory, SessionType, RegistrationType } from "../constants"
import { formSchema } from "../schemas"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { checkEarlyBirdStatus, getRegistrationFee } from "../actions"

interface RegistrationFeeProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
  presentationCategory: string | undefined
  sessionType: string | undefined
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const useEarlyBirdStatus = () => {
  const [earlyBirdStatus, setEarlyBirdStatus] = useState<{
    isEarlyBird: boolean;
    period: any | null;
  }>({ isEarlyBird: false, period: null });

  useEffect(() => {
    const fetchEarlyBirdStatus = async () => {
      try {
        const status = await checkEarlyBirdStatus();
        setEarlyBirdStatus(status);
      } catch (error) {
        console.error('Error fetching early bird status:', error);
      }
    };
    fetchEarlyBirdStatus();
  }, []);

  return earlyBirdStatus;
};

export function RegistrationFee({ form, presentationCategory, sessionType }: RegistrationFeeProps) {
  const [currentFee, setCurrentFee] = useState<number | null>(null)
  const [feeError, setFeeError] = useState<string | null>(null)
  const { isEarlyBird, period } = useEarlyBirdStatus();

  // Initialize registration type and handle validation
  useEffect(() => {
    if (!presentationCategory || !sessionType) return

    let newRegistrationType: keyof typeof RegistrationType | null = null

    if (presentationCategory === PresentationCategory.ORAL) {
      newRegistrationType =
        sessionType === SessionType.ONLINE
          ? RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE
          : RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE
    } else {
      newRegistrationType =
        sessionType === SessionType.ONLINE
          ? RegistrationType.PRESENTER_FOREIGNER_ONLINE
          : RegistrationType.PRESENTER_FOREIGNER_OFFLINE
    }

    if (newRegistrationType) {
      // Always update registration type when it changes
      form.setValue('registrationType', newRegistrationType, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      const fetchFee = async () => {
        try {
          setFeeError(null)
          setCurrentFee(null)
          let fee = await getRegistrationFee(newRegistrationType!, isEarlyBird);

          if (typeof fee === 'number') {
            setCurrentFee(fee);
          } else {
            setFeeError("Registration fee is not configured yet. Please contact committee/admin.")
          }
        } catch (error) {
          console.error('Error fetching registration fee:', error);
          setFeeError("Failed to load registration fee. Please refresh or try again.")
        }
      };

      fetchFee();
    }

  }, [presentationCategory, sessionType, form, isEarlyBird])

  return (
    <div className="border-b p-6 md:p-8">
      {isEarlyBird && period && (
        <Card className="mb-4 p-4 bg-green-50 border-green-200">
          <p className="text-green-700 font-medium">
            Early Bird Registration is Active! (Until {new Date(period.endDate).toLocaleDateString()})
          </p>
          <p className="text-green-600 text-sm mt-1">
            Register now to get special early bird pricing
          </p>
        </Card>
      )}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Registration Fee</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Price is calculated automatically from admin fee settings and current early bird period.
        </p>
      </div>

      <div className="mb-6">
        <FormLabel className="flex items-center justify-between mb-2">
          <span>Registration Fee</span>
          <span className="text-primary font-medium">
            {currentFee === null ? 'Calculating...' : currentFee === 0 ? 'Free' : formatPrice(currentFee)}
          </span>
        </FormLabel>
        <div className="text-sm text-muted-foreground">
          <p>
            {presentationCategory === PresentationCategory.ORAL ? "Oral Presenter" : "Poster Presenter"} (
            {sessionType === SessionType.ONLINE ? "Online" : "Onsite"})
          </p>
          {currentFee !== null ? (
            <p className="mt-1">
              IDR {(currentFee * 12).toLocaleString("id-ID")}
            </p>
          ) : null}
          {feeError ? (
            <p className="mt-1 text-destructive">{feeError}</p>
          ) : null}
        </div>
      </div>

      <div className="mb-6">
        <FormLabel>Bank Account Information</FormLabel>
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-sm font-medium">Bank: 토스뱅크</p>
            <p className="text-sm">Account Number: 1002-4253-2452</p>
            <p className="text-sm">Account Holder: Billa Lutfiah Annisa</p>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm font-medium">Bank: BCA</p>
            <p className="text-sm">Account Number: 6041144782</p>
            <p className="text-sm">Account Holder: Lutfiah Annisa Billa</p>
          </div>
        </Card>
      </div>

      <FormField
        control={form.control}
        name="agreeToTerms"
        render={({ field }) => (
          <FormItem className="mb-6">
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Terms and Conditions
                </label>
                <p className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    terms and conditions
                  </a>{" "}
                  of the event registration.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="registrationType"
        render={({ field }) => (
          <input 
            type="hidden" 
            {...field}
            value={field.value || ''} 
          />
        )}
      />

      <FormField
        control={form.control}
        name="proofOfPayment"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel>Payment Proof</FormLabel> */}
            <FormLabel className="font-medium">Payment Proof <span className="text-destructive">*</span></FormLabel>
            {!field.value ? (
              <FormControl>
                <FileUpload
                  onChange={(downloadURL) => {
                    // Update form field value
                    field.onChange(downloadURL);
                    
                    // Update form context
                    form.setValue('proofOfPayment', downloadURL, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                    
                    // Force validation
                    form.trigger('proofOfPayment');
                  }}
                />
              </FormControl>
            ) : (
              <div className="mt-2 space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Proof Uploaded</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => field.onChange('')}
                    >
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                  <div className="mt-2 relative rounded-lg overflow-hidden border">
                    <img 
                      src={field.value} 
                      alt="Payment proof" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => field.onChange('')}
                >
                  Upload Different Image
                </Button>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

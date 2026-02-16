"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { CreditCard } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { AttendingAs, SessionType, RegistrationType } from "../constants"
import { formSchema } from "../schemas"
import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { checkEarlyBirdStatus, getRegistrationFee } from "../actions"

interface RegistrationFeeProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
  attendingAs: string | undefined
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

export function RegistrationFee({ form, attendingAs, sessionType }: RegistrationFeeProps) {
  const [currentFee, setCurrentFee] = useState<number>(0)
  const [days, setDays] = useState<"one" | "two">("one")
  const { isEarlyBird, period } = useEarlyBirdStatus();

  // Watch for nationality changes when in presenter mode
  const formValues = form.watch()
  const isIndonesianStudent = useMemo(() => {
    if (!formValues || !attendingAs || attendingAs !== AttendingAs.PRESENTER) return true
    
    // Type guard to check if we have presenter form values
    const values = formValues as z.infer<typeof formSchema> & { attendingAs: "PRESENTER" }
    if (values.presenters?.[0]?.nationality) {
      return values.presenters[0].nationality.toLowerCase() === 'indonesia'
    }
    
    return true // Default to Indonesian pricing
  }, [formValues, attendingAs])

  // Initialize registration type and handle validation
  useEffect(() => {
    if (!attendingAs || !sessionType) return

    let newRegistrationType: keyof typeof RegistrationType | null = null
    let isFreeRegistration = false

    // Watch for form changes
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'proofOfPayment' && currentFee === 0) {
        // Clear validation errors for free registration
        form.clearErrors('proofOfPayment')
      }
    })

    // Simplified registration type selection based on new pricing structure
    if (attendingAs === AttendingAs.PARTICIPANT) {
      // All participants have the same fee regardless of online/offline or days
      newRegistrationType = sessionType === SessionType.ONLINE
        ? RegistrationType.ONLINE_PARTICIPANT_ONE_DAY
        : RegistrationType.OFFLINE_PARTICIPANT_ONE_DAY
    } else {
      // For presenters - only depends on nationality and online/offline
      if (sessionType === SessionType.ONLINE) {
        newRegistrationType = isIndonesianStudent
          ? RegistrationType.PRESENTER_INDONESIA_STUDENT_ONLINE
          : RegistrationType.PRESENTER_FOREIGNER_ONLINE
      } else {
        newRegistrationType = isIndonesianStudent
          ? RegistrationType.PRESENTER_INDONESIA_STUDENT_OFFLINE
          : RegistrationType.PRESENTER_FOREIGNER_OFFLINE
      }
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
          let fee = await getRegistrationFee(newRegistrationType!, isEarlyBird);
          
          // Apply free registration for online participants if slots are available
          // if (attendingAs === AttendingAs.PARTICIPANT && 
          //     sessionType === SessionType.ONLINE && 
          //     participantCount < MAX_FREE_ONLINE_PARTICIPANTS) {
          //   fee = 0;
          // }
          
          if (typeof fee === 'number') {
            setCurrentFee(fee);
            isFreeRegistration = fee === 0;

            // If it's free registration, clear any existing validation errors
            // if (isFreeRegistration) {
            //   form.clearErrors('proofOfPayment');
            // }
          }
        } catch (error) {
          console.error('Error fetching registration fee:', error);
        }
      };

      fetchFee();
    }

    return () => subscription.unsubscribe()
  }, [attendingAs, sessionType, isIndonesianStudent, form, isEarlyBird])

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

      {attendingAs === AttendingAs.PARTICIPANT && (
        <div className="mb-6">
          <FormLabel className="block mb-2">Number of Days</FormLabel>
          <RadioGroup
            defaultValue="one"
            onValueChange={(value) => setDays(value as "one" | "two")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one" id="one-day" />
              <label htmlFor="one-day" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                1 Day
              </label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="two" id="two-days" />
              <label htmlFor="two-days" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                2 Days
              </label>
            </div> */}
          </RadioGroup>
        </div>
      )}

      <div className="mb-6">
        <FormLabel className="flex items-center justify-between mb-2">
          <span>Registration Fee</span>
          <span className="text-primary font-medium">
            {currentFee === 0 ? 'Free' : currentFee > 0 ? formatPrice(currentFee) : 'Calculating...'}
          </span>
        </FormLabel>
        <div className="text-sm text-muted-foreground">
          {attendingAs === AttendingAs.PARTICIPANT ? (
            <p>
              Participant ({sessionType === SessionType.ONLINE ? 'Online' : 'Offline'})
            </p>
          ) : (
            <p>
              {isIndonesianStudent ? 'Indonesian' : 'Other Nationality'} Presenter ({sessionType === SessionType.ONLINE ? 'Online' : 'Offline'})
            </p>
          )}
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
                    // Skip for free registration
                    if (currentFee === 0) {
                      field.onChange('');
                      form.clearErrors('proofOfPayment');
                      return;
                    }
                    
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

"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Mail, Phone, UserRound, Globe2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

interface ParticipantFormProps {
  form: UseFormReturn<any>
}

const nationalityOptions = [
  "Indonesia",
  "Malaysia",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Australia",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Other",
]

export function ParticipantForm({ form }: ParticipantFormProps) {
  return (
    <div className="border rounded-lg shadow-sm bg-card p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <UserRound className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Talkshow Participant Information</h2>
        </div>
        <p className="text-sm text-muted-foreground">Fill in the participant contact details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Email <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="bg-background pl-9" type="email" placeholder="Enter your email" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Affiliation <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="bg-background pl-9" placeholder="Enter your university, company, or organization" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input className="bg-background" placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Nationality <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nationalityOptions.map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      <span className="inline-flex items-center gap-2">
                        <Globe2 className="h-3.5 w-3.5" />
                        {nationality}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Phone Number <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="bg-background pl-9" type="tel" placeholder="01012345678" {...field} />
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground">Write numbers only, without "-".</p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

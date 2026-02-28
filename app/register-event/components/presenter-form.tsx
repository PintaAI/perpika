"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Mail, GraduationCap, FileText, PresentationIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { CurrentStatus, TopicPreference } from "../constants"
import { formSchema } from "../schemas"

interface PresenterFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
}

export function PresenterForm({ form }: PresenterFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "presenters"
  })

  return (
    <div className="border rounded-lg shadow-sm bg-card p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <PresentationIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Presenter Information</h2>
        </div>
        <p className="text-sm text-muted-foreground">Add details for all presenters</p>
      </div>
      
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-lg border bg-background p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Presenter {index + 1}</h3>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <FormField
              control={form.control}
              name={`presenters.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Name {index === 0 && <span className="text-destructive">*</span>}</FormLabel>
                  <FormControl>
                    <Input className="bg-background" placeholder="Enter presenter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`presenters.${index}.nationality`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Nationality {index === 0 && <span className="text-destructive">*</span>}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Malaysia">Malaysia</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {fields.length < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", nationality: "" })}
            className="w-full bg-background hover:bg-accent"
          >
            + Add Another Presenter
          </Button>
        )}
      </div>

      <div className="mt-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg mb-6">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Contact Details</h3>
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Email <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="bg-background" type="email" placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Password <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="bg-background" type="password" placeholder="Enter password for presenter login" {...field} />
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
                <FormLabel className="font-medium">Affiliation/Organization/Institution <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="bg-background" placeholder="Enter your affiliation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Academic Information</h3>
          </div>

          <FormField
            control={form.control}
            name="currentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Current Status <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your current status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CurrentStatus.BACHELOR_STUDENT}>Bachelor Student</SelectItem>
                    <SelectItem value={CurrentStatus.MASTER_STUDENT}>Master Student</SelectItem>
                    <SelectItem value={CurrentStatus.PHD_STUDENT}>PhD Student</SelectItem>
                    <SelectItem value={CurrentStatus.RESEARCHER_PROFESSIONAL}>Researcher/Professional</SelectItem>
                    <SelectItem value={CurrentStatus.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topicPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Topic Preference <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your topic preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TopicPreference.ENGINEERING}>Engineering</SelectItem>
                    <SelectItem value={TopicPreference.HEALTH_SCIENCE}>Health Science</SelectItem>
                    <SelectItem value={TopicPreference.LIFE_SCIENCE}>Life Science</SelectItem>
                    <SelectItem value={TopicPreference.EARTH_SCIENCE}>Earth Science</SelectItem>
                    <SelectItem value={TopicPreference.MATERIAL_SCIENCE}>Material Science</SelectItem>
                    <SelectItem value={TopicPreference.SOCIAL_LAW_POLITICAL_SCIENCE}>Social, Law & Political Science</SelectItem>
                    <SelectItem value={TopicPreference.HUMANITIES}>Humanities</SelectItem>
                    <SelectItem value={TopicPreference.SPORTS_AND_ARTS}>Sports & Arts</SelectItem>
                    <SelectItem value={TopicPreference.BUSINESS_PUBLIC_ADMINISTRATION}>Business & Public Administration</SelectItem>
                    <SelectItem value={TopicPreference.EDUCATION}>Education</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg mb-6">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Presentation Details</h3>
          </div>

          <FormField
            control={form.control}
            name="presentationTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Presentation Title <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="bg-background" placeholder="Enter your presentation title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="PaperSubmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Upload Paper (PDF) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={(downloadURL) => {
                      field.onChange(downloadURL)
                    }}
                  />
                </FormControl>
                {field.value && (
                  <div className="text-sm text-green-600">
                    Paper uploaded successfully
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      </div>
    </div>
  )
}

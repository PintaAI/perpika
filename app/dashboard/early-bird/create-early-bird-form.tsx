"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { toast } from "sonner"

type EarlyBirdFormProps = {
  periodId?: number
  initialStartDate?: string | Date
  initialEndDate?: string | Date
}

function toDateTimeLocal(value: string | Date | undefined) {
  if (!value) return ""
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function EarlyBirdForm({ periodId, initialStartDate, initialEndDate }: EarlyBirdFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isEditMode = typeof periodId === "number"

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const startDate = formData.get('startDate')
      const endDate = formData.get('endDate')

      const response = await fetch('/api/early-bird', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(isEditMode ? { id: periodId } : {}),
          startDate,
          endDate,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create early bird period')
      }

      toast.success(isEditMode ? 'Early bird period updated successfully' : 'Early bird period created successfully')
      
      if (formRef.current && !isEditMode) {
        formRef.current.reset()
      }

      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Start Date
        </label>
        <Input
          type="datetime-local"
          name="startDate"
          required
          defaultValue={toDateTimeLocal(initialStartDate)}
          min={isEditMode ? undefined : new Date().toISOString().slice(0, 16)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">
          End Date
        </label>
        <Input
          type="datetime-local"
          name="endDate"
          required
          defaultValue={toDateTimeLocal(initialEndDate)}
          min={isEditMode ? undefined : new Date().toISOString().slice(0, 16)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Early Bird Period")}
      </Button>
    </form>
  )
}

export function CreateEarlyBirdForm() {
  return <EarlyBirdForm />
}

export function EditEarlyBirdForm({ periodId, initialStartDate, initialEndDate }: EarlyBirdFormProps) {
  return (
    <EarlyBirdForm
      periodId={periodId}
      initialStartDate={initialStartDate}
      initialEndDate={initialEndDate}
    />
  )
}

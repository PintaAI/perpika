import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import {
  CalendarIcon,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export default function ThankYouPage() {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <Image
            src="/perpika.png"
            alt="ICONIK 2026"
            width={180}
            height={90}
            className="mx-auto rounded-lg"
            priority
          />
          <Alert className="bg-green-50 border-green-200 max-w-lg mx-auto">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 font-semibold">
              Registration Successful!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Thank you for registering for ICONIK 2026.
            </AlertDescription>
          </Alert>
        </div>

        <Card className="border-2 shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader>
            <h1 className="text-4xl font-bold text-center text-foreground">
              Welcome to ICONIK 2026!
            </h1>
            <p className="text-center text-muted-foreground">
              We have received your registration. Our team will contact you shortly via email with further information.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Return to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-foreground">Presenter Information</h2>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              If you are a presenter, you can <Link href="/login" className="text-primary underline">log in here</Link> to view the status of your submitted papers and take further actions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-foreground">
              What's Next?
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/#about" className="block">
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">About ICONIK 2026</h3>
                      <p className="text-sm text-muted-foreground">Read event overview</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/#venue" className="block">
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Location</h3>
                      <p className="text-sm text-muted-foreground">Venue information</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-foreground">
              Follow PERPIKA
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-6">
              <Link
                href="https://www.instagram.com/perpika_korea"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="p-3 rounded-full bg-primary/5 transition-all duration-300 group-hover:bg-primary/10">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
              </Link>
              <Link
                href="https://www.facebook.com/perpika.korea"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="p-3 rounded-full bg-primary/5 transition-all duration-300 group-hover:bg-primary/10">
                  <Facebook className="h-6 w-6 text-primary" />
                </div>
              </Link>
              <Link
                href="https://www.linkedin.com/company/perpika"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="p-3 rounded-full bg-primary/5 transition-all duration-300 group-hover:bg-primary/10">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

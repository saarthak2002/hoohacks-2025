'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const params = new URLSearchParams(searchParams);
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    let showBanner = false;
    if(params.get('signup') === 'true') {
        showBanner = true;
    }

    let showLogOutBanner = false;
    if(params.get('logout') === 'true') {
        showLogOutBanner = true;
    }

    return (
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden py-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form action={formAction} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                  {showBanner && <div className="flex h-8 items-end space-x-1 mb-1" aria-live="polite" aria-atomic="true">
                    <p className="text-sm text-green-500">Your account was created. Please login below.</p>
                  </div>}
                  {showLogOutBanner && <div className="flex h-8 items-end space-x-1 mb-1" aria-live="polite" aria-atomic="true">
                    <p className="text-sm text-green-500">Thanks for stopping by!</p>
                  </div>}
                    <h1 className="text-2xl font-bold">Nourish Your Brain</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your DoomLearning account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@doomlearning.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" name="password" type="password" placeholder="********" required />
                  </div>
                  <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    New here? <Link href="/signup">Register</Link>
                  </div>
                  <input type="hidden" name="redirectTo" value={callbackUrl} />
                  <Button type="submit" className="w-full" aria-disabled={isPending}>
                    Login
                  </Button>
                  <div 
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {errorMessage && (
                        <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/29/Himalayas%2C_Ama_Dablam%2C_Nepal.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h2 className="text-lg md:text-xl text-white mb-1 font-medium">Did you know?</h2>
                  <p className="text-white font-extralight">The Himalayas include the highest mountains in the world, with more than 110 peaks rising to elevations of 24,000+ feet.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div> */}
        </div>
      )
}
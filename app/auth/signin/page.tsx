import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProviders } from "next-auth/react";
import SignInComponent from "@/components/SignInComponent";

export default async function SignIn({
  searchParams
}: {
  searchParams: { callbackUrl?: string }
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    // If already logged in, redirect to callback URL or home
    redirect(searchParams.callbackUrl || '/');
  }

  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect with developers and build amazing projects
          </p>
        </div>

        <div className="mt-8">
          <SignInComponent providers={providers} />
        </div>
      </div>
    </div>
  );
}

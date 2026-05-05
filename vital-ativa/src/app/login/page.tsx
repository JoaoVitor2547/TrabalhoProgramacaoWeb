import { signIn } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Entrar" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-400 ring-1 ring-brand-500/20">
            Vital Ativa
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            Acesse sua conta para gerenciar seu plano e treinos
          </p>
        </div>

        <Card className="border-ink-700 bg-ink-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Entrar na conta</CardTitle>
            <CardDescription className="text-ink-400">
              Use sua conta Google para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo: callbackUrl ?? "/" })
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-ink-600 bg-ink-700 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-ink-600 active:scale-[0.98]"
              >
                <GoogleIcon />
                Continuar com Google
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-ink-500">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="text-brand-400 underline-offset-2 hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-brand-400 underline-offset-2 hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  )
}

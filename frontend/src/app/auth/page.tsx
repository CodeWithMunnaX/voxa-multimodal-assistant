"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mic, Loader2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const { login } = useAuthStore()

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string).trim()
    const password = (formData.get("password") as string).trim()

    try {
      if (!isLogin) {
        const name = (formData.get("name") as string).trim()
        const confirmPassword = (formData.get("confirmPassword") as string).trim()

        if (password !== confirmPassword) {
          setError("Passwords do not match")
          toast.error("Passwords do not match")
          setIsLoading(false)
          return
        }

        await api.post('/auth/register', { email, name, password })
        toast.success("Account created successfully!")
      }

      // Automatically login after successful registration or if in login mode
      const loginData = await api.post<{ access_token: string }>('/auth/login', { email, password })
      
      await login(loginData.access_token)
      toast.success("Welcome back!")
      router.push("/chat")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      toast.error(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  // Public demo account with sample chats, notes and documents (created by Backend-/seed.py)
  async function handleDemoLogin() {
    setIsLoading(true)
    setError("")
    try {
      const loginData = await api.post<{ access_token: string }>('/auth/login', {
        email: "demo@codewithmunnax.com",
        password: "Demo@1234",
      })
      await login(loginData.access_token)
      toast.success("Logged in to the demo workspace")
      router.push("/chat")
    } catch (err: any) {
      setError(err.message || "Demo login failed. The server may be waking up, try again in a minute.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-transparent z-10" />
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/auth-hero.png" 
          alt="Voxa AI Background" 
          className="w-full h-full object-cover" 
          style={!isLogin ? { transform: 'scaleX(-1)' } : undefined}
        />
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-10 transition-all duration-700 ${isLogin ? 'top-1/4 left-1/4 bg-[#7C5CFF]/15' : 'top-0 right-0 bg-purple-400/20'}`} />
        <div className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-10 transition-all duration-700 ${isLogin ? 'bottom-1/4 right-1/4 bg-[#4F8CFF]/15' : 'bottom-0 left-0 bg-[#7C5CFF]/15'}`} />
      </div>

      <div className="w-full max-w-md p-6 z-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/90 backdrop-blur-2xl border border-border p-8 rounded-3xl shadow-[0_8px_40px_-12px_rgba(124,92,255,0.25)]"
        >
          <Link href="/" className="flex items-center justify-center gap-3 font-bold text-3xl tracking-tight mb-8 transition-transform hover:opacity-80">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white transition-colors duration-500 ${isLogin ? 'from-[#7C5CFF] to-[#4F8CFF] shadow-[0_4px_16px_-4px_rgba(124,92,255,0.5)]' : 'from-[#4F8CFF] to-[#7C5CFF] shadow-[0_4px_16px_-4px_rgba(124,92,255,0.5)]'}`}>
              <Mic className="h-5 w-5" />
            </div>
            <span className="text-foreground">Voxa <span className={`font-medium transition-colors duration-500 ${isLogin ? 'text-primary' : 'text-purple-600'}`}>AI</span></span>
          </Link>
          
          <div className="mb-8 text-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "Enter your credentials to access your workspace." : "Join us to start building the future."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 overflow-hidden"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="pb-4">
                    <Label htmlFor="name" className="text-foreground">Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      type="text" 
                      placeholder="John Doe" 
                      required={!isLogin} 
                      className={`bg-white border-input h-12 rounded-xl focus-visible:ring-1 text-foreground placeholder:text-muted-foreground/70 transition-all mt-2 ${!isLogin ? 'focus-visible:ring-purple-500' : 'focus-visible:ring-indigo-500'}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="name@example.com" 
                required 
                className={`bg-white border-input h-12 rounded-xl focus-visible:ring-1 text-foreground placeholder:text-muted-foreground/70 transition-all ${isLogin ? 'focus-visible:ring-indigo-500' : 'focus-visible:ring-purple-500'}`}
              />
            </div>
            
            {isLogin ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••••••"
                  required
                  className="bg-white border-input h-12 rounded-xl focus-visible:ring-1 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-indigo-500 transition-all"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="bg-white border-input h-12 rounded-xl focus-visible:ring-1 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="bg-white border-input h-12 rounded-xl focus-visible:ring-1 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-2 pt-1 pb-2 overflow-hidden"
                >
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded" 
                  />
                  <label htmlFor="remember" className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Remember me for 30 days
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-bold text-base shadow-[0_4px_24px_-8px_rgba(124,92,255,0.5)] transition-all group relative overflow-hidden mt-2" disabled={isLoading}>
              <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ${isLogin ? 'from-white/0 via-white/20 to-white/0' : 'from-white/0 via-white/20 to-white/0'}`} />
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center">
                  {isLogin ? "Sign In" : "Create account"}
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            {isLogin && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full h-12 rounded-xl font-semibold bg-secondary border-border text-secondary-foreground hover:bg-accent"
              >
                Try demo account
              </Button>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground pt-6 border-t border-border">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }} 
              className={`font-semibold transition-colors ${isLogin ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-purple-600'}`}
            >
              {isLogin ? "Create one now" : "Sign in here"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

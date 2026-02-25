import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useActor } from '../hooks/useActor';
import { Eye, EyeOff, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type AuthTab = 'login' | 'register';
type Step = 'credentials' | 'otp';

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useCustomerAuth();
  const { actor } = useActor();

  const [tab, setTab] = useState<AuthTab>('login');
  const [step, setStep] = useState<Step>('credentials');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Pending credentials for post-OTP auth
  const [pendingLoginEmail, setPendingLoginEmail] = useState('');
  const [pendingLoginPassword, setPendingLoginPassword] = useState('');
  const [pendingRegData, setPendingRegData] = useState<{name: string; phone: string; email: string; password: string} | null>(null);

  const [error, setError] = useState('');
  const [credLoading, setCredLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }
    setCredLoading(true);
    try {
      // Validate credentials first by attempting login
      const customerId = await login(loginEmail, loginPassword);
      if (customerId) {
        // Get phone for OTP - we need to fetch customer profile
        // Since we don't have phone before login, use email as identifier for OTP
        // We'll use the email as the "phone" key for OTP since we don't have phone at this point
        // Actually, let's use a placeholder approach: generate OTP with email
        if (!actor) throw new Error('Actor not available');
        const otp = await actor.generateOtp(loginEmail);
        setGeneratedOtp(otp);
        setOtpPhone(loginEmail);
        setPendingLoginEmail(loginEmail);
        setPendingLoginPassword(loginPassword);
        setStep('otp');
        setOtpValue('');
        setOtpError('');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setCredLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regPhone || !regEmail || !regPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setCredLoading(true);
    try {
      if (!actor) throw new Error('Actor not available');
      const otp = await actor.generateOtp(regPhone);
      setGeneratedOtp(otp);
      setOtpPhone(regPhone);
      setPendingRegData({ name: regName, phone: regPhone, email: regEmail, password: regPassword });
      setStep('otp');
      setOtpValue('');
      setOtpError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setCredLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      if (!actor) throw new Error('Actor not available');
      const isValid = await actor.verifyOtp(otpPhone, otpValue);
      if (!isValid) {
        setOtpError('Invalid or expired OTP. Please try again.');
        setOtpLoading(false);
        return;
      }
      // OTP verified — complete the flow
      if (tab === 'login') {
        // Already logged in from credential step, just navigate
        navigate({ to: '/' });
      } else if (tab === 'register' && pendingRegData) {
        await register(pendingRegData.name, pendingRegData.phone, pendingRegData.email, pendingRegData.password);
        navigate({ to: '/' });
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError('');
    try {
      if (!actor) throw new Error('Actor not available');
      const otp = await actor.generateOtp(otpPhone);
      setGeneratedOtp(otp);
      setOtpValue('');
    } catch (err: any) {
      setOtpError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    setStep('credentials');
    setError('');
    setOtpError('');
    setOtpValue('');
    setGeneratedOtp('');
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtpValue('');
    setOtpError('');
    setGeneratedOtp('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">GS Medical</h1>
          <p className="text-muted-foreground text-sm mt-1">Your trusted pharmacy partner</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {step === 'credentials' ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                    tab === 'login'
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleTabChange('register')}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                    tab === 'register'
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                {tab === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={credLoading || isLoading}>
                      {credLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                      ) : (
                        'Continue to OTP Verification'
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Your full name"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Phone Number</Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email Address</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={credLoading}>
                      {credLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending OTP...</>
                      ) : (
                        'Continue to OTP Verification'
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </>
          ) : (
            /* OTP Step */
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">OTP Verification</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  A verification code has been sent to{' '}
                  <span className="font-semibold text-foreground">
                    {maskPhone(otpPhone)}
                  </span>
                </p>
              </div>

              {/* Simulated OTP Display */}
              <div className="mb-5 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Your OTP (Demo)</p>
                <p className="text-3xl font-bold text-primary tracking-widest">{generatedOtp}</p>
                <p className="text-xs text-muted-foreground mt-1">Valid for 5 minutes</p>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {otpError}
                </div>
              )}

              <div className="mb-5">
                <Label className="block text-center mb-3">Enter 6-digit OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full mb-3"
                disabled={otpLoading || otpValue.length !== 6}
              >
                {otpLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                ) : (
                  'Verify & Continue'
                )}
              </Button>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToCredentials}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  {resendLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

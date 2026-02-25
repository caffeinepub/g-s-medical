import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { Eye, EyeOff, Store, ShieldCheck, RefreshCw, Loader2, Clock, XCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type Step = 'credentials' | 'otp' | 'blocked';
type BlockReason = 'pending' | 'rejected';

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export default function SellerLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [credLoading, setCredLoading] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Block state
  const [blockReason, setBlockReason] = useState<BlockReason | null>(null);

  // Store seller info for post-OTP login
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPasswordHash, setPendingPasswordHash] = useState('');

  const hashPassword = (pwd: string): string => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const char = pwd.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setCredLoading(true);
    try {
      if (!actor) throw new Error('Actor not available');
      const passwordHash = hashPassword(password);
      const success = await actor.sellerLogin(email, passwordHash);
      if (success) {
        // Fetch seller profile to get phone number
        const seller = await actor.getSellerById(email);
        const phone = seller?.phone || email;
        const otp = await actor.generateOtp(phone);
        setGeneratedOtp(otp);
        setOtpPhone(phone);
        setPendingEmail(email);
        setPendingPasswordHash(passwordHash);
        setStep('otp');
        setOtpValue('');
        setOtpError('');
        // Store session
        localStorage.setItem('sellerEmail', email);
        localStorage.setItem('sellerPasswordHash', passwordHash);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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

      // OTP verified — now check seller verification status
      const seller = await actor.getSellerById(pendingEmail);
      if (!seller) {
        setOtpError('Seller account not found. Please contact support.');
        setOtpLoading(false);
        return;
      }

      if (seller.verificationStatus === 'verified' && seller.isActive) {
        // Fully approved — go to dashboard
        navigate({ to: '/seller/dashboard' });
      } else if (seller.verificationStatus === 'rejected') {
        // Rejected — show rejection message
        setBlockReason('rejected');
        setStep('blocked');
      } else {
        // Pending or inactive — show pending message
        setBlockReason('pending');
        setStep('blocked');
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

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtpValue('');
    setOtpError('');
    setGeneratedOtp('');
    setBlockReason(null);
    localStorage.removeItem('sellerEmail');
    localStorage.removeItem('sellerPasswordHash');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Seller Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">GS Medical — Manage your store</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {step === 'credentials' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Sign In to Your Store</h2>
              <p className="text-muted-foreground text-sm mb-5">Enter your registered seller credentials</p>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="seller-email">Email Address</Label>
                  <Input
                    id="seller-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seller@example.com"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seller-password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="seller-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={credLoading}>
                  {credLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                  ) : (
                    'Continue to OTP Verification'
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-5 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have a seller account?{' '}
                  <button
                    onClick={() => navigate({ to: '/seller/register' })}
                    className="text-primary font-medium hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">OTP Verification</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  A verification code has been sent to{' '}
                  <span className="font-medium text-foreground">{maskPhone(otpPhone)}</span>
                </p>
              </div>

              {/* Show OTP on screen for demo */}
              {generatedOtp && (
                <div className="mb-5 p-3 bg-primary/5 border border-primary/20 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">Your OTP (demo)</p>
                  <p className="text-2xl font-bold tracking-widest text-primary font-mono">{generatedOtp}</p>
                </div>
              )}

              {otpError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {otpError}
                </div>
              )}

              <div className="flex justify-center mb-5">
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

              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpValue.length !== 6}
              >
                {otpLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                ) : (
                  'Verify & Sign In'
                )}
              </Button>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  onClick={handleBackToCredentials}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
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

          {step === 'blocked' && blockReason === 'pending' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Application Under Review</h2>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                <p className="text-sm text-amber-800 font-medium mb-1">Your account is under review</p>
                <p className="text-sm text-amber-700">
                  Your seller application has been received and is currently being reviewed by our admin team.
                  You will be notified once your account is approved.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Need Help?</p>
                <div className="space-y-2">
                  <a
                    href="tel:+919270556455"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    +91 9270556455
                  </a>
                  <a
                    href="mailto:gauravsaswade@gsgroupswebstore.in"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    gauravsaswade@gsgroupswebstore.in
                  </a>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackToCredentials}
              >
                Back to Login
              </Button>
            </div>
          )}

          {step === 'blocked' && blockReason === 'rejected' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Application Rejected</h2>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-5">
                <p className="text-sm text-red-800 font-medium mb-1">Your application was not approved</p>
                <p className="text-sm text-red-700">
                  Unfortunately, your seller application has been rejected. Please contact our support team
                  for more information or to appeal this decision.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact Support</p>
                <div className="space-y-2">
                  <a
                    href="tel:+919270556455"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    +91 9270556455
                  </a>
                  <a
                    href="mailto:gauravsaswade@gsgroupswebstore.in"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    gauravsaswade@gsgroupswebstore.in
                  </a>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackToCredentials}
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

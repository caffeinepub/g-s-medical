import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { Store, Upload, Eye, EyeOff, CheckCircle, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type Step = 1 | 2 | 3;

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export default function SellerRegisterPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 fields
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 fields
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
  const aadhaarRef = useRef<HTMLInputElement | null>(null);
  const panRef = useRef<HTMLInputElement | null>(null);
  const licenseRef = useRef<HTMLInputElement | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Step 3 OTP fields
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const hashPassword = (pwd: string): string => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const char = pwd.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!storeName || !ownerName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!aadhaarNumber || !panNumber || !medicalLicenseNumber) {
      setError('Please fill in all document numbers.');
      return;
    }
    setIsLoading(true);
    try {
      if (!actor) throw new Error('Actor not available');
      const otp = await actor.generateOtp(phone);
      setGeneratedOtp(otp);
      setOtpValue('');
      setOtpError('');
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSubmit = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      if (!actor) throw new Error('Actor not available');
      const isValid = await actor.verifyOtp(phone, otpValue);
      if (!isValid) {
        setOtpError('Invalid or expired OTP. Please try again.');
        setOtpLoading(false);
        return;
      }
      // OTP verified — submit registration
      const passwordHash = hashPassword(password);
      await actor.sellerRegister(
        storeName,
        ownerName,
        email,
        phone,
        passwordHash,
        aadhaarNumber,
        panNumber,
        medicalLicenseNumber
      );
      // Store session
      localStorage.setItem('sellerEmail', email);
      localStorage.setItem('sellerPasswordHash', passwordHash);
      navigate({ to: '/seller/dashboard' });
    } catch (err: any) {
      setOtpError(err.message || 'Registration failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError('');
    try {
      if (!actor) throw new Error('Actor not available');
      const otp = await actor.generateOtp(phone);
      setGeneratedOtp(otp);
      setOtpValue('');
    } catch (err: any) {
      setOtpError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Store Info' },
    { num: 2, label: 'Documents' },
    { num: 3, label: 'OTP Verify' },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Seller Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">Join GS Medical as a verified seller</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep > s.num
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === s.num
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-1 font-medium ${currentStep === s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${currentStep > s.num ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
          {/* Step 1: Store Info */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Store Information</h2>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="Your pharmacy name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="owner-name">Owner Name</Label>
                  <Input
                    id="owner-name"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="Full legal name"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reg-email">Email Address</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="business@example.com"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-phone">Phone Number</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
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
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">
                Next: Document Details →
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/seller/login' })}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Document Verification</h2>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
                Please provide your official document numbers for verification. Your account will be reviewed within 2-3 business days.
              </div>

              {/* Aadhaar */}
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  className="mt-1"
                  required
                />
                <div className="mt-2">
                  <input
                    ref={aadhaarRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => setAadhaarFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={() => aadhaarRef.current?.click()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-3 py-2 w-full justify-center transition-colors hover:border-primary"
                  >
                    <Upload className="w-4 h-4" />
                    {aadhaarFile ? aadhaarFile.name : 'Upload Aadhaar (optional)'}
                  </button>
                </div>
              </div>

              {/* PAN */}
              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="mt-1"
                  required
                />
                <div className="mt-2">
                  <input
                    ref={panRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => setPanFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={() => panRef.current?.click()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-3 py-2 w-full justify-center transition-colors hover:border-primary"
                  >
                    <Upload className="w-4 h-4" />
                    {panFile ? panFile.name : 'Upload PAN (optional)'}
                  </button>
                </div>
              </div>

              {/* Medical License */}
              <div>
                <Label htmlFor="license">Medical License Number</Label>
                <Input
                  id="license"
                  value={medicalLicenseNumber}
                  onChange={e => setMedicalLicenseNumber(e.target.value)}
                  placeholder="MH-XXXX-XXXXXX"
                  className="mt-1"
                  required
                />
                <div className="mt-2">
                  <input
                    ref={licenseRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => setLicenseFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={() => licenseRef.current?.click()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-3 py-2 w-full justify-center transition-colors hover:border-primary"
                  >
                    <Upload className="w-4 h-4" />
                    {licenseFile ? licenseFile.name : 'Upload License (optional)'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setCurrentStep(1); setError(''); }}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending OTP...</>
                  ) : (
                    'Next: OTP Verification →'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">OTP Verification</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  A verification code has been sent to{' '}
                  <span className="font-semibold text-foreground">
                    {maskPhone(phone)}
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
                onClick={handleVerifyAndSubmit}
                className="w-full mb-3"
                disabled={otpLoading || otpValue.length !== 6}
              >
                {otpLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying & Registering...</>
                ) : (
                  'Verify & Complete Registration'
                )}
              </Button>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setCurrentStep(2); setOtpValue(''); setOtpError(''); }}
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
          Need help? Contact{' '}
          <a href="tel:+919270556455" className="text-primary hover:underline">+91 9270556455</a>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitInquiry } from '../hooks/useQueries';

export default function ContactPage() {
  const submitInquiry = useSubmitInquiry();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !message.trim()) {
      setError('Please fill in your name and message.');
      return;
    }
    try {
      await submitInquiry.mutateAsync({ name: name.trim(), phone: phone.trim(), message: message.trim() });
      setSubmitted(true);
      setName(''); setPhone(''); setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-gradient text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            We're here to help. Reach out to us for any queries about medicines, orders, or healthcare advice.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Have a question about a medicine, need to check availability, or want to place a bulk order?
                  Our team is ready to assist you. Contact us through any of the channels below.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Customer Care - two numbers */}
                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border card-hover group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Customer Care</p>
                    <a
                      href="tel:+919270556455"
                      className="block font-bold text-lg text-primary hover:underline"
                    >
                      +91 9270556455
                    </a>
                    <a
                      href="tel:+919766343454"
                      className="block font-bold text-lg text-primary hover:underline"
                    >
                      +91 9766343454
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Available Mon–Sat, 8 AM – 9 PM</p>
                  </div>
                </div>

                <a
                  href="mailto:gauravsaswade@gsgroupswebstore.in"
                  className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border card-hover group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-1">Email Address</p>
                    <p className="font-bold text-primary break-all">gauravsaswade@gsgroupswebstore.in</p>
                    <p className="text-xs text-muted-foreground mt-1">We reply within 24 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-1">Store Address</p>
                    <p className="font-medium text-foreground leading-relaxed">
                      At-Bhaje, Post-Malavali, Tal-Maval,<br />
                      Dist-Pune, Near Malavali Railway Station,<br />
                      Malavali, Maharashtra-410405
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-1">Store Hours</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Monday – Saturday</span>
                        <span className="font-medium">8:00 AM – 9:00 PM</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium">9:00 AM – 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <div className="bg-card rounded-3xl border border-border p-8">
                <h2 className="font-heading text-2xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll contact you shortly.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 text-destructive text-sm rounded-xl p-3">
                        {error}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="iname">Full Name *</Label>
                      <Input
                        id="iname"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        className="mt-1 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="iphone">Phone Number</Label>
                      <Input
                        id="iphone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXXXXXXX"
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imessage">Message *</Label>
                      <Textarea
                        id="imessage"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="How can we help you?"
                        className="mt-1 rounded-xl resize-none"
                        rows={5}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl font-bold"
                      size="lg"
                      disabled={submitInquiry.isPending}
                    >
                      {submitInquiry.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

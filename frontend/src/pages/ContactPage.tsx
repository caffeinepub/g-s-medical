import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitInquiry } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitInquiry = useSubmitInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await submitInquiry.mutateAsync({ name, phone, message });
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
      toast.success('Inquiry submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit inquiry');
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Customer Care',
      content: (
        <div className="space-y-1">
          <a href="tel:+919270556455" className="block text-primary hover:underline">+91 92705 56455</a>
          <a href="tel:+919766343454" className="block text-primary hover:underline">+91 97663 43454</a>
        </div>
      ),
    },
    {
      icon: Mail,
      title: 'Email',
      content: (
        <a href="mailto:gsmedical@gmail.com" className="text-primary hover:underline">
          gsmedical@gmail.com
        </a>
      ),
    },
    {
      icon: MapPin,
      title: 'Address',
      content: <span className="text-muted-foreground">G&S Medical Store, Pune, Maharashtra, India</span>,
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: (
        <div className="space-y-1 text-muted-foreground">
          <p>Monday – Saturday: 8AM – 9PM</p>
          <p>Sunday: Closed</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help. Reach out to us for any queries or assistance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">{info.title}</h3>
                    </div>
                    <div className="text-sm">{info.content}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inquiry Form */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Send an Inquiry</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-green-600 text-4xl mb-3">✓</div>
                <h3 className="font-bold text-green-800 mb-2">Inquiry Submitted!</h3>
                <p className="text-green-700 text-sm mb-4">We'll get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitInquiry.isPending}>
                  {submitInquiry.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

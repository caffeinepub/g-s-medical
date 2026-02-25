import React from 'react';
import { Link } from '@tanstack/react-router';
import { Shield, Heart, Star, Award, Phone, Mail, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const values = [
  { icon: Shield, title: 'Quality Assurance', desc: 'Every product we stock is sourced from licensed distributors and verified for authenticity.' },
  { icon: Heart, title: 'Community Care', desc: 'We are deeply committed to the health and well-being of the Malavali community.' },
  { icon: Star, title: 'Expert Guidance', desc: 'Our trained pharmacists provide professional advice on medicines and healthcare.' },
  { icon: Award, title: 'Affordable Prices', desc: 'We believe quality healthcare should be accessible to everyone at fair prices.' },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 rounded-full px-4 py-1">
            About G&S Medical
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Serving the Community<br />with Dedication
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            G&S Medical is a trusted pharmacy serving the Malavali community with quality medicines,
            healthcare products, and expert guidance since our founding.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At G&S Medical, our mission is simple: to make quality healthcare accessible to every family
                in Malavali and the surrounding areas. We believe that good health is a fundamental right,
                not a privilege.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We stock a comprehensive range of medicines, vitamins, medical equipment, and personal care
                products — all sourced from trusted manufacturers and licensed distributors. Our team of
                experienced pharmacists is always ready to guide you with professional advice.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="rounded-xl px-4 py-2 text-sm">Licensed Pharmacy</Badge>
                <Badge variant="secondary" className="rounded-xl px-4 py-2 text-sm">500+ Products</Badge>
                <Badge variant="secondary" className="rounded-xl px-4 py-2 text-sm">Expert Pharmacists</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(value => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="bg-card rounded-2xl p-5 border border-border card-hover">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm mb-1">{value.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Owners */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-3">Meet Our Founders</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              G&S Medical was founded by two passionate individuals dedicated to improving healthcare
              access in their community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gaurav Saswade */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden card-hover">
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                <img
                  src="/assets/generated/gaurav-saswade-photo.dim_400x400.jpg"
                  alt="Gaurav Saswade"
                  className="w-full h-full object-cover object-top"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent h-16" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-xl">Gaurav Saswade</h3>
                    <p className="text-primary text-sm font-medium">CEO & Director</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Gaurav Saswade is a visionary entrepreneur with a deep passion for community healthcare.
                  With years of experience in the pharmaceutical industry, he co-founded G&S Medical with
                  the goal of bringing quality medicines and healthcare products to the doorstep of every
                  family in Malavali. His dedication to customer service and commitment to affordable
                  healthcare has made G&S Medical a trusted name in the region. Gaurav's leadership and
                  forward-thinking approach continue to drive the store's growth and community impact.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs rounded-lg">Healthcare Expert</Badge>
                  <Badge variant="secondary" className="text-xs rounded-lg">Community Leader</Badge>
                  <Badge variant="secondary" className="text-xs rounded-lg">Entrepreneur</Badge>
                </div>
                {/* CEO Contact */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">CEO Contact</p>
                    <a
                      href="tel:+919270556455"
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      +91 9270556455
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Shushant Waghmare */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden card-hover">
              <div className="relative h-64 bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
                <img
                  src="/assets/generated/owner-shushant.dim_300x300.png"
                  alt="Shushant Waghmare"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent h-16" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-xl">Shushant Waghmare</h3>
                    <p className="text-primary text-sm font-medium">Co-Founder & Operations Head</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Shushant Waghmare brings exceptional operational expertise and a heartfelt commitment
                  to public health. As the Operations Head of G&S Medical, he ensures that every customer
                  receives the right product with the right guidance. His meticulous attention to quality
                  control and his warm approach to customer care have earned him the trust and respect of
                  the entire Malavali community. Shushant believes that a healthy community is the
                  foundation of a prosperous society, and he works tirelessly to uphold that vision.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs rounded-lg">Operations Expert</Badge>
                  <Badge variant="secondary" className="text-xs rounded-lg">Quality Advocate</Badge>
                  <Badge variant="secondary" className="text-xs rounded-lg">Community Servant</Badge>
                </div>
                {/* Co-Founder Contact */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Co-Founder Contact</p>
                    <a
                      href="tel:+919156896495"
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      +91 9156896495
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-3xl border border-border p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm mb-1">Call Us</p>
                <a href="tel:+919270556455" className="text-primary font-bold hover:underline block">+91 9270556455</a>
                <a href="tel:+919766343454" className="text-primary font-bold hover:underline block">+91 9766343454</a>
              </div>
              <a
                href="mailto:gauravsaswade@gsgroupswebstore.in"
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary hover:bg-border transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm mb-1">Email Us</p>
                <p className="text-primary font-bold text-xs break-all">gauravsaswade@gsgroupswebstore.in</p>
              </a>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm mb-1">Visit Us</p>
                <p className="text-xs text-muted-foreground">Near Malavali Railway Station, Maharashtra-410405</p>
              </div>
            </div>
            <div className="text-center">
              <Button asChild className="rounded-xl" size="lg">
                <Link to="/contact">Send Us a Message</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

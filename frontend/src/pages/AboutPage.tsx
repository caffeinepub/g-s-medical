import { useNavigate } from '@tanstack/react-router';
import { Heart, Award, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    { icon: Heart, title: 'Patient First', description: 'Every decision we make is centered around the health and wellbeing of our customers.' },
    { icon: Award, title: 'Quality Assured', description: 'We stock only genuine, certified medicines from trusted manufacturers.' },
    { icon: Users, title: 'Community Care', description: 'Serving our local community with dedication and personalized healthcare support.' },
    { icon: Target, title: 'Accessibility', description: 'Making quality healthcare products accessible and affordable for everyone.' },
  ];

  const founders = [
    {
      name: 'Gaurav Saswade',
      role: 'Co-Founder & Director',
      image: '/assets/generated/owner-gaurav.dim_300x300.png',
      bio: 'With years of experience in the pharmaceutical industry, Gaurav leads our operations with a commitment to quality and customer satisfaction.',
      phone: '+91 92705 56455',
    },
    {
      name: 'Shushant',
      role: 'Co-Founder & Operations',
      image: '/assets/generated/owner-shushant.dim_300x300.png',
      bio: 'Shushant oversees day-to-day operations and ensures that every customer receives the best possible service and genuine products.',
      phone: '+91 97663 43454',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About G&S Medical</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted healthcare partner, committed to providing quality medicines and exceptional service to our community.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At G&S Medical, we believe that access to quality healthcare is a fundamental right. Our mission is to provide genuine, affordable medicines and healthcare products to every member of our community.
              </p>
              <p className="text-muted-foreground">
                We are committed to maintaining the highest standards of quality, ensuring that every product we sell is authentic and safe for our customers.
              </p>
            </div>
            <div>
              <img
                src="/assets/generated/gs-medical-logo.dim_400x400.png"
                alt="G&S Medical"
                className="rounded-2xl shadow-lg w-full max-w-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Meet Our Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                  }}
                />
                <h3 className="font-bold text-foreground text-lg mb-1">{founder.name}</h3>
                <p className="text-primary text-sm mb-3">{founder.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{founder.bio}</p>
                <a
                  href={`tel:${founder.phone.replace(/\s/g, '')}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {founder.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions or need assistance? We're here to help.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/contact' })}>
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}

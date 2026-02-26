import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Truck, Shield, Clock, Phone, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetProducts } from '../hooks/useQueries';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [] } = useGetProducts();

  const featuredProducts = products.filter(p => p.isAvailable).slice(0, 4);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Thousands of medicines and healthcare products available',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep',
    },
    {
      icon: Shield,
      title: 'Genuine Products',
      description: '100% authentic medicines from trusted manufacturers',
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Open Monday to Saturday, 8AM to 9PM',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                G&S Medical Store
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Your trusted healthcare partner. Quality medicines, genuine products, and expert care — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate({ to: '/products' })}>
                  Shop Now <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/contact' })}>
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/assets/generated/hero-banner.dim_1400x500.png"
                alt="G&S Medical"
                className="rounded-2xl shadow-xl w-full object-cover h-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
              <Button variant="outline" onClick={() => navigate({ to: '/products' })}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <div
                  key={Number(product.id)}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate({ to: '/products' })}
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={product.image.getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹{Number(product.price)}</span>
                      {product.requiresPrescription && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Rx</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seller Portal Banner */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-primary-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Are You a Seller?</h2>
                <p className="text-primary-foreground/80 mb-6">
                  Join our platform and reach thousands of customers. List your medicines and healthcare products today.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate({ to: '/contact' })}
                >
                  Contact Us to Register
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src="/assets/generated/seller-portal-banner.dim_1200x400.png"
                  alt="Seller Portal"
                  className="rounded-xl w-full object-cover h-48"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Our team is here to assist you with your healthcare needs.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/contact' })}>
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
}

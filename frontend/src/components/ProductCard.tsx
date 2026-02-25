import React from 'react';
import { ShoppingCart, Tag, AlertCircle } from 'lucide-react';
import { Product } from '../backend';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  animationDelay?: number;
  visible?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  animationDelay = 0,
  visible = true,
}: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`bg-card rounded-xl overflow-hidden border border-border shadow-sm group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        !prefersReducedMotion && visible ? 'animate-fade-in-up' : ''
      } ${!visible && !prefersReducedMotion ? 'opacity-0' : ''}`}
      style={!prefersReducedMotion ? { animationDelay: `${animationDelay}ms` } : {}}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-muted">
        <img
          src={product.image.getDirectURL()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.requiresPrescription && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Rx
            </span>
          )}
          {!product.isAvailable && (
            <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        {product.medicineType && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              {product.medicineType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{product.category}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">₹{Number(product.price)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ unit</span>
          </div>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.isAvailable}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
              product.isAvailable
                ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 hover:shadow-md active:scale-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.isAvailable ? 'Add' : 'N/A'}
          </button>
        </div>
      </div>
    </div>
  );
}

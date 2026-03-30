import React from "react";
import { Helmet } from "react-helmet-async";
import type { Product } from "@/data/products";

// Generic structured data injector
export const StructuredData: React.FC<{ data: object }> = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://liimranaturals.com",
    "name": "Liimra Naturals",
    "logo": "https://liimranaturals.com/favicon-32.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9999999999", // Placeholder
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/liimranaturals",
      "https://www.instagram.com/liimranaturals"
    ]
  };

  return <StructuredData data={schema} />;
};

export const ProductSchema = ({ product }: { product: Product }) => {
  const size = product.sizes[0];
  const url = `https://liimranaturals.com/products/${product.id}`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://liimranaturals.com${product.image}`,
    "description": product.detailedDescription || product.tagline,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Liimra Naturals"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "INR",
      "price": size.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviews.toString()
    }
  };

  return <StructuredData data={schema} />;
};

export const FAQSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is ragi flour good for diabetes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ragi flour has a low glycemic index and is rich in fiber and polyphenols, making it an excellent choice for blood sugar management."
        }
      },
      {
        "@type": "Question",
        "name": "How fresh are Liimra Naturals flours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our flours are chakki-fresh and stone-ground only after you place your order, ensuring maximum nutritional retention."
        }
      },
      {
        "@type": "Question",
        "name": "What is the shelf life of the flour?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because they are freshly milled without preservatives, we recommend consuming them within 3 months of the manufacturing date."
        }
      }
    ]
  };

  return <StructuredData data={schema} />;
};

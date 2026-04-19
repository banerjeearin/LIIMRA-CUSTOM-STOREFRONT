import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Liimra Naturals — Stone-Ground Millet Flours",
  description = "Control sugar naturally with chakki-fresh stone-ground millet flours. Ragi, Jowar, Bajra & Kangni. FSSAI certified.",
  canonicalUrl = "https://liimranaturals.com",
  ogImage = "https://liimranaturals.com/og-image.jpg",
  noindex = false,
}) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* hreflang for Indian audience prioritization */}
      <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@liimranaturals" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Theme Color for mobile */}
      <meta name="theme-color" content="#3e4c1d" />

    </Helmet>
  );
};

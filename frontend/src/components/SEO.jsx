import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image, 
  url, 
  price, 
  currency = 'USD',
  type = 'website' 
}) => {
  const siteName = 'TechNova Store';
  const defaultDescription = 'Tecnología premium y diseño minimalista directo a tu puerta.';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Product Specific OG */}
      {type === 'product' && price && (
        <meta property="product:price:amount" content={price} />
      )}
      {type === 'product' && (
        <meta property="product:price:currency" content={currency} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
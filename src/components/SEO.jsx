import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteTitle = 'TechNova - La Tecnología del Futuro';
  const defaultDescription = 'Descubre nuestra nueva colección de electrónicos diseñados para mejorar tu vida. Calidad y rendimiento incomparables.';
  const defaultImage = 'https://technova-store.com/og-image.jpg'; // Reemplazar con URL real
  const siteUrl = 'https://technova-store.com'; // Reemplazar con URL real

  const metaTitle = title ? `${title} | TechNova` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image ? `${siteUrl}${image}` : defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="TechNova" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;

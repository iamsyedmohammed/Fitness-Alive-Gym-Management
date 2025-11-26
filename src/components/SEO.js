import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = "Fitness Alive Gym - Best Gym in Hyderabad | Yakutpura & Madanapet",
  description = "Join thousands of members who have transformed their lives. Experience world-class facilities, expert trainers, and a supportive community dedicated to your success. Best gym in Hyderabad with locations in Yakutpura and Madanapet.",
  keywords = "gym hyderabad, fitness center hyderabad, gym yakutpura, gym madanapet, weight training, cardio, fitness training, personal trainer hyderabad, gym membership hyderabad, best gym hyderabad",
  image = "https://slateblue-turkey-331136.hostingersite.com/og-image.jpg",
  type = "website"
}) => {
  const location = useLocation();
  const baseUrl = "https://slateblue-turkey-331136.hostingersite.com";
  const url = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Primary Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('title', title);

    // Open Graph Tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Fitness Alive Gym', true);

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Canonical URL
    updateLinkTag('canonical', url);

    // Add structured data for current page
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.id === 'dynamic-seo') {
        existingScript.remove();
      }

      let structuredData = {};

      if (location.pathname === '/') {
        // Homepage - Gym schema
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Gym",
          "name": "Fitness Alive Gym",
          "description": description,
          "url": baseUrl,
          "logo": `${baseUrl}/logo192.png`,
          "image": image,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "#17-3-764, Zafar Road, Yakutpura",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "postalCode": "500023",
            "addressCountry": "IN"
          },
          "telephone": "+91-9701858786",
          "email": "admin@fitnessalive.gymorg.com",
          "priceRange": "$$",
          "openingHours": [
            "Mo-Sa 06:00-23:30",
            "Su 06:00-10:30"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "1000"
          }
        };
      } else if (location.pathname === '/about') {
        // About page
        structuredData = {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Fitness Alive Gym",
          "description": description,
          "url": url
        };
      } else if (location.pathname === '/contact') {
        // Contact page
        structuredData = {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Fitness Alive Gym",
          "description": description,
          "url": url
        };
      } else {
        // Default WebPage schema
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": url
        };
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'dynamic-seo';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [title, description, keywords, image, type, url, location.pathname, baseUrl]);

  return null;
};

export default SEO;


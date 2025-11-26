import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/home/Footer';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './GalleryPage.css';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Main Gym', 'Cardio', 'Weight Training', 'Group Classes', 'Facilities'];

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Main Gym Floor',
      category: 'Main Gym'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Cardio Section',
      category: 'Cardio'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Weight Training Area',
      category: 'Weight Training'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Group Training Session',
      category: 'Group Classes'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Modern Equipment',
      category: 'Main Gym'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Fitness Studio',
      category: 'Group Classes'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Locker Room',
      category: 'Facilities'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Reception Area',
      category: 'Facilities'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Treadmill Section',
      category: 'Cardio'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Free Weights Area',
      category: 'Weight Training'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Yoga Studio',
      category: 'Group Classes'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Steam Room',
      category: 'Facilities'
    }
  ];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index) => {
    setSelectedImage(filteredImages[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const next = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(next);
    setSelectedImage(filteredImages[next]);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prev);
    setSelectedImage(filteredImages[prev]);
  };

  return (
    <div className="gallery-page">
      <SEO 
        title="Gallery - Fitness Alive Gym | Gym Photos & Facilities"
        description="Explore our state-of-the-art gym facilities through our photo gallery. See our main gym floor, cardio equipment, weight training area, group classes, and premium facilities at Fitness Alive Gym in Hyderabad."
        keywords="gym gallery hyderabad, fitness center photos, gym facilities images, gym equipment photos, fitness center gallery"
      />
      <Header />
      <section className="gallery-hero">
        <div className="container">
          <h1 className="gallery-hero-title">GYM GALLERY</h1>
          <p className="gallery-hero-subtitle">
            Explore our state-of-the-art fitness facility
          </p>
        </div>
      </section>

      <section className="gallery-content-section">
        <div className="container">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <h4 className="gallery-title">{image.title}</h4>
                  <span className="gallery-category">{image.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="lightbox-image"
            />
            <h3 className="lightbox-title">{selectedImage.title}</h3>
            <p className="lightbox-category">{selectedImage.category}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;


import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './GallerySection.css';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Main Gym Floor'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Cardio Section'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Weight Training Area'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Group Training'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Modern Equipment'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Fitness Studio'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Locker Room'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Reception Area'
    }
  ];

  const openLightbox = (index) => {
    setSelectedImage(galleryImages[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const next = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(next);
    setSelectedImage(galleryImages[next]);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(prev);
    setSelectedImage(galleryImages[prev]);
  };

  const nextSlide = () => {
    setSlideIndex((prev) => {
      const maxIndex = Math.max(0, galleryImages.length - 3);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setSlideIndex((prev) => {
      const maxIndex = Math.max(0, galleryImages.length - 3);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Facility</span>
          <h2 className="section-title">GYM GALLERY</h2>
          <p className="section-subtitle">
            Take a virtual tour of our state-of-the-art fitness facility
          </p>
        </div>
        <div className="gallery-carousel-wrapper">
          <button className="gallery-nav-btn gallery-prev" onClick={prevSlide}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="gallery-carousel">
            <div 
              className="gallery-slide-container"
              style={{ transform: `translateX(-${slideIndex * (100 / 3)}%)` }}
            >
              {galleryImages.map((image, index) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="gallery-nav-btn gallery-next" onClick={nextSlide}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

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
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;


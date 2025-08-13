import React, { useState } from 'react'
import "./ImgSelector.css"
const ImageSelector = () => {

    const images = [
        { id: 1, url: '/images/Hair_Loss.jpg' },
        { id: 2, url: '/images/Melasma.jpg' },
        { id: 3, url: '/images/userimg.jpg' },
        { id: 4, url: '/images/avatar5.png' },
        { id: 5, url: '/images/bg1.png' },
        { id: 6, url: '/images/bg1.png' },
      ];
  const [selectedImages, setSelectedImages] = useState([]);

  console.log(selectedImages);

   const toggleImageSelection = (imageUrl) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter(url => url !== imageUrl));
    } else {
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  return (
    <div>
      <h3>Select Poster</h3>
      <div className="image-list">
        {images.map(image => (
          <div
            key={image.id}
            className={`image-item ${selectedImages.includes(image.url) ? 'selected' : ''}`}
            onClick={() => toggleImageSelection(image.url)}
          >
            <img style={{width:"150px", height:'150px'}} src={image.url} alt={`Image ${image.id}`} />
          </div>
        ))}
      </div>
      <div>
        {/* <h3>Selected Images:</h3> */}
        {/* {selectedImages.map(selectedId => (
          <img
            key={selectedId}
            src={images.find(image => image.id === selectedId).url}
            alt={`Selected ${selectedId}`}
          />
        ))} */}
      </div>
    </div>
  );
};

export default ImageSelector;
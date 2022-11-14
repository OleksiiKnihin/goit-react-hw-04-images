export const ImageGalleryItem = ({
  webformatURL,
  largeImageURL,
  openModal,
}) => {
  return (
    <li className="ImageGalleryItem">
      <img
        className="ImageGalleryItem-image"
        src={webformatURL}
        alt=""
        onClick={() => openModal(largeImageURL)}
      />
    </li>
  );
};

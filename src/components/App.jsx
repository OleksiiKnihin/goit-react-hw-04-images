import { useState, useEffect, useReducer } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './services/api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMore } from './LoadMore/LoadMore';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

const totalHitsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'queryChange':
      return { ...state, images: payload.images, totalHits: payload.totalHits };

    case 'submit':
      return payload.page === 1
        ? {
            ...state,
            images: payload.images,
            totalHits: payload.totalHits - payload.images.length,
          }
        : {
            ...state,
            images: [...state.images, ...payload.images],
            totalHits:
              payload.totalHits - [...state.images, ...payload.images].length,
          };

    default:
      throw new Error(`Unsuported action type ${type}`);
  }
};

export const App = () => {
  const [state, dispatch] = useReducer(totalHitsReducer, {
    images: [],
    totalHits: 0,
  });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch({ type: 'queryChange', payload: { images: [], totalHits: 0 } });
  }, [query]);

  useEffect(() => {
    if (query === '') {
      return;
    }
    setIsLoading(true);
    fetchImages(query, page)
      .then(data => {
        dispatch({
          type: 'submit',
          payload: { page: page, images: data.hits, totalHits: data.totalHits },
        });
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, query]);

  const handleSubmit = query => {
    setQuery(query);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(state => state + 1);
  };

  const toggleModal = modalImage => {
    if (!modalImage) {
      setModalImage('');
      setShowModal(false);
      document.body.style.overflow = '';
      return;
    }
    setModalImage(modalImage);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      <ImageGallery images={state.images} openModal={toggleModal} />
      {!!state.totalHits && <LoadMore onLoadMore={handleLoadMore} />}
      {showModal && <Modal modalImage={modalImage} closeModal={toggleModal} />}
    </div>
  );
};

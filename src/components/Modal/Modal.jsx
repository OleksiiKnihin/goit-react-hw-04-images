import { Component } from 'react';

export class Modal extends Component {
  closeByESC = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  componentDidMount = () => {
    window.addEventListener('keydown', this.closeByESC);
  };

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.closeByESC);
  };

  render() {
    const { closeModal, modalImage } = this.props;
    return (
      <div
        className="Overlay"
        onClick={e => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <div className="Modal">
          <img src={modalImage} alt="" />
        </div>
      </div>
    );
  }
}

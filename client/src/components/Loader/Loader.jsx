import './Loader.css';

const Loader = () => {
  return (
    <div className="loader_container">
      <div className="loader">
        <div className="loader-text">Loading...</div>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
};

export default Loader;

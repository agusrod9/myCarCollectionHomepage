import './Loading.css';  // We'll style it with some basic CSS

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default Loading;
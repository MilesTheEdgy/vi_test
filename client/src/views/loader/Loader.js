import "./loader.css"

const Loader = () => {
    return (
    <div className="loader">
        <div className="spinner-border" role="status">
          <span className="sr-only loader-icon">Loading...</span>
        </div>
    </div>
    )
}

export default Loader;
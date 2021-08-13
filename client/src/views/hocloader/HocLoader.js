import "./loader.css"

const HocLoader = (props) => {
    return (
      <div style = {{position: "relative"}}>
        <div className={ props.isLoading ? "loader" : ""}>
            <div className={ props.isLoading ? "spinner-border" : ""} role="status">
              {/* <span className="sr-only loader-icon">Loading...</span> */}
            </div>
        </div>
        {
          props.children
        }
      </div>
    )
}

export default HocLoader;
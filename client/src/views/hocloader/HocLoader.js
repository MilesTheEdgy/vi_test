import "./loader.css"

const HocLoader = (props) => {
    return (
        <div className={ props.isLoading ? "loader" : ""}>
            <div className={ props.isLoading ? "spinner-border" : ""} role="status">
            </div>
            {props.children}
        </div>
    )
}

export default HocLoader;
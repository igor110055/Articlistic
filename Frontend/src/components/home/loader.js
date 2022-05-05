import './loader.css';

const Loader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

export default Loader;
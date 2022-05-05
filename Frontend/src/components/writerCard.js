import '../index.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleMouseOver } from '../utils/common';
import { addWriter, removeWriter } from '../containers/writersAndCategories/writersAndCategoriesActions';

const WriterCard = ({
    writer,
}) => {
    const [selected, setSelected] = useState(false);
    const dispatch = useDispatch();
    const handleAddRemoveWriter = (id) => {
        if (selectedWriters[id] !== undefined) {
            dispatch(removeWriter(id));
            setSelected(false);
        }
        else {
            dispatch(addWriter(id));
            setSelected(true);
        }
    };

    const {
        selectedWriters,
    } = useSelector((state) => {
        return {
            selectedWriters: state.writers.selectedWriters,
        };
    });
    return (
        <div className="writer-card-container" onMouseOver={handleMouseOver} onClick={() => handleAddRemoveWriter(writer._id)}>
            {!selected ? (<div className="writer-card">
                <div className="writer-information">
                    <div className="writer-photo-container">
                        <img src={writer.image} alt="user" className="writer-photo" />
                    </div>
                    <div className="writer-description">
                        <div className="writer-name">
                            {writer.username}
                        </div>
                        <div className="writer-expertise">
                            {writer.categories.map((eachCategory) => (
                                eachCategory + " "
                            ))}
                        </div>
                        <div className="writer-short-description">
                            {/* {category.avatar_url} */}
                            {writer.description}
                        </div>
                    </div>
                </div>
            </div>) : (
                <div className="writer-card-dark">
                    <div className="writer-information-dark">
                        <div className="writer-photo-container-dark">
                            <img src={writer.image} alt="user" className="writer-photo-dark" />
                            <div className="tick-mark">
                                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 9.89474L6.39216 14L18 2" stroke="#008AFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="writer-description">
                            <div className="writer-name">
                                {writer.username}
                            </div>
                            <div className="writer-expertise">
                                {writer.categories.map((eachCategory) => (
                                    eachCategory + " "
                                ))}
                            </div>
                            <div className="writer-short-description">
                                {writer.description}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WriterCard;
import '../index.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleMouseOver } from '../utils/common';
import { addCategory, removeCategory } from '../containers/writersAndCategories/writersAndCategoriesActions';

const CategoryCard = ({
    category,
}) => {
    const [selected, setSelected] = useState(false);
    const dispatch = useDispatch();
    const handleAddRemoveCategory = (id) => {
        if (selectedCategories[id] !== undefined) {
            dispatch(removeCategory(id));
            setSelected(false);
        }
        else {
            dispatch(addCategory(id));
            setSelected(true);
        }
    };

    const {
        selectedCategories,
    } = useSelector((state) => {
        return {
            selectedCategories: state.writers.selectedCategories,
        };
    });
    return (
        <div className="writer-card-container" onMouseOver={handleMouseOver} onClick={() => handleAddRemoveCategory(category._id)}>
            {!selected ? (<div className="writer-card">
                <div className="writer-information">
                    <div className="writer-photo-container">
                        <img src={category.image} alt="user" className="writer-photo" />
                    </div>
                    <div className="writer-description">
                        <div className="writer-name">
                            {category.name}
                        </div>
                        <div className="writer-expertise">
                            {/* {category.login} */}
                        </div>
                        <div className="writer-short-description">
                            {/* {category.avatar_url} */}
                            {/* this is a short description of writer. it is to check ui. */}
                        </div>
                    </div>
                </div>
            </div>) : (
                <div className="writer-card">
                    <div className="writer-information-dark">
                        <div className="writer-photo-container-dark">
                            <img src={category.image} alt="user" className="writer-photo-dark" />
                            <div className="tick-mark">
                                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 9.89474L6.39216 14L18 2" stroke="#008AFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="writer-description">
                            <div className="writer-name">
                                {category.name}
                            </div>
                            <div className="writer-expertise">
                                {category.login}
                            </div>
                            <div className="writer-short-description">
                                {/* {category.avatar_url} */}
                                {/* this is a short description of writer. it is to check ui. */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryCard;
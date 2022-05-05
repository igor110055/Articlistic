import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesWriters, getStatus, sendSelected } from "./writersAndCategoriesActions";
import WriterCard from "./../../components/writerCard";
import CategoryCard from "./../../components/categoryCard";
import Snackbar from "../../components/snackbar";
import { useNavigate } from "react-router";
import { userUsername } from "../user/userActions";
import Cookie from 'js-cookie';
import crypto from "crypto-js";

const WritersAndCategories = () => {
    const [submitClicked, setSubmitClicked] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('displayPage', 'mapWritersAndCategories');
        const descryptedAccessToken = crypto.RC4.decrypt(Cookie.get('accessToken'), process.env.REACT_APP_ENCRYPTION_SALT).toString(crypto.enc.Utf8);
        const encryptedAccessToken = crypto.AES.encrypt(descryptedAccessToken, process.env.REACT_APP_ENCRYPTION_SALT);
        dispatch(getCategoriesWriters({}, encryptedAccessToken));
        dispatch(userUsername(JSON.parse(localStorage.getItem('user'))?.userUserName));
    }, []);

    const {
        writers,
        isGettingWriters,
        getWritersError,
        selectedWriters,
        selectedCategories,
        categories,
        getWritersErrorMsg,
        isGettingStatus,
        user,
        isSendingWritersAndCategories,
        sendWritersAndCategoriesError
    } = useSelector(
        (state) => {
            return {
                categories: state.writers.categories,
                writers: state.writers.writers,
                isGettingWriters: state.writers.isGettingWriters,
                getWritersError: state.writers.getWritersError,
                selectedWriters: state.writers.selectedWriters,
                selectedCategories: state.writers.selectedCategories,
                getWritersErrorMsg: state.writers.getWritersErrorMsg,
                isGettingStatus: state.writers.isGettingStatus,
                user: state.user,
                isSendingWritersAndCategories: state.writers.isSendingWritersAndCategories,
                sendWritersAndCategoriesError: state.writers.sendWritersAndCategoriesError,
            };
        }
    );

    useEffect(() => {
        if (sendWritersAndCategoriesError) {

        } else {
            if (!isSendingWritersAndCategories && submitClicked) {
                localStorage.setItem('categories', true);
                navigate('/');
                // localStorage.removeItem('categories');
            }
        }
    })

    const [displaySnackbar, setDisplaySnackbar] = useState('0');
    useEffect(() => {
        // console.log(user);
    }, [user]);


    const handleFinish = () => {
        if (Object.keys(selectedWriters).length >= 5 && Object.keys(selectedCategories).length >= 3) {
            setDisplaySnackbar('1');
            let categoriesFinal = [];
            for (const item in selectedCategories) {
                categoriesFinal.push(selectedCategories[item].name);
            }

            let followingFinal = [];
            for (const item in selectedWriters) {
                followingFinal.push(selectedWriters[item].username);
            }
            dispatch(sendSelected(
                {
                    username: user.userUserName,
                    following: followingFinal,
                    categories: categoriesFinal,
                }
            ));
            setSubmitClicked(true);
        } else {
            // console.log('m');
            setDisplaySnackbar('2');
            setTimeout(() => {
                setDisplaySnackbar('1')
            }, 5000);
        }
    }

    // useEffect(() => {
    //     console.log(sendWritersAndCategories);
    // }, [check]);
    // !isGettingWriters && !getWritersError && categories !== undefined
    return isGettingWriters ? (
        <div>
            Fetching Data
        </div>) : (
        (!isGettingWriters && !getWritersError && categories !== undefined ? (<div>
            {displaySnackbar === '2' && <Snackbar />}
            <div className="writer-selection">
                <div className="select-title">
                    <div className="category-title">
                        Select Category
                    </div>
                    <div className="writer-title">
                        Select Writer
                    </div>
                </div>
                <div className="selection-container">
                    <div className="writer-selection-categories">
                        {categories.map((eachCategory, index) => {
                            return <CategoryCard key={index} category={eachCategory} />;
                        })}
                        <div className="extra-card-space"></div>
                    </div>
                    <div className="writer-selection-main">
                        {writers.map((eachWriter, index) => {
                            return <WriterCard key={index} writer={eachWriter} />;
                        })}
                        <div className="extra-card-space"></div>
                    </div>
                </div>
                <div className="writer-category-selection-footer">
                    <button className="button" onClick={() => handleFinish()}>
                        Finish
                    </button>
                </div>
            </div>
        </div >) : <div className="api-error">
            {getWritersErrorMsg}
        </div>)
    );
};

export default WritersAndCategories;

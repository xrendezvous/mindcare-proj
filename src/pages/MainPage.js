import React from 'react';
import Header from '../components/Header';
import '../styles/main_style.css';
import {Button} from "@nextui-org/react";
import mainImage from '../assets/main.png';
import {useNavigate} from 'react-router-dom';


const MainPage = () => {
    const navigate = useNavigate();

    const handleAllTherapists = () => {
        navigate('/all-therapists');
    };

    const handleFindTherapist = () => {
        navigate('/find-therapist');
    };

    return (
        <div className="main-container">
            <Header/>
            <div className="content">
                <img
                    className="placeholder-image"
                    src={mainImage}
                    alt="Placeholder"
                />

                <div className="text-section">
                    <h1 className="main-title">
                        Знайдіть спеціаліста, який Вас підтримає
                    </h1>

                    <p className="main-description">
                        Ви не самотні. Ми тут, щоб надати необхідну підтримку та допомогу.
                    </p>

                    <div className="button-group">
                        <Button onPress={handleFindTherapist} className="primary-button">
                            Підібрати фахівця
                        </Button>

                        <span className="separator">або</span>

                        <Button onPress={handleAllTherapists} className="secondary-button">
                            Усі фахівці
                        </Button>
                    </div>
                </div>
            </div>
        </div>
            );
};

export default MainPage;

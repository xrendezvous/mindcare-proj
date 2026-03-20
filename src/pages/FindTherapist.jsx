import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/find-therapist.css';
import supabase from '../config/databaseClient';

const FindTherapist = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        specialization: [],
        qualification: '',
        experience: '',
        workFormat: '',
    });
    const [specializations, setSpecializations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecializations = async () => {
            const {data, error} = await supabase.from('categories').select('name');
            if (!error) {
                setSpecializations(data.map(item => item.name));
            }
        };
        fetchSpecializations();
    }, []);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => {
                const updatedSpecialization = checked
                    ? [...prevData.specialization, value]
                    : prevData.specialization.filter((item) => item !== value);
                return {...prevData, specialization: updatedSpecialization.slice(0, 4)};
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const nextStep = () => {
        const currentField = ["gender", "age", "specialization", "qualification", "workFormat", "experience"][currentStep - 1];
        const isFieldFilled = currentField === "specialization" ? formData[currentField].length > 0 : formData[currentField];
        if (isFieldFilled) {
            setCurrentStep((prev) => prev + 1);
        } else {
            alert("Будь ласка, оберіть хоча б одну опцію перед тим, як продовжити.");
        }
    };

    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        navigate('/therapist-results', {state: formData});
    };

    return (
        <div>
            <Header/>
            <div className="findther-page">
                <div className="findther-container">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div>
                                <h2>Оберіть стать терапевта</h2>
                                {['Чоловік', 'Жінка', 'Неважливо'].map(option => (
                                    <label key={option}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={option}
                                            checked={formData.gender === option}
                                            onChange={handleChange}
                                        />
                                        {option === 'Чоловік' ? 'Чоловік' : option === 'Жінка' ? 'Жінка' : 'Неважливо'}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={nextStep}>Далі</button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div>
                                <h2>Бажаний вік терапевта</h2>
                                {['20-30', '31-40', '41-50', '50+', 'Неважливо'].map(range => (
                                    <label key={range}>
                                        <input
                                            type="radio"
                                            name="age"
                                            value={range}
                                            checked={formData.age === range}
                                            onChange={handleChange}
                                        />
                                        {range} {range === 'Неважливо' ? '' : 'років'}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={prevStep}>Назад</button>
                                <button type="button" className="findther-btn" onClick={nextStep}>Далі</button>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div>
                                <h2>Спеціалізація терапевта (оберіть до 4)</h2>
                                {specializations.map((spec) => (
                                    <label key={spec}>
                                        <input
                                            type="checkbox"
                                            name="specialization"
                                            value={spec}
                                            checked={formData.specialization.includes(spec)}
                                            onChange={handleChange}
                                        />
                                        {spec}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={prevStep}>Назад</button>
                                <button type="button" className="findther-btn" onClick={nextStep}>Далі</button>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div>
                                <h2>Кваліфікація терапевта</h2>
                                {['Психолог', 'Психотерапевт', 'Психіатр', 'Неважливо'].map(qual => (
                                    <label key={qual}>
                                        <input
                                            type="radio"
                                            name="qualification"
                                            value={qual}
                                            checked={formData.qualification === qual}
                                            onChange={handleChange}
                                        />
                                        {qual}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={prevStep}>Назад</button>
                                <button type="button" className="findther-btn" onClick={nextStep}>Далі</button>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div>
                                <h2>Формат роботи терапевта</h2>
                                {['Онлайн', 'Офлайн', 'Неважливо'].map(format => (
                                    <label key={format}>
                                        <input
                                            type="radio"
                                            name="workFormat"
                                            value={format}
                                            checked={formData.workFormat === format}
                                            onChange={handleChange}
                                        />
                                        {format}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={prevStep}>Назад</button>
                                <button type="button" className="findther-btn" onClick={nextStep}>Далі</button>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div>
                                <h2>Досвід роботи терапевта</h2>
                                {['0-5', '6-10', '11-15', '15+', 'Неважливо'].map(exp => (
                                    <label key={exp}>
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={exp}
                                            checked={formData.experience === exp}
                                            onChange={handleChange}
                                        />
                                        {exp} {exp === 'Неважливо' ? '' : 'років'}
                                    </label>
                                ))}
                                <button type="button" className="findther-btn" onClick={prevStep}>Назад</button>
                                <button type="submit" className="findther-btn">Завершити</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FindTherapist;

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import supabase from '../config/databaseClient';

const UserPage = () => {
    const [setPatientData] = useState(null);
    const navigate = useNavigate();
    const storedPatientId = localStorage.getItem('patient_id');

    useEffect(() => {
        fetchPatientData();
    }, []);

    const fetchPatientData = async () => {
        const {data, error} = await supabase
            .from('patients')
            .select('first_name, last_name, date_of_birth, gender, email, phone_number, address')
            .eq('patient_id', storedPatientId)
            .single();

        if (error) {
            console.error('Помилка завантаження даних:', error.message);
            alert('Не вдалося завантажити дані пацієнта.');
        } else {
            setPatientData(data);
        }
    };

};

export default UserPage;
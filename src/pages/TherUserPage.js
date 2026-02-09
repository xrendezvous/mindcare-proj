import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import supabase from '../config/databaseClient';

const TherUserPage = () => {
    const {doctor_id} = useParams();
    const [setDoctorData] = useState(null);
    const [setEditedDoctor] = useState({});
    const navigate = useNavigate();
    const storedDoctorId = localStorage.getItem('doctor_id');

    useEffect(() => {
        const fetchDoctorData = async () => {

            if (!storedDoctorId) {
                console.error('Doctor ID не знайдено в localStorage');
                alert('Не вдалося завантажити дані лікаря.');
                return;
            }

            const {data, error} = await supabase
                .from('doctors')
                .select('first_name, last_name, specialization, experience, email, phone_number, ' +
                    'meet_fomat, city, doc_sex, doc_date, doc_session, doc_rev, doc_lang, doc_education, doc_way, doc_photo')
                .eq('doctor_id', storedDoctorId)
                .single();

            if (error) {
                console.error('Помилка завантаження даних:', error.message);
                alert('Не вдалося завантажити дані лікаря.');
            } else {
                setDoctorData(data);
                setEditedDoctor(data);
            }
        };

        fetchDoctorData();
    }, [doctor_id, navigate]);

};

export default TherUserPage;
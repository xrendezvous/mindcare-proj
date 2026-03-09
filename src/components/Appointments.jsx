import React, {useEffect, useState} from 'react';
import supabase from '../config/databaseClient';

const Appointments = ({doctorId}) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!doctorId || isNaN(Number(doctorId))) {
                console.error('неправильний doctorId:', doctorId);
                return;
            }

            try {
                const {data: timesData, error: timesError} = await supabase
                    .from('times')
                    .select('patient, date')
                    .eq('doctor_id', Number(doctorId))
                    .not('patient', 'is', null);

                if (timesError) throw timesError;

                const patientsIds = timesData.map((t) => t.patient);

                if (patientsIds.length === 0) {
                    setAppointments([]);
                    setLoading(false);
                    return;
                }

                const {data: patientsData, error: patientsError} = await supabase
                    .from('patients')
                    .select('patient_id, first_name, last_name, email')
                    .in('patient_id', patientsIds);

                if (patientsError) throw patientsError;

                const appointmentsWithNames = timesData.map((appointment) => {
                    const patient = patientsData.find((p) =>
                        p.patient_id === appointment.patient
                    );
                    return {
                        ...appointment,
                        patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'не визначено',
                        patientEmail: patient ? patient.email : null,
                    };
                });

                setAppointments(appointmentsWithNames);
            } catch (err) {
                console.error('помилка:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [doctorId]);

    if (loading) return (
        <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
        </div>
    );

    return (
        <div>
            {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                    <div key={index} className="appointment-item">
                        <p>Пацієнт: {appointment.patientName}</p>
                        <p>Дата запису: {new Date(appointment.date).toLocaleString()}</p>
                        <button
                            className="cancel-btn"
                            onClick={() => handleCancelByDoctor(appointment)}
                        >
                            Скасувати
                        </button>
                    </div>
                ))
            ) : (
                <div className="appointment-item">
                    <p>Записів немає.</p>
                </div>
            )}
        </div>
    );
};

export default Appointments;
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Appointments from '../components/Appointments';

let timesResponse = { data: [], error: null };
let patientsResponse = { data: [], error: null };

const timesFetchChain = {
    select: vi.fn(() => timesFetchChain),
    eq: vi.fn(() => timesFetchChain),
    not: vi.fn(() => Promise.resolve(timesResponse)),
};

const patientsFetchChain = {
    select: vi.fn(() => patientsFetchChain),
    in: vi.fn(() => Promise.resolve(patientsResponse)),
};

vi.mock('../config/databaseClient', () => ({
    default: {
        from: vi.fn((table) => {
            if (table === 'times') return timesFetchChain;
            if (table === 'patients') return patientsFetchChain;
            throw new Error(`Unexpected table: ${table}`);
        }),
    },
}));

describe('Appointments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        timesResponse = { data: [], error: null };
        patientsResponse = { data: [], error: null };
    });

    it('keeps loader visible forever for invalid doctorId', () => {
        render(<Appointments doctorId="abc" />);

        expect(document.querySelector('.banter-loader')).toBeInTheDocument();
    });

    it('renders fetched appointments with patient names', async () => {
        timesResponse = {
            data: [
                {
                    patient: 10,
                    date: '2026-03-21T10:00:00.000Z',
                },
            ],
            error: null,
        };

        patientsResponse = {
            data: [
                {
                    patient_id: 10,
                    first_name: 'Ірина',
                    last_name: 'Коваль',
                    email: 'iryna@test.com',
                },
            ],
            error: null,
        };

        render(<Appointments doctorId="5" />);

        await waitFor(() => {
            expect(screen.getByText(/Пацієнт:/)).toBeInTheDocument();
        });

        expect(screen.getByText('Пацієнт: Ірина Коваль')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Скасувати' })).toBeInTheDocument();
    });
});
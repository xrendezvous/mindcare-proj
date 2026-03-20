import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../pages/LoginPage';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

vi.mock('../assets/Frame.svg', () => ({
    ReactComponent: () => <svg data-testid="frame-svg" />,
}));

let doctorEqResult = { data: [], error: null };
let patientEqResult = { data: [], error: null };

const doctorsChain = {
    select: vi.fn(() => doctorsChain),
    or: vi.fn(() => doctorsChain),
    eq: vi.fn(() => Promise.resolve(doctorEqResult)),
};

const patientsChain = {
    select: vi.fn(() => patientsChain),
    or: vi.fn(() => patientsChain),
    eq: vi.fn(() => Promise.resolve(patientEqResult)),
};

vi.mock('../config/databaseClient', () => ({
    default: {
        from: vi.fn((table) => {
            if (table === 'doctors') return doctorsChain;
            if (table === 'patients') return patientsChain;
            throw new Error(`Unexpected table: ${table}`);
        }),
    },
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        doctorEqResult = { data: [], error: null };
        patientEqResult = { data: [], error: null };
    });

    it('shows validation error when email and password are empty', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Вхід' }));

        expect(screen.getByText('Будь ласка, введіть всі дані')).toBeInTheDocument();
    });

    it('shows invalid credentials error and keeps stale status in localStorage', async () => {
        localStorage.setItem('status', 'patient');

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email/Логін'), {
            target: { value: 'user@test.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Пароль'), {
            target: { value: 'wrong-password' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Вхід' }));

        await waitFor(() => {
            expect(screen.getByText('Невірний логін або пароль')).toBeInTheDocument();
        });

        expect(localStorage.getItem('status')).toBe('patient');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});
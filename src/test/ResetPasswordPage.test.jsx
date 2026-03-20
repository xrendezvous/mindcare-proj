import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ResetPasswordPage from '../pages/ResetPasswordPage';

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

let singleResult = { data: null, error: null };
let updateResult = { error: null };

const patientsChain = {
    select: vi.fn(() => patientsChain),
    eq: vi.fn(() => patientsChain),
    single: vi.fn(() => Promise.resolve(singleResult)),
    update: vi.fn(),
};

vi.mock('../config/databaseClient', () => ({
    default: {
        from: vi.fn((table) => {
            if (table === 'patients') return patientsChain;
            throw new Error(`Unexpected table: ${table}`);
        }),
    },
}));

describe('ResetPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        singleResult = { data: null, error: null };
        updateResult = { error: null };

        patientsChain.update.mockImplementation(() => ({
            eq: vi.fn(() => Promise.resolve(updateResult)),
        }));

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );
    });

    it('shows validation error when fields are empty', () => {
        render(
            <MemoryRouter>
                <ResetPasswordPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        expect(screen.getByText('Будь ласка, введіть email та новий пароль')).toBeInTheDocument();
    });

    it('updates password for patient and redirects to login', async () => {
        singleResult = {
            data: { patient_id: 1, email: 'ira@test.com' },
            error: null,
        };

        render(
            <MemoryRouter>
                <ResetPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'ira@test.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Новий пароль'), {
            target: { value: 'new-password-123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(screen.getByText('Пароль успішно змінено!')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:4000/send-password-changed-email',
            expect.objectContaining({
                method: 'POST',
            })
        );

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/login');
        }, { timeout: 3000 });
    }, 8000);
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CreateAccount from '../pages/CreateAccount';

const {
    mockedNavigate,
    patientsChain,
    doctorsChain,
    fromMock,
} = vi.hoisted(() => {
    const mockedNavigate = vi.fn();

    const patientsChain = {
        select: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        insert: vi.fn(),
    };

    patientsChain.select.mockImplementation(() => patientsChain);
    patientsChain.order.mockImplementation(() => patientsChain);

    const doctorsChain = {
        select: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        insert: vi.fn(),
    };

    doctorsChain.select.mockImplementation(() => doctorsChain);
    doctorsChain.order.mockImplementation(() => doctorsChain);

    const fromMock = vi.fn((table) => {
        if (table === 'patients') return patientsChain;
        if (table === 'doctors') return doctorsChain;
        throw new Error(`Unexpected table: ${table}`);
    });

    return { mockedNavigate, patientsChain, doctorsChain, fromMock };
});

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

vi.mock('../config/databaseClient', () => ({
    default: {
        from: fromMock,
    },
}));

describe('CreateAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        patientsChain.limit.mockResolvedValue({ data: [], error: null });
        patientsChain.insert.mockResolvedValue({ error: null });

        doctorsChain.limit.mockResolvedValue({ data: [], error: null });
        doctorsChain.insert.mockResolvedValue({ error: null });

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );
    });

    it('shows validation error when role is not selected on step 1', () => {
        render(
            <MemoryRouter>
                <CreateAccount />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        expect(screen.getByText('Будь ласка, оберіть тип акаунту.')).toBeInTheDocument();
    });

    it('currently allows patient registration with empty login and password', async () => {
        const { container } = render(
            <MemoryRouter>
                <CreateAccount />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText('Пацієнт'));
        fireEvent.change(screen.getByPlaceholderText("Ім'я"), {
            target: { value: 'Іра' },
        });
        fireEvent.change(screen.getByPlaceholderText('Прізвище'), {
            target: { value: 'Коваль' },
        });
        fireEvent.click(screen.getByLabelText('Жінка'));

        const birthDateInput = container.querySelector('input[name="birthDate"]');
        fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });

        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'ira@test.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Телефон'), {
            target: { value: '+380991112233' },
        });
        fireEvent.change(screen.getByPlaceholderText('Адреса'), {
            target: { value: 'Kyiv' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        fireEvent.click(screen.getByRole('button', { name: 'Завершити' }));

        await waitFor(() => {
            expect(patientsChain.insert).toHaveBeenCalled();
        });

        const insertedPayload = patientsChain.insert.mock.calls[0][0][0];

        expect(insertedPayload.pat_login).toBe('');
        expect(insertedPayload.pat_password).toBe('');
        expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
});
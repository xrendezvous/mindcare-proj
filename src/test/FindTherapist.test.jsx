import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FindTherapist from '../pages/FindTherapist';

window.alert = vi.fn();

vi.mock('../components/Header', () => ({
    default: () => <div data-testid="mock-header">Header</div>,
}));

vi.mock('../components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>,
}));

vi.mock('../config/databaseClient', () => ({
    default: {
        from: vi.fn(() => ({
            select: vi.fn(async () => ({
                data: [
                    { name: 'Тривожність' },
                    { name: 'Вигорання' },
                    { name: 'Стрес' },
                ],
                error: null,
            })),
        })),
    },
}));

describe('FindTherapist', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows alert if user tries to continue without choosing an option', () => {
        render(
            <MemoryRouter>
                <FindTherapist />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        expect(window.alert).toHaveBeenCalledWith(
            'Будь ласка, оберіть хоча б одну опцію перед тим, як продовжити.'
        );
    });

    it('renders specialization step after valid first steps', async () => {
        render(
            <MemoryRouter>
                <FindTherapist />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText('Чоловік'));
        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        fireEvent.click(screen.getByLabelText(/20-30/));
        fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

        await waitFor(() => {
            expect(
                screen.getByText('Спеціалізація терапевта (оберіть до 4)')
            ).toBeInTheDocument();
        });
    });
});
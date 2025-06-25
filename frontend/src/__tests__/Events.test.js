// src/__tests__/Events.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Events from '../components/Events'; // Adjust path to your Events component
import { useAuth } from '../context/AuthContext';
import { eventsData } from '../components/data';

// Mock dependencies
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));
jest.mock('react-hot-toast', () => ({
  default: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn()
  }
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn())
}));
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

// Mock user
const mockUser = { uid: '123', name: 'John Doe', email: 'john@example.com' };

beforeEach(() => {
  useAuth.mockReturnValue({ user: mockUser, login: jest.fn() });
  fetch.mockClear();
});

const renderEvents = () =>
  render(
    <MemoryRouter>
      <AnimatePresence>
        <Events />
      </AnimatePresence>
    </MemoryRouter>
  );

describe('Events Component', () => {
  test('renders event grid with all events', () => {
    renderEvents();
    expect(screen.getByText('Upcoming Thrills')).toBeInTheDocument();
    eventsData.forEach(event => {
      expect(screen.getByText(event.name)).toBeInTheDocument();
    });
  });

  test('opens expanded modal when clicking an event', () => {
    renderEvents();
    const eventCard = screen.getByText(eventsData[0].name);
    fireEvent.click(eventCard);
    expect(screen.getByText(eventsData[0].longDescription)).toBeInTheDocument();
    const closeButton = screen.getAllByRole('button', { name: /Close/i })[0];
    fireEvent.click(closeButton);
    expect(screen.queryByText(eventsData[0].longDescription)).not.toBeInTheDocument();
  });
});
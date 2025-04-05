import React from 'react'; // Thêm dòng này
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

// Mock các dependency
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock window.alert
window.alert = jest.fn();

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: MemoryRouter });
};

describe('Login Component', () => {
  let mockLoginUser, mockSignInWithGoogle, mockNavigate;

  beforeEach(() => {
    mockLoginUser = jest.fn();
    mockSignInWithGoogle = jest.fn();
    mockNavigate = jest.fn();
    useAuth.mockReturnValue({
      loginUser: mockLoginUser,
      signInWithGoogle: mockSignInWithGoogle,
    });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('should login successfully and navigate to home', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show error message on login failure', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123457' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123457');
      expect(screen.getByText('Please provide a valid email and password')).toBeInTheDocument();
    });
  });

  it('should show invalid email error, then login successfully', async () => {
    mockLoginUser.mockResolvedValue(true);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Invalid email format"
        )
      ).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show email required error, then login successfully', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show email too long error, then login successfully', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'abcdefghijklmnopqrstuabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij.commvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij.comm' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Email cannot exceed 255 characters')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // TC6
  it('should show password required error, then login successfully', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Password is required')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show password too short error, then login successfully', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show email too long error, then login successfully', async () => {
    mockLoginUser.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'hophucthai9@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'abcdefghijklmnopqrstuabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Password cannot exceed 100 characters')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('hophucthai9@gmail.com', '123456');
      expect(window.alert).toHaveBeenCalledWith('Login successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
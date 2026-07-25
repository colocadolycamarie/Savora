import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from '@/components/common/FormField';

describe('FormField', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<FormField label="Email" value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('shows an error message and marks the field invalid', () => {
    render(
      <FormField label="Email" value="" onChange={() => {}} error="Enter a valid email address." />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  });

  it('has no aria-invalid when there is no error', () => {
    render(<FormField label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('renders a hint when provided and no error is present', () => {
    render(<FormField label="Amount" value="" onChange={() => {}} hint="Between ₱500 and ₱50,000." />);
    expect(screen.getByText('Between ₱500 and ₱50,000.')).toBeInTheDocument();
  });

  it('renders a textarea when as="textarea"', () => {
    render(<FormField as="textarea" label="Message" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });

  it('marks optional fields in the label', () => {
    render(<FormField label="Dietary Restrictions" optional value="" onChange={() => {}} />);
    expect(screen.getByText(/\(optional\)/)).toBeInTheDocument();
  });

  it('calls onChange as the user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FormField label="Name" value="" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Name'), 'Ana');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });
});

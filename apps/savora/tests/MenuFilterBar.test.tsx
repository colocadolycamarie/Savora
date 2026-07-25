import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuFilterBar, type MenuFilters } from '@/components/menu/MenuFilterBar';

const EMPTY: MenuFilters = { dietary: [], priceRange: null, category: null };

describe('MenuFilterBar', () => {
  it('toggles a category filter on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MenuFilterBar categories={['Mains', 'Dessert']} filters={EMPTY} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Mains' }));
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, category: 'Mains' });
  });

  it('toggles a dietary filter without clearing others', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const filters: MenuFilters = { ...EMPTY, category: 'Mains' };
    render(<MenuFilterBar categories={['Mains']} filters={filters} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Vegetarian' }));
    expect(onChange).toHaveBeenCalledWith({ ...filters, dietary: ['V'] });
  });

  it('shows a clear-all control only when a filter is active', () => {
    const { rerender } = render(
      <MenuFilterBar categories={['Mains']} filters={EMPTY} onChange={() => {}} />,
    );
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();

    rerender(
      <MenuFilterBar
        categories={['Mains']}
        filters={{ ...EMPTY, category: 'Mains' }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('resets all filters when clear-all is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MenuFilterBar
        categories={['Mains']}
        filters={{ dietary: ['V'], priceRange: '1000-2000', category: 'Mains' }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('Clear all'));
    expect(onChange).toHaveBeenCalledWith(EMPTY);
  });
});

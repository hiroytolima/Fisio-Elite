import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AccessibilityToolbar } from '@/shared/accessibility/AccessibilityToolbar';

describe('Testes de Acessibilidade (a11y — WCAG 2.2 AA)', () => {
  it('deve renderizar a barra de acessibilidade com atributos ARIA corretos', () => {
    const { getByRole, getByText } = render(<AccessibilityToolbar />);
    const region = getByRole('region', { name: /ferramentas de acessibilidade/i });
    expect(region).toBeInTheDocument();

    const skipLink = getByText(/pular para conteúdo principal/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});

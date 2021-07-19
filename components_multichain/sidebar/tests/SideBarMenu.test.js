import React from 'react'
import { render, screen } from '@testing-library/react'
import SideBarMenu from '../SideBarMenu'
jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: '/'
    })
  }
})

describe('SideBarMenu', () => {
  test('renders SideBarMenu component', () => {
    render(<SideBarMenu />)
  })
  test('has all 4 menu items - swap, explore, tokens,stats', () => {
    render(<SideBarMenu />);
    ['swap', 'tokens', 'explorer', 'stats'].forEach((item) => expect(screen.getByText(item)).toBeInTheDocument())
  })
  test('has swap menu selected by default and others not selected', () => {
    render(<SideBarMenu />)
    expect(screen.getByText('swap').parentElement?.className).toContain('selected');
    ['explorer', 'tokens', 'stats'].forEach((item) =>
      expect(screen.getByText(item).parentElement?.className).not.toContain('selected')
    )
  })
})

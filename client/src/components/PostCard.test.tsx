import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard';

const mockPost = { id: 1, title: 'Título', body: 'Corpo', liked: false };

describe('PostCard', () => {
  it('exibe alerta e não chama onLike quando não autenticado', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const onLike = jest.fn();

    render(<PostCard post={mockPost} isAuthenticated={false} onLike={onLike} />);
    fireEvent.click(screen.getByRole('button'));

    expect(alertMock).toHaveBeenCalledWith('Você precisa estar autenticado para curtir posts!');
    expect(onLike).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
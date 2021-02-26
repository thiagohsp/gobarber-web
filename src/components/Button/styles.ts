import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  width: 100%;
  height: 56px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  margin-top: 16px;
  color: #312e38;
  font-weight: 500;
  transition: background-color 0.5s;
  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;

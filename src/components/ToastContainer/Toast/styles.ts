import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { animated } from 'react-spring';

interface ContainerProps {
  type?: 'info' | 'error' | 'success';
  hasDescription: number;
}

const toastTypeConstants = {
  info: css`
    background: #ebf8ff;
    color: ${darken(0.7, '#ebf8ff')};
  `,

  success: css`
    background: #e6fffa;
    color: ${darken(0.7, '#e6fffa')};
  `,
  error: css`
    background: #fddede;
    color: ${darken(0.7, '#fddede')};
  `,
};

export const Container = styled(animated.div)<ContainerProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  border-right: 8px solid;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  display: flex;

  & + div {
    margin-top: 8px;
  }

  ${props => toastTypeConstants[props.type || 'info']}

  > svg {
    margin: 4px 12px 0 0;
  }
  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    background: transparent;
    border: 0;
    right: 8px;
    top: 8px;
    color: inherit;
  }

  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;
    `}
`;

import styled from 'styled-components';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: var(--major);
  padding: 0 16px;

  h3 {
    font-weight: 400;
    user-select: none;
  }
`;

const StyledGreetingText = styled.div`
  color: var(--gray);
  span {
    color: var(--major);
  }
`;

const Header = ({ username }) => {
  return (
    <StyledHeader>
      <h3>Tasks</h3>
      <StyledGreetingText>
        Hi <span>{username}</span>
      </StyledGreetingText>
    </StyledHeader>
  );
};

export default Header;

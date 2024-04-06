import { ArrowLeft } from 'react-feather';
import { Link as HistoryLink, NavLink } from 'react-router-dom';

import styled from 'styled-components';
import { darken } from 'polished';

import useTheme from '../hooks/useTheme';

import { TYPE } from '../theme';

import ARROW_BACK from '/images/arrow-back.svg';
import { RowBetween } from './Row';
const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary1};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 23px;
    font-weight: 500;
    color: ${({ theme }) => theme.primary1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.primary1};
`;

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ marginBottom: '20px', display: 'none', padding: '1rem 1rem 0 1rem' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        Swap
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        Pools
      </StyledNavLink>
    </Tabs>
  );
}

export function FindPoolTabs({ origin }: { origin: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
        <HistoryLink to={origin}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
      </RowBetween>
    </Tabs>
  );
}

export function AddRemoveTabs({
  adding,
  creating,
  positionID,
}: {
  adding: boolean;
  creating: boolean;
  positionID?: string | undefined;
}) {
  const theme = useTheme();

  return (
    <Tabs>
      <div className='flex w-full px-4 pt-[30px]'>
        <div className='flex items-center gap-3'>
          <HistoryLink
            to={'/pool' + (positionID ? `/${positionID.toString()}` : '')}
            onClick={() => {
              if (adding) {
              }
            }}
          >
            <img src={ARROW_BACK} alt='' />
            {/* <ArrowLeft stroke={theme.white} /> */}
          </HistoryLink>
          <TYPE.mediumHeader fontWeight={500} color={theme.white} fontFamily={'Russo One'} fontSize={24}>
            {creating ? 'Create a pair' : adding ? 'Add Liquidity' : 'Remove Liquidity'}
          </TYPE.mediumHeader>
        </div>
      </div>
    </Tabs>
  );
}

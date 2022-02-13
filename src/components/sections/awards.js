import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { BLOCKS } from '@contentful/rich-text-types';
import { renderRichText } from 'gatsby-source-contentful/rich-text';

const StyledAwardsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .awards-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledAward = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .award-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .award-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .award-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .star {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .award-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .award-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .award-company {
    color: var(--light-slate);
    font-size: 20px;
    margin-bottom: 10px;
  }

  .award-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .award-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Awards = () => {
  const data = useStaticQuery(graphql`
    query {
      awards: allContentfulAward(sort: { fields: date, order: DESC }) {
        edges {
          node {
            title
            company
            tech
            date
            description {
              raw
            }
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealAwards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealAwards.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const options = {
    renderNode: {
      // eslint-disable-next-line react/display-name
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <div className="award-description" dangerouslySetInnerHTML={{ __html: children }} />
      ),
    },
  };

  const GRID_LIMIT = 6;
  const awards = data.awards.edges.filter(({ node }) => node);
  const firstSix = awards.slice(0, GRID_LIMIT);
  const awardsToShow = showMore ? awards : firstSix;

  const awardInner = node => {
    const { title, company, tech, description } = node;
    const github = '';
    const external = '';

    return (
      <div className="award-inner">
        <header>
          <div className="award-top">
            <div className="star">
              <Icon name="Star" />
            </div>
            <div className="award-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="award-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>
          <p className="award-company">{company}</p>

          {renderRichText(description, options)}
        </header>

        <footer>
          {tech && (
            <ul className="award-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledAwardsSection id="awards">
      <h2 ref={revealTitle}>Awards</h2>

      <ul className="awards-grid">
        {prefersReducedMotion ? (
          <>
            {awardsToShow &&
              awardsToShow.map(({ node }, i) => (
                <StyledAward key={i}>{awardInner(node)}</StyledAward>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {awardsToShow &&
              awardsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledAward
                    key={i}
                    ref={el => (revealAwards.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {awardInner(node)}
                  </StyledAward>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {awards.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledAwardsSection>
  );
};

export default Awards;

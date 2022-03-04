import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledPublicationsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .publications-grid {
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

const StyledPublication = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .publication-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .publication-inner {
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

  .publication-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .bookmark {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .publication-links {
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

  .publication-title {
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

  .publication-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .publication-tech-list {
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

const Publications = () => {
  const data = useStaticQuery(graphql`
    query {
      publications: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/publications/" }
          frontmatter: { showInPublications: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              conference
              tech
              external
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealContainer = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealPublications = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealPublications.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const publications = data.publications.edges.filter(({ node }) => node);
  const firstSix = publications.slice(0, GRID_LIMIT);
  const publicationsToShow = showMore ? publications : firstSix;

  const publicationInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech } = frontmatter;

    return (
      <div className="publication-inner">
        <header>
          <div className="publication-top">
            <div className="bookmark">
              <Icon name="Bookmark" />
            </div>
            <div className="publication-links">
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

          <h3 className="publication-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          <div className="publication-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          {tech && (
            <ul className="publication-tech-list">
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
    <StyledPublicationsSection id="publications" ref={revealContainer}>
      <h2 className="numbered-heading">Publications</h2>

      <ul className="publications-grid">
        {prefersReducedMotion ? (
          <>
            {publicationsToShow &&
              publicationsToShow.map(({ node }, i) => (
                <StyledPublication key={i}>{publicationInner(node)}</StyledPublication>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {publicationsToShow &&
              publicationsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledPublication
                    key={i}
                    ref={el => (revealPublications.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {publicationInner(node)}
                  </StyledPublication>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {publications.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledPublicationsSection>
  );
};

export default Publications;

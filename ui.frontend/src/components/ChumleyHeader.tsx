import {
  CoreLink,
  CoreNavigation,
  NavigationItem,
  NavigationProps,
} from 'aem-react-core-wcm-components-base';
import React, { useEffect, useRef } from 'react';
import './ChumleyHeader.css';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';

interface HeaderProps extends Omit<NavigationProps, 'items'> {
  applicationName: string;
  homePage: string;
  navigationItems: NavigationItem[];
}

const ChumleyHeader = ({
  accessibilityLabel,
  applicationName,
  homePage,
  navigationItems,
  baseCssClass = 'chumley-header',
}: HeaderProps): React.JSX.Element | null => {
  const headerRef = useRef(null);
  const menuToggleClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const chumleyHeader = (event.target as HTMLButtonElement).closest(
      '.chumley-header',
    );
    if (chumleyHeader) {
      if (chumleyHeader.classList.contains('chumley-header--expanded')) {
        chumleyHeader.classList.remove('chumley-header--expanded');
      } else {
        chumleyHeader.classList.add('chumley-header--expanded');
      }
    }
  };

  const setMenuHeight = () => {
    const chumleyHeader = headerRef.current;
    if (chumleyHeader) {
      const navigationElement = (chumleyHeader as HTMLDivElement).querySelector(
        '.chumley-navigation',
      );
      const navigationGroup = navigationElement!.querySelector(
        '.chumley-navigation__group',
      );
      if (navigationGroup) {
        (navigationGroup as HTMLUListElement).style.height = 'auto';
        (navigationGroup as HTMLUListElement).style.setProperty(
          '--chumley-header-menu-block-size',
          `${(navigationGroup as HTMLUListElement).clientHeight}px`,
        );
        (navigationGroup as HTMLUListElement).style.removeProperty('height');
      }

      if (window.innerWidth >= 768 && chumleyHeader) {
        (chumleyHeader as HTMLDivElement).classList.remove(
          'chumley-header--expanded',
        );
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', setMenuHeight);
    setMenuHeight();
  }, []);

  return (
    <div className={baseCssClass} ref={headerRef}>
      <div className={`${baseCssClass}__logo-container`}>
        <CoreLink className={`${baseCssClass}__logo`} href={homePage}>
          {applicationName}
        </CoreLink>
        <button
          aria-label="Menu toggle"
          className={`${baseCssClass}__menu-toggle`}
          onClick={menuToggleClickHandler}
          type="button"
        >
          <span className={`${baseCssClass}__toggle-bar`} />
          <span className={`${baseCssClass}__toggle-bar`} />
          <span className={`${baseCssClass}__toggle-bar`} />
        </button>
      </div>
      <CoreNavigation
        accessibilityLabel={accessibilityLabel}
        baseCssClass="chumley-navigation"
        isInEditor={AuthoringUtils.isInEditor()}
        items={navigationItems}
      />
    </div>
  );
};

export default ChumleyHeader;

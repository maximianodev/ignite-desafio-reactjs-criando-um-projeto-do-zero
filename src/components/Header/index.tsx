import Link from 'next/link';
import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={`${styles.logo} ${commonStyles.container}`}>
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="logo" title="Home" />
        </a>
      </Link>
    </div>
  );
}

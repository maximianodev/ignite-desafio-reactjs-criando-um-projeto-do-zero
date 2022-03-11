import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={`${styles.logo} container`}>
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="Logo" title="Home" />
        </a>
      </Link>
    </div>
  );
}

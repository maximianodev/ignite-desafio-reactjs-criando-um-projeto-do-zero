import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
// import commonStyles from '../styles/common.module.scss';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <div className={`${styles.postsPage} container`}>
      {postsPagination.results.map((post: Post) => (
        <div key={post.uid} className={`${styles.post}`}>
          <Link href={`/post/${post.uid}`}>
            <a>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div className={`${styles.date}`}>
                <time dateTime={post.first_publication_date}>
                  <FiCalendar size={16} />
                  {format(new Date(post.first_publication_date), 'd MMM yyyy', {
                    locale: ptBR,
                  })}
                </time>
                <span>
                  <FiUser size={16} />
                  {post.data.author}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}

      {postsPagination.next_page && (
        <button type="button">Carregar mais</button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsPagination: ApiSearchResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 4,
    }
  );

  return { props: { postsPagination } };
};

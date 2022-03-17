import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  console.log('🚀 ~ file: [slug].tsx ~ line 35 ~ Post ~ post', post);
  return (
    <div className={styles.post}>
      <img src={post.data.banner.url} alt={post.data.title} />
      <div className={commonStyles.container}>
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.additionalInfo}>
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
            <span>
              <FiClock size={16} />
              {post.data.content.reduce((acc, content) => {
                const body = RichText.asText(content.body);
                const bodyLength = body.split(' ').length;
                const numberOfWordsReadPerHumanMinute = 200;
                const readingTime = Math.ceil(
                  bodyLength / numberOfWordsReadPerHumanMinute
                );
                return acc + readingTime;
              }, 0)}
              Min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts: ApiSearchResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.uid'],
    }
  );
  const postFiltered = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    fallback: 'blocking',
    paths: postFiltered,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const {
    params: { slug },
  } = context;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', slug as string, {});

  return { props: { post: response } };
};

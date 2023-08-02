import styles from './styles.module.scss';

export default function Trending({data, title}: {data: any, title: string}) {
  
  console.log(data);

  return (
    <div className={styles.trending}>
      <h2>{title}</h2>
      {
        data && Array.isArray(data) && data.map(item => {
          return <li><a href={item.url}>{item.title}</a></li>
        })
      }
    </div>
  );
}
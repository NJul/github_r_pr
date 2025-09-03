import { useState } from 'react';
import styles from './Header.module.css';

export default function Header({ onSearch }) {
  const [username, setUsername] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>With GitHub REST API</h1>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type='text'
          className={styles.searchInput}
          placeholder='Search GitHub user ...'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type='submit' className={styles.searchButton}>
          Search
        </button>
      </form>
    </header>
  );
}

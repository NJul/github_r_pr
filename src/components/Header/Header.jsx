import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header({ onSearch }) {
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (
      !savedTheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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
        <label htmlFor='github-username' className='visually-hidden'>
          GitHub Username
        </label>
        <input
          id='github-username'
          name='username'
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

      <div className={styles.themeToggle}>
        <label className='form-check form-switch m-0'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className='ms-2'>{darkMode ? ' 🌙 ' : ' ☀️ '}</span>
        </label>
      </div>
    </header>
  );
}

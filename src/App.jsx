import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Header from './components/Header/Header';

function App() {
  const [avatarURL, setAvatarURL] = useState();
  const [login, setLogin] = useState();
  const [followersURL, setFollowersURL] = useState();

  useEffect(() => {
    fetch('https://api.github.com/users/NJul')
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          setAvatarURL(result.avatar_url);
          setLogin(result.login);
          setFollowersURL(result.followers_url);
        },
        error => {
          console.log(error);
        }
      );
  }, []);

  return (
    <>
      <Header />

      <div className='w-100 min-vh-100 d-flex justify-content-center align-items-center'>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant='top' src={avatarURL} />
          <Card.Body className='text-center'>
            <Card.Title>{login}</Card.Title>
            <Card.Text>
              <a href={followersURL} target='_blank' rel='noopener noreferrer'>
                Followers
              </a>
            </Card.Text>
            <Button variant='primary'>List my public repos</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default App;

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Header from './components/Header/Header';

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchRepo, setSearchRepo] = useState('');
  const [error, setError] = useState('');

  const fetchUser = username => {
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(result => {
        if (result.message === 'Not Found') {
          setError('User not found');
          setUser(null);
          setRepos([]);
        } else {
          setError('');
          setUser(result);
          setRepos([]);
        }
      })
      .catch(() => {
        setError('Something went wrong');
        setUser(null);
        setRepos([]);
      });
  };

  const fetchRepos = username => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(result => {
        if (Array.isArray(result)) {
          setRepos(result);
        } else {
          setRepos([]);
        }
      })
      .catch(() => setRepos([]));
  };

  const filteredRepos = repos.filter(
    repo =>
      repo.name.toLowerCase().includes(searchRepo.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchRepo.toLowerCase()))
  );

  return (
    <>
      <Header onSearch={fetchUser} />

      <Container fluid className='py-4'>
        <Row className='justify-content-center'>
          {error && <p className='text-danger text-center'>{error}</p>}

          {user && (
            <Col xs={12} sm={10} md={6} lg={4} className='mb-4'>
              <Card className='shadow-sm h-100'>
                <Card.Img variant='top' src={user.avatar_url} />
                <Card.Body className='text-center'>
                  <Card.Title>{user.login}</Card.Title>
                  <Card.Text>
                    <a
                      href={user.html_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      View Profile
                    </a>
                  </Card.Text>
                  <Card.Text>
                    Followers: {user.followers} | Following: {user.following}
                  </Card.Text>
                  <Button
                    variant='primary'
                    onClick={() => fetchRepos(user.login)}
                  >
                    Show Public Repos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {repos.length > 0 && (
          <Row className='justify-content-center'>
            <Col xs={12} sm={11} md={10} lg={8}>
              <Card className='shadow-sm'>
                <Card.Body>
                  <Card.Title className='text-center mb-3'>
                    Public Repositories
                  </Card.Title>

                  <Form className='mb-3'>
                    <Form.Control
                      type='text'
                      placeholder='Search repositories ...'
                      value={searchRepo}
                      onChange={e => setSearchRepo(e.target.value)}
                    />
                  </Form>

                  <ListGroup variant='flush'>
                    {filteredRepos.length > 0 ? (
                      filteredRepos.map(repo => (
                        <ListGroup.Item
                          key={repo.id}
                          className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center'
                        >
                          <div>
                            <a
                              href={repo.html_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='fw-semibold'
                            >
                              {repo.name}
                            </a>
                            {repo.description && (
                              <p className='mb-1 small text-muted'>
                                {repo.description}
                              </p>
                            )}
                          </div>
                          <div className='repo-stats text-muted small mt-2 mt-md-0'>
                            ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <p className='text-center text-muted'>
                        No repositories found
                      </p>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default App;

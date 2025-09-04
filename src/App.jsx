import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Header from './components/Header/Header';

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchRepo, setSearchRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchedUser, setLastSearchedUser] = useState('');
  const [lastFetchedReposUser, setLastFetchedReposUser] = useState('');

  const fetchUser = async username => {
    if (username.toLowerCase() === lastSearchedUser.toLowerCase()) return;

    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);
    setLastFetchedReposUser('');

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      const result = await res.json();

      if (result.message === 'Not Found') {
        setError('User not found');
      } else {
        setUser(result);
        setLastSearchedUser(username);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepos = async username => {
    if (username.toLowerCase() === lastFetchedReposUser.toLowerCase()) return;

    setReposLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      const result = await res.json();
      setRepos(Array.isArray(result) ? result : []);
      setLastFetchedReposUser(username);
    } catch (err) {
      console.error(err);
      setRepos([]);
    } finally {
      setReposLoading(false);
    }
  };

  const filteredRepos = repos.filter(
    repo =>
      repo.name.toLowerCase().includes(searchRepo.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchRepo.toLowerCase()))
  );

  useEffect(() => {
    fetchUser('NJul');
  }, []);

  return (
    <>
      <Header onSearch={fetchUser} />

      <Container fluid className='py-4'>
        <Row className='justify-content-center'>
          {error && <p className='text-danger text-center'>{error}</p>}

          {loading ? (
            <div className='d-flex justify-content-center align-items-center py-5'>
              <Spinner animation='border' role='status' variant='primary'>
                <span className='visually-hidden'>Loading user ...</span>
              </Spinner>
            </div>
          ) : (
            user && (
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
            )
          )}
        </Row>

        {reposLoading && (
          <div className='d-flex justify-content-center align-items-center py-4'>
            <Spinner animation='border' role='status' variant='secondary'>
              <span className='visually-hidden'>Loading repositories...</span>
            </Spinner>
          </div>
        )}

        {!reposLoading && repos.length > 0 && (
          <Row className='justify-content-center'>
            <Col xs={12} sm={11} md={10} lg={8}>
              <Card className='shadow-sm'>
                <Card.Body>
                  <Card.Title className='text-center mb-3'>
                    Public Repositories
                  </Card.Title>

                  <Form className='mb-3'>
                    <Form.Label
                      htmlFor='repo-search'
                      className='visually-hidden'
                    >
                      Search Repositories
                    </Form.Label>
                    <Form.Control
                      id='repo-search'
                      name='repoSearch'
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

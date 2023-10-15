import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-post-request-3c49a-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong...Retrying!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for(const key in data) {
        loadedMovies.push(
          {
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          }
        )
      }

      // const transformedMovies = data.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      // setMovies(transformedMovies);
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false); //setLoading is false on successful response.
  }, []);

  useEffect(() => {
    //fetch movies when the component mounts
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
  try{
    const response = await fetch('https://react-post-request-3c49a-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(!response.ok){
      throw new Error('Failed to add movie');
    }
    const data = await response.json();
    const updatedMovies = [...movies,{id: data.name, ...movie }];
    setMovies(updatedMovies);
    } catch (error) {
      setError(error.message);
    }
  }

  async function deleteMovieHandler(id) {
    try {
      const response = await fetch(`https://react-post-request-3c49a-default-rtdb.firebaseio.com/movies/${id}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      const updatedMovies = movies.filter((movie) => movie.id !== id);
      setMovies(updatedMovies);
    } catch (error) {
      setError(error.message);
    }
  }  
  

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler}/>;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
         {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies}/>}
        {!isLoading && movies.length === 0 && <p>Found no movies</p>}
        {!isLoading && error && <p>{error} </p>}
        {isLoading && <p>Loading...</p>} */}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

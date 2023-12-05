import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ItemImage } from "../components/ItemImage"
import { ReviewForm } from "../components/ReviewForm"

export function Detail(props) {
  const [movieData, setMovieData] = useState()

  let { id } = useParams()

  useEffect(() => {
    if (!movieData) {
      props.handler(id).then((movie) => setMovieData(movie))
    }
  }, [id])

  if (movieData) {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="my-4">{movieData.movie_title}</h1>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ItemImage source={movieData.cover_image} />
          </Col>
          <Col md={8}>
            <h2>More information</h2>
            <h3>Synopsis</h3>
            <p>{movieData.synopsis}</p>
            <h3>Director</h3>
            <p>{movieData.director}</p>
            <h3>Main Actors</h3>
            <p>{movieData.main_actors}</p>
            <h3>Genre</h3>
            <p>{movieData.genre}</p>
            <h3>IMDb Link</h3>
            <a href={movieData.imdb_link} target="_blank" rel="noopener noreferrer">
              {movieData.imdb_link}
            </a>
          </Col>
        </Row>
        <Row>
          <Col>
            <ReviewForm title={movieData.movie_title} />
          </Col>
        </Row>
      </Container>
    )
  } else {
    return null
  }
}

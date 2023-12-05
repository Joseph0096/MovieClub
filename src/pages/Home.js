import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from 'react';
import { ItemImage } from "../components/ItemImage";

export function Home(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  const ItemCards = items.map((item, itemKey) => {
    if (!item || !item.movie_title) {
      return null;
    }

    const title = item.movie_title.replace(/\s/g, "-");
    const itemLink = `detail/${item.id}/${title}`;

    return (
      <Col md={4} className="mb-4" key={itemKey}>
        <Card key={itemKey} className="position-relative">
          <a href={itemLink} className="position-absolute" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          </a>
          <ItemImage source={item.cover_image} />
          <Card.Body>
            <Card.Title>{item.movie_title}</Card.Title>
          </Card.Body>
          <Card.Link
            href={itemLink}
            className="position-absolute"
            style={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
          </Card.Link>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      <Row>
        {ItemCards}
      </Row>
    </Container>
  );
}

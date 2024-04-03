import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ApartamentListItem = ({
    name,
    hair_color,
    eye_color,
    birth_year,
    gender,
}) => {

    return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <ul>
                <li>hair_color: {hair_color}</li>
                <li>eye_color: {eye_color}</li>
                <li>birth_year: {birth_year}</li>
                <li>gender: {gender}</li>
            </ul>
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    );
}


export default ApartamentListItem;
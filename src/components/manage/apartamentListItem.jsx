import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import {Link} from 'react-router-dom';


const ApartamentListItem = ({
    property_id,
    property_number,
    floor,
    member_amount    
}) => {    
    return (
      <>
        <Card style={{ width: '18rem', marginTop: '20px', borderRadius: '15px' }}>
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
          <Card.Body>
            <Card.Title>{property_number }</Card.Title>
            <Card.Text>
              Номер на апартамент: {property_number ?? 'N/A'} <br/>
              Етаж: {floor} <br/>
              Брой живущи: {member_amount}
            </Card.Text>
            <Button as={Link} to={`/apartament/${property_id}`} key={property_id} variant="primary">Details</Button>
          </Card.Body>
        </Card>
      </>
    );
}


export default ApartamentListItem;
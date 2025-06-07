import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import {Link} from 'react-router-dom';


const ApartamentListItem = ({
    city,
    neighbourhood,
    address,
    property_id,
    property_number,
    floor,
    member_amount    
}) => {    
    return (
      <>
        <Card style={{ width: '18rem', marginTop: '20px', marginRight: '20px', borderRadius: '15px' }}>
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
          <Card.Body style={{display: 'flex', flexDirection: 'column', justifyContent:'space-between'}}>
            <Card.Title>Апартамент #{property_number }</Card.Title>
            <Card.Text>
              Град: <b> {city ?? 'няма данни'}</b><br/>
              Квартал <b>{neighbourhood ?? 'няма данни'}</b><br/>
              Адрес: <b>{address ?? 'няма данни'}</b> <br/>
              Номер на апартамент: <b>{property_number ?? 'няма данни'}</b> <br/>
              Етаж: <b>{floor ?? 'няма данни'} </b><br/>
              Брой живущи: <b>{member_amount ?? 'няма данни'}</b>
            </Card.Text>
            <Button as={Link} to={`/apartament/${property_id}`} key={property_id} className="custom-btn">Повече</Button>
          </Card.Body>
        </Card>
      </>
    );
}


export default ApartamentListItem;
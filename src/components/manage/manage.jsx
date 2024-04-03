import { useState, useEffect } from "react";

import ApartamentListItem from "./apartamentListItem";

import './manage.scss'

const base_url = 'https://swapi.dev/api';

const Manage = () => {
    const [apartaments, setApartaments] = useState([]);

    useEffect(() => {
        fetch(`${base_url}/people`)
            .then(res => res.json())
            .then(data => {
                setApartaments(data.results)
            })
    }, []);


    return(
        <div className="apartament-list">
            {apartaments.map((apartament, index) =>
                <ApartamentListItem key={apartament.name} id={index + 1} {...apartament} />
            )}
        </div>
    );
}

export default Manage;
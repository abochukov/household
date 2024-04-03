import { useState, useEffect } from "react";

import ApartamentListItem from "./apartamentListItem";

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
        <>
            {apartaments.map((apartament, index) =>
                <ApartamentListItem key={apartament.name} id={index + 1} {...apartament} />
            )}
        </>
    );
}

export default Manage;
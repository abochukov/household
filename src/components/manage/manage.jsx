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
            {apartaments.map(apartament =>
                <ApartamentListItem key={apartament.name} {...apartament} />
            )}
        </>
    );
}

export default Manage;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const ApartamentDetails = () => {

    const {id} = useParams();
    const [apartament, setApartament] = useState({});
    const navigate = useNavigate();
    const name = 'Unkown';

    useEffect(() => {
        fetch(`http://swapi.dev/api/people/${id}`)
            .then(res => {
                if(!res.ok) {
                    throw new Error('Not Found');
                }

                return res.json()
            })
            .then(setApartament)
            .catch((err) => {
                navigate('/manage')
            })
    }, [id])
    return(
        <>
            <h1>{apartament.name}</h1>
            
        </>
    )
}

export default ApartamentDetails;
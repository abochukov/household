import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as propertyService from '../../services/propertyService';

import './manage.scss';


const ApartamentDetails = () => {

    const {id} = useParams();
    const [apartament, setApartament] = useState({});
    const navigate = useNavigate();
    const name = 'Unkown';

    // useEffect(() => {
    //     propertyService.singleProperty(id)
    //         .then(res => {
    //             if(!res.ok) {
    //                 throw new Error('Not Found');
    //             }

    //             setApartament(res)
    //         })
    //         // .then(setApartament(res))
    //         .catch((err) => {
    //             navigate('/manage')
    //         })
    // }, [id])
    useEffect(() => {
        propertyService.singleProperty(id)
            .then((data) => {
                setApartament(data);
            },
            (error) => {
                toast("Възникна проблем със сървъра! Моля, опитайте по-късно!");
            } 
            )
    })
    return(
        <>
            {/* <h1>{apartament.name}</h1> */}
            <table>
                <thead>
                    <tr>
                        <th>апартамент {apartament[0]?.property_number}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td>Етаж</td>
                        <td>{apartament[0]?.floor}</td>
                    </tr>
                    <tr>
                        <td>Квадратура</td>
                        <td>{apartament[0]?.area}</td>
                    </tr>
                    <tr>
                        <td>Брой живущи</td>
                        <td>{apartament[0]?.member_amount}</td>
                    </tr>
                    
                    <tr>
                        <td>Домашни любимци</td>
                        <td>{apartament[0]?.pets}</td>
                    </tr>

                    <tr>
                        <td>Под наем</td>
                        <td>{apartament[0]?.rent}</td>
                    </tr>
                </tbody>
            </table>
        
            
        </>
    )
}

export default ApartamentDetails;
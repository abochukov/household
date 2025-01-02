import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as propertyService from '../../services/propertyService';

import './manage.scss';


const ApartamentDetails = () => {

    const {id} = useParams();
    const [apartament, setApartament] = useState({});
    const navigate = useNavigate();
    const name = 'Unkown';

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
                        <td>Град</td>
                        <td>{apartament[0]?.city ?? 'няма данни'}</td>
                    </tr>
                    <tr>
                        <td>Адрес</td>
                        <td>{apartament[0]?.address ?? 'няма данни'}</td>
                    </tr>
                    <tr>
                        <td>Етаж</td>
                        <td>{apartament[0]?.floor ?? 'няма данни'}</td>
                    </tr>
                    <tr>
                        <td>Квадратура</td>
                        <td>{apartament[0]?.area ?? 'няма данни'}</td>
                    </tr>
                    <tr>
                        <td>Брой живущи</td>
                        <td>{apartament[0]?.member_amount ?? 'няма данни'}</td>
                    </tr>
                    
                    <tr>
                        <td>Домашни любимци</td>
                        <td>{apartament[0]?.pets ?? 'няма данни'}</td>
                    </tr>

                    <tr>
                        <td>Под наем</td>
                        <td>{apartament[0]?.rent ?? 'няма данни'}</td>
                    </tr>
                    <tr>
                        <td>Потребителско име</td>
                        <td>{apartament[0]?.username ?? 'няма данни'}</td>
                    </tr>
                </tbody>
            </table>
        
            
        </>
    )
}

export default ApartamentDetails;
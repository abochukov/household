import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import axios from 'axios';

import ApartamentListItem from "./apartamentListItem";

import './manage.scss'
import CreateProperty from "./createProperty";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as propertyService from '../../services/propertyService';

const Manage = () => {
    const [apartaments, setApartaments] = useState([]);
    const [isVisible, setVisible] = useState(false); 
    
    const notify = () => toast("Wow so easy!");
    
    function click(e) {
        e.preventDefault();
        setVisible(true);
    }

    useEffect(() => {
        propertyService.getAll()
            .then((data) => {
                setApartaments(data);
            },
            (error) => {
                toast("Възникна проблем със сървъра! Моля, опитайте по-късно!");
            } 
            )
    })

    return(
        <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{ backgroundColor: "red", color: 'white' }}
        />

        <Button as={Link} to={`/createProperty`} variant="primary">Създай нов апартамент</Button>


        <div className="apartament-list">
            {apartaments.map((apartament, index) =>
                <ApartamentListItem key={apartament.property_id} id={index + 1} {...apartament} />
            )}
        </div>

        { isVisible && (
            <CreateProperty />
        )
        }
        </>
    );
}

export default Manage;
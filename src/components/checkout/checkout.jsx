import { useEffect, useState } from "react";

import Form from 'react-bootstrap/Form';
import * as addressService from '../../services/addressService';
import * as cashService from '../../services/cashService';
import Button from 'react-bootstrap/Button';

import './checkout.scss';

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [allSavedExpenses, setAllSavedExpenses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [username, setUsername] = useState('');
    const [residentsCount, setResidentsCount] = useState([]);
    const [expenses, setExpenses] = useState({
        address_id: '',
        cleaner: 70,
        lighting: 0,
        elevatorSubscription: 84,
        elevatorElectricity: 0,
        reconstruction: 100,
        security: 0,
        garden: 0,
        other: 0
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        setUsername(username);
        if (username) {
            addressService.getAddresses(username)
                .then(response => {
                    setAddresses(response);
                })
                .catch(error => {
                    console.error('Error fetching addresses:', error);
                    toast("Грешка при зареждане на адресите");
                });
        }
    }, []);

    useEffect(() => {

    }, [])

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);

        setExpenses(prevExpenses => ({
            ...prevExpenses,
            address_id: address.address_id
        }));

        cashService.getExpensessesForAddress(address.address_id)
        .then(response => {
            setAllSavedExpenses(response);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            toast("Грешка при зареждане на разходите");
        })
    };

    const handleNewModel = () => {
        if (!selectedAddress) {
            alert("Моля, изберете адрес.");
            return;
        }
        console.log(selectedAddress)
        cashService.getAllResidentsForAddress(username, selectedAddress.address_id)
            .then(response => {
                setResidentsCount(response);
                console.log('Нов модел създаден успешно:', response);
                // Можеш да покажеш съобщение или да обновиш UI
            })
            .catch(error => {
                console.error('Грешка при създаване на нов модел:', error);
                toast("Грешка при създаване на нов модел.");
            });
    
        setActiveSection('new-model');
    };


    const totalMembers = residentsCount.reduce((sum, r) => sum + r.member_amount, 0);
    const elevatorMemebers = residentsCount.filter(resident => resident.floor !== 1 && resident.floor !== 2).reduce((sum, r) => sum + r.member_amount, 0);

    const handleChange = (e, key) => {
        const newValue = e.target.value;
        setExpenses(prev => ({ ...prev, [key]: newValue }));
    };

    const handleSaveExpenses = async () => {
        cashService.expensessesForAddress(expenses)
            .then((newExpenses) => {
                toast.success("Успешно записахте разходите");

                setExpenses(prevExpenses => [...prevExpenses, newExpenses]);
                
                // setFormValues(formInitialState);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Грешка при записване на разхода");
            });
};
    
    
    return(
        <>
            <Form.Group className="col-lg-12 address-list">
                <Form.Label>Изберете адрес</Form.Label>
                <div>
                    {addresses.map((address, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            label={address.address}
                            value={address.address}
                            checked={selectedAddress?.address === address.address}
                            onChange={() => handleAddressSelection(address)}
                        />
                    ))}
                </div>
            </Form.Group>

            <div className="buttons" style={{ display: 'flex', flexDirection:'row', justifyContent:'spaceAround', marginTop: '1rem' }}>
                <Button variant="outline-primary" onClick={() => setActiveSection('reports')} style={{width: '20%', marginRight: '2rem'}}>Справки</Button>{' '}
                <Button variant="outline-primary" onClick={handleNewModel} style={{width: '20%'}}>Нов модел</Button>
            </div>

            {activeSection === 'reports' && (
                <div style={{ marginTop: '1rem' }}>
                    {allSavedExpenses.map(expense => {
                        return expense.cleaner
                    })}
                </div>
            )}

            {activeSection === 'new-model' && (
                <div style={{display: 'flex', flexDirection: 'row'}}>

                    <div style={{ width:'40%', marginRight: '2rem'}}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Номер на апартамент</th>
                                    <th>Етаж</th>
                                    <th>Брой живущи</th>
                                    <th>Такса апартамент</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residentsCount.map(resident => {
                                    return (
                                        <tr key={resident.property_number}>
                                            <td>{resident.property_number}</td>
                                            <td>{resident.floor}</td>
                                            <td>{resident.member_amount}</td>
                                            <td>-</td>
                                        </tr>
                                    )
                                })}
                                <tr><td colSpan={4}>Общ брой живущи: {residentsCount.reduce((sum, resident) => sum+resident.member_amount, 0)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table className="monthly-expenses-table">
                            <thead>
                                <tr>
                                    <th>Разход</th>
                                    <th>Сума</th>
                                    <th>Сума на човек</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Чистачка</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={expenses.cleaner}
                                            onChange={(e) => handleChange(e, 'cleaner')}
                                        />
                                    </td>
                                    <td>{(expenses.cleaner / totalMembers).toFixed(2)} лв</td>
                                </tr>
                                <tr>
                                    <td>Осветление</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={expenses.lighting}
                                            onChange={(e) => handleChange(e, 'lighting')}
                                        />
                                    </td>
                                    <td>{(expenses.lighting / totalMembers).toFixed(2)} лв</td>
                                </tr>
                                <tr>
                                    <td>Абонамент за асансьор</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={expenses.elevatorSubscription}
                                            onChange={(e) => handleChange(e, 'elevatorSubscription')}
                                        />
                                    </td>
                                    <td>
                                        {expenses.elevatorSubscription
                                            ? (expenses.elevatorSubscription / elevatorMemebers).toFixed(2) + ' лв'
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ток за асансьор</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={expenses.elevatorElectricity}
                                            onChange={(e) => handleChange(e, 'elevatorElectricity')}
                                        />
                                    </td>
                                    <td>
                                        {expenses.elevatorElectricity
                                            ? (expenses.elevatorElectricity / elevatorMemebers).toFixed(2) + ' лв'
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Основен ремонт</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={expenses.reconstruction}
                                            onChange={(e) => handleChange(e, 'reconstruction')}
                                        />
                                    </td>
                                    <td>
                                        {expenses.reconstruction
                                            ? (expenses.reconstruction / totalMembers).toFixed(2) + ' лв'
                                            : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <Button variant="outline-primary" onClick={handleSaveExpenses} >Запази</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}

export default Checkout;
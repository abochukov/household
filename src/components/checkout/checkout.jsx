import React, { useEffect, useState } from "react";
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
            });
    };

    const handleNewModel = () => {
        if (!selectedAddress) {
            alert("Моля, изберете адрес.");
            return;
        }

        cashService.getAllResidentsForAddress(username, selectedAddress.address_id)
            .then(response => {
                setResidentsCount(response);
            })
            .catch(error => {
                console.error('Грешка при създаване на нов модел:', error);
                toast("Грешка при създаване на нов модел.");
            });

        setActiveSection('new-model');
    };

    const handleChange = (e, key) => {
        const newValue = e.target.value;
        setExpenses(prev => ({ ...prev, [key]: parseFloat(newValue) || 0 }));
    };

    const handleSaveExpenses = async () => {
        cashService.expensessesForAddress(expenses)
            .then((newExpenses) => {
                toast.success("Успешно записахте разходите");
                setExpenses(prevExpenses => [...prevExpenses, newExpenses]);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Грешка при записване на разхода");
            });
    };

    const totalResidents = residentsCount.reduce((sum, resident) => sum + resident.member_amount, 0);
    const residentsUsingElevator = residentsCount.reduce(
        (sum, resident) => resident.elevator ? sum + resident.member_amount : sum, 0
    );

    const calculateTotalPerResident = (resident) => {
        const {
            cleaner,
            lighting,
            elevatorSubscription,
            elevatorElectricity,
            reconstruction
        } = expenses;

        const perResidentCleaner = cleaner / totalResidents;
        const perResidentLighting = lighting / totalResidents;
        const perResidentReconstruction = reconstruction / totalResidents;

        const perResidentElevatorSubscription = resident.elevator && residentsUsingElevator > 0
            ? elevatorSubscription / residentsUsingElevator
            : 0;
        const perResidentElevatorElectricity = resident.elevator && residentsUsingElevator > 0
            ? elevatorElectricity / residentsUsingElevator
            : 0;

        const total =
            (perResidentCleaner + perResidentLighting + perResidentReconstruction +
                perResidentElevatorSubscription + perResidentElevatorElectricity) * resident.member_amount;

        return total.toFixed(2);
    };

    return (
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

            <div className="buttons" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceAround', marginTop: '1rem' }}>
                <Button variant="outline-primary" onClick={() => setActiveSection('reports')} style={{ width: '20%', marginRight: '2rem' }}>Справки</Button>
                <Button variant="outline-primary" onClick={handleNewModel} style={{ width: '20%' }}>Нов модел</Button>
            </div>

            {activeSection === 'new-model' && (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '50%', marginRight: '2rem' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Номер на апартамент</th>
                                    <th>Етаж</th>
                                    <th>Брой живущи</th>
                                    <th>Асансьор</th>
                                    <th>Сума</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residentsCount.map(resident => (
                                    <tr key={resident.property_number}>
                                        <td>{resident.property_number}</td>
                                        <td>{resident.floor}</td>
                                        <td>{resident.member_amount}</td>
                                        <td>{resident.elevator ? 'да' : 'не'}</td>
                                        <td>{calculateTotalPerResident(resident)} лв</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={3}>Общ брой живущи: {totalResidents}</td>
                                    <td colSpan={2}>С асансьор: {residentsUsingElevator}</td>
                                </tr>
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
                                    <td>{(expenses.cleaner / totalResidents).toFixed(2)} лв</td>
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
                                    <td>{(expenses.lighting / totalResidents).toFixed(2)} лв</td>
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
                                        {residentsUsingElevator > 0
                                            ? (expenses.elevatorSubscription / residentsUsingElevator).toFixed(2) + ' лв'
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
                                        {residentsUsingElevator > 0
                                            ? (expenses.elevatorElectricity / residentsUsingElevator).toFixed(2) + ' лв'
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
                                        {(expenses.reconstruction / totalResidents).toFixed(2)} лв
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <Button variant="outline-primary" onClick={handleSaveExpenses}>Запази</Button>
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

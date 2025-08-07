import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import * as addressService from '../../services/addressService';
import * as cashService from '../../services/cashService';
import Button from 'react-bootstrap/Button';
import './checkout.scss';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reports from "./reports";

import infoIconUrl from '../../assets/icons/info-circle.svg';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

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
    
    const monthNames = [
        'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
        'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
    ];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = monthNames[now.getMonth()];

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

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
        try {
            const dataToSend = {
            ...expenses,
            month: selectedMonth,
            year: selectedYear,
            address_id: selectedAddress?.address_id,
            };

            const monthlyExpensesPerProperty = residentsCount.map(resident => ({
            type: 'resident',
            property_number: resident.property_number,
            floor: resident.floor,
            member_amount: resident.member_amount,
            elevator: resident.elevator,
            total_amount: parseFloat(calculateTotalPerResident(resident)),
            month: selectedMonth,
            year: selectedYear,
            address_id: selectedAddress?.address_id,
            }));

            const newExpenses = await cashService.expensessesForAddress(dataToSend);
            console.log('Новите разходи от сървъра:', newExpenses);
            
            await cashService.monthlyExpensesForProperty(monthlyExpensesPerProperty);

            toast.success("Успешно записахте разходите");

            setExpenses(newExpenses);

        } catch (error) {
            console.error('Грешка при записване на разходите:', error);
            toast.error("Грешка при записване на разходите");
        }
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
                <div className="title d-flex align-items-center gap-2">
                    Каса
                    <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={
                        <Tooltip id="info-tooltip">
                            Изберете адрес и създайте нов модел или направете справка.
                        </Tooltip>
                        }
                    >
                        {/* <FontAwesomeIcon icon={faCircleInfo} className="info-icon" style={{ cursor: 'pointer' }} /> */}
                        <img src={infoIconUrl} alt="info icon" style={{ width: '30px', height: '30px', cursor: 'pointer' }} />
                    </OverlayTrigger>
                </div>
                <div>
                    {addresses.map((address, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            label={`${address.city}, ${address.neighbourhood}, ${address.address}`}
                            value={address.address}
                            checked={selectedAddress?.address === address.address}
                            onChange={() => handleAddressSelection(address)}
                        />
                    ))}
                </div>
            </Form.Group>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceAround', margin: '1rem' }}>
                <Button className="custom-btn" onClick={handleNewModel} style={{ width: '20%', marginRight: '2rem' }}>Нов модел</Button>
                <Button className="custom-btn" onClick={() => setActiveSection('reports')} style={{ width: '20%', marginRight: '2rem' }}>Справки</Button>
            </div>

            {activeSection === 'new-model' && (
            <>
                <div className="date-container">
                    <div>
                        <label htmlFor="month-select">Месец: </label>
                        <select
                            id="month-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                            {[
                                'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
                                'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
                            ].map((monthName, index) => (
                                <option key={index} value={monthName}>
                                {monthName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label htmlFor="year-select">Година: </label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{marginRight: '2rem'}}>
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
                                    <td>Почистване</td>
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
                    <div style={{ width: '50%' }}>
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
                </div>
            </>
            )}

            {activeSection === 'reports' && selectedAddress && (
                <Reports selectedAddress={selectedAddress} />
            )}
        </>
    );
}

export default Checkout;

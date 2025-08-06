import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import * as addressService from '../../services/addressService';
import * as cashService from '../../services/cashService';
import Button from 'react-bootstrap/Button';
import './checkout.scss';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reports = ({selectedAddress}) => {

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [report, setReport] = useState([]);
    const [hasMadeSelection, setHasMadeSelection] = useState(false);


    useEffect(() => {
        if (!selectedAddress || !hasMadeSelection) return;

        const fetchCharges = async () => {
            try {
            const data = await cashService.getChargesByMonthAndYear({
                address_id: selectedAddress.address_id,
                charge_month: selectedMonth,
                charge_year: selectedYear,
            });
            console.log('Получени разходи:', data);
            setReport(data);
            } catch (error) {
            console.error('Грешка при взимане на разходи:', error);
            toast.error('Грешка при зареждане на справката');
            }
        };

        fetchCharges();
        }, [selectedMonth, selectedYear, selectedAddress, hasMadeSelection]);



    return (
        <>
        {console.log(selectedAddress)}
            <span>
                <strong>
                    Справки за {`${selectedAddress.city}, ${selectedAddress.neighbourhood}, ${selectedAddress.address}`}     
                </strong>
            </span>

            <div className="date-container">
                <div>
                    <label htmlFor="month-select">Месец: </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            setHasMadeSelection(true);
                        }}
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
                        onChange={(e) => {
                            setSelectedYear(Number(e.target.value));
                            setHasMadeSelection(true);
                        }}
                    >

                        {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="report-container">
                <table>
                    <thead>
                        <tr>
                            <th>Апартамент №</th>
                            <th>Месец</th>
                            <th>Година</th>
                            <th>Сума</th>
                            <th>Платено</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((r, index) => (
                            <tr key={index} style={{ backgroundColor: r.is_paid ? '#c3e6cb' : '#f5c6cb', color: 'white' }}>
                                <td>{r.property_id}</td>
                                <td>{r.charge_month}</td>
                                <td>{r.charge_year}</td>
                                <td>{r.price}</td>
                                <td>{r.is_paid ? 'Да' : 'Не'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default Reports;
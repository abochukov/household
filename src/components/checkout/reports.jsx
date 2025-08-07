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
            setReport(data.map(item => ({
               ...item,
                is_paid: item.is_paid === true,
            })));

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
                            console.log(report),
                            <tr key={index} style={{ backgroundColor: r.is_paid ? '#c3e6cb' : '#f5c6cb', color: 'white' }}>
                                <td>{r.property_id}</td>
                                <td>{r.charge_month}</td>
                                <td>{r.charge_year}</td>
                                <td>{r.price}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={r.is_paid}
                                        onChange={(e) => {
                                            const newReport = [...report];
                                            newReport[index].is_paid = e.target.checked;
                                            setReport(newReport);
                                        }}
                                        />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <Button
                                    className="custom-btn"
                                    onClick={async () => {
                                        try {
                                        for (const row of report) {
                                            await cashService.updatePaymentStatus({
                                            address_id: selectedAddress.address_id,
                                            property_id: row.property_id,
                                            charge_month: row.charge_month,
                                            charge_year: row.charge_year,
                                            is_paid: row.is_paid,
                                            });
                                        }
                                        toast.success('Промените са запазени успешно!');
                                        } catch (error) {
                                        console.error('Грешка при запазване:', error);
                                        toast.error('Грешка при запазване на промените!');
                                        }
                                    }}
                                    >
                                    Запази
                                    </Button>

                        </tr>
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default Reports;
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import './CustomDatePicker.css';

registerLocale('es', es);

const CustomDatePicker = ({ selected, onChange, placeholder = "Seleccionar fecha...", ...props }) => {
    return (
        <div className="custom-datepicker-container">
            <DatePicker
                selected={selected}
                onChange={onChange}
                locale="es"
                dateFormat="dd/MM/yyyy"
                placeholderText={placeholder}
                calendarClassName="custom-dark-calendar"
                wrapperClassName="date-picker-wrapper"
                portalId="root"
                {...props}
            />
        </div>
    );
};

export default CustomDatePicker;

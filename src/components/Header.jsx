import React from 'react'
import './Header.scss'

export default function Header({ title, label, width }) {
    return (
        <div className='header' >
            <p className='header__title'>{title}</p>
            <label htmlFor="" className="header__label" style={{ width: `${width}%` }}>{label}</label>
        </div>
    )
}

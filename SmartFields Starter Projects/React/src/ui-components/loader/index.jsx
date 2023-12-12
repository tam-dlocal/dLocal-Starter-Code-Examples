import React from 'react';
import './styles.css';
import cl from 'classnames';

export default function Loader(props) {
    const { color } = props;

    return (
        <div className="loader">
            <div className={cl('lds-dual-ring', color)} />
        </div>
    );
}

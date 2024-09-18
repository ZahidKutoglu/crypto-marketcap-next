'use client';

import React, { useEffect, useState } from 'react';
import useTheme from './useTheme';
import Modal from 'react-modal';


const Header = ({ selectedCurrency, currencySymbols, handleCurrencyChange, watchlist, getLogoUrl  }) => {
    const [theme, toggleTheme] = useTheme();
    const [hoverContainer, setHoverContainer] = useState(false);
    const [modalSwitch, setModalSwitch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const filteredCurrencies = Object.keys(currencySymbols).filter((currencyKey) => {
        const currency = currencySymbols[currencyKey];
        return (
            currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currencyKey.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const openModal = () => setModalSwitch(true);
    const closeModal = () => setModalSwitch(false);

    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(12, 24, 46, 0.5)',
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: 'var(--modal-background-color)',
            width: '900px',
            maxWidth: '100%',
            fontFamily: 'system-ui',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '62%',
            padding: '0',
            margin: '0',
        },
    };

    useEffect(() => {
        setSearchTerm('');
    }, [modalSwitch]);


    return (
        <div>
            <Modal
                isOpen={modalSwitch}
                onRequestClose={closeModal}
                style={modalStyle}
                ariaHideApp={false}
            >
                <div className='wrapper'>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 style={{ marginTop: 2, marginLeft: 3 }}>Select Currency</h2>
                        <div onClick={closeModal} className="close-button"></div>
                    </span>
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredCurrencies.length > 0 && (
                    <div>
                        <div className="currency-section">
                            <h3>Popular currencies</h3>
                            <div className="currency-buttons">
                                {filteredCurrencies.slice(0, 5).map((currencyKey) => {
                                    const currency = currencySymbols[currencyKey];
                                    return (
                                        <div
                                            key={currencyKey}
                                            onClick={() => handleCurrencyChange(currencyKey)}
                                            className={`currency-button ${selectedCurrency === currencyKey ? 'selected' : ''}`}
                                        >
                                            <span>{currency.symbol} - {currency.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="currency-section">
                            <h3>Fiat currencies</h3>
                            <div className="currency-buttons">
                                {filteredCurrencies.map((currencyKey) => {
                                    const currency = currencySymbols[currencyKey];
                                    return (
                                        <div
                                            key={currencyKey}
                                            onClick={() => handleCurrencyChange(currencyKey)}
                                            className={`currency-button ${selectedCurrency === currencyKey ? 'selected' : ''}`}
                                        >
                                            <span>{currency.symbol} - {currency.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <div className="header-parent">
                <span className="title">
                    <img className='logo' src="logo.png" alt="CryptDollar Logo" />
                    CryptDollar
                </span>

                <span className='header-right'>

                <div onMouseLeave={() => setHoverContainer(false)} style={{ padding: '50px' }}>
                        <span
                            onMouseEnter={() => setHoverContainer(true)}
                            className="watchlist"
                        >
                            <img className="roundedStar" src="roundedStar.png" alt="Watchlist Icon" width={20} />
                            <span>Watchlist</span>
                        </span>
                    </div>
                   

                        <div
                        className={`watchlistContainer ${hoverContainer ? 'show' : ''}`}
                        onMouseEnter={() => setHoverContainer(true)}
                        onMouseLeave={() => setHoverContainer(false)}
                        >
                        <div
                            className={`watchlistBox ${hoverContainer ? 'show' : ''}`}
                        >
                            <div className={`caret ${hoverContainer ? 'show' : ''}`}></div>
                        {watchlist.map((item, index) => (
                            <div key={index} className="watchlist-item">
                                <img src={getLogoUrl(item.id)} alt={item.name} />
                                <span className="symbol">{item.symbol}</span>
                                <span className="price">
                                    {item.quote[selectedCurrency]?.price
                                        ? `${currencySymbols[selectedCurrency].symbol}${item.quote[selectedCurrency].price.toFixed(2)}`
                                        : 'N/A'}
                                </span>
                                <div className={`crypto-cell ${item.quote[selectedCurrency]?.percent_change_1h >= 0 ? 'positive' : 'negative'}`}>
                                    {item.quote[selectedCurrency]?.percent_change_1h >= 0 ? (
                                        <svg
                                            style={{ marginTop: '1px', marginRight: -4, transform: 'rotate(180deg)' }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="13"
                                            height="13"
                                            fill="currentColor"
                                            className="bi bi-caret-down-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 0 0 1-1.506 0z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            style={{ marginTop: '5px', marginRight: -4}}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="13"
                                            height="13"
                                            fill="currentColor"
                                            className="bi bi-caret-down-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 0 0 1-1.506 0z" />
                                        </svg>
                                    )}
                                    <span className="percentage">
                                        {item.quote[selectedCurrency]?.percent_change_1h !== undefined
                                            ? `${Math.abs(item.quote[selectedCurrency].percent_change_1h).toFixed(2)}%`
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>

                    <span className='currencySelect' onClick={openModal}>
                        <span>{selectedCurrency}</span>
                        <svg style={{ marginTop: 2 }} xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 0 0 1-1.506 0z" />
                        </svg>
                    </span>
        

                    <div className="icon-container" onClick={toggleTheme} style={{ paddingLeft: 32 }}>
                    {theme === 'dark' ? (
                        <img className='sunIcon' src="sunIcon.png" alt="Sun Icon" />
                    ) : (
                        <img style={{ width: 20 }} className='moonIcon' src="moonIcon.png" alt="Moon Icon" />
                    )}
                    </div>

                    </span>
            </div>
        </div>
    );
};

export default Header;

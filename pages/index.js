'use client';

import React, { useEffect, useState, useMemo } from 'react';
import getCryptoPrices from '../coinMarketCapService';
import Header from '../header';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [scrolled, setScrolled] = useState(false);

  const addToWatchlist = (crypto) => {
    setWatchlist((prevWatchlist) => {
      if (prevWatchlist.some(item => item.id === crypto.id)) {
        return prevWatchlist.filter(item => item.id !== crypto.id);
      } else {
        return [...prevWatchlist, crypto];
      }
    });
  };

  const isInWatchlist = (cryptoId) => watchlist.some(item => item.id === cryptoId);

  useEffect(() => {
    setWatchlist((prevWatchlist) => {
      return prevWatchlist.map(watchlistItem => {
        const updatedItem = cryptoData.find(item => item.id === watchlistItem.id);
        return updatedItem ? updatedItem : watchlistItem;
      });
    });
  }, [cryptoData]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const currencySymbols = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    BTC: { symbol: 'BTC', name: 'Bitcoin' },
    ETH: { symbol: 'ETH', name: 'Ethereum' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    AUD: { symbol: 'A$', name: 'Australian Dollar' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc' },
    CNY: { symbol: '¥', name: 'Chinese Yuan' },
    SEK: { symbol: 'kr', name: 'Swedish Krona' },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
    MXN: { symbol: '$', name: 'Mexican Peso' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone' },
    KRW: { symbol: '₩', name: 'South Korean Won' },
    TRY: { symbol: '₺', name: 'Turkish Lira' },
    RUB: { symbol: '₽', name: 'Russian Ruble' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
    BRL: { symbol: 'R$', name: 'Brazilian Real' },
    ZAR: { symbol: 'R', name: 'South African Rand' },
    DKK: { symbol: 'kr', name: 'Danish Krone' },
    PLN: { symbol: 'zł', name: 'Polish Zloty' },
    THB: { symbol: '฿', name: 'Thai Baht' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
    HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
    CZK: { symbol: 'Kč', name: 'Czech Koruna' },
    EGP: { symbol: '£', name: 'Egyptian Pound' }, 
    CLP: { symbol: '$', name: 'Chilean Peso' },
    PHP: { symbol: '₱', name: 'Philippine Peso' },
    AED: { symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
    SAR: { symbol: '﷼', name: 'Saudi Riyal' },
    RON: { symbol: 'lei', name: 'Romanian Leu' },
    COP: { symbol: '$', name: 'Colombian Peso' },
    TWD: { symbol: 'NT$', name: 'New Taiwan Dollar' },
    VND: { symbol: '₫', name: 'Vietnamese Dong' },
    BGN: { symbol: 'лв', name: 'Bulgarian Lev' },
    HRK: { symbol: 'kn', name: 'Croatian Kuna' },
    PKR: { symbol: '₨', name: 'Pakistani Rupee' },
    UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCryptoPrices(selectedCurrency);
        setCryptoData(data.data);
        setLoading(false);
        setError(null); 
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 20000);

    return () => clearInterval(intervalId);
  }, [selectedCurrency]); 


  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...cryptoData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name') {
          if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'price') {
          const priceA = a.quote[selectedCurrency]?.price || 0;
          const priceB = b.quote[selectedCurrency]?.price || 0;
          return sortConfig.direction === 'ascending' ? priceA - priceB : priceB - priceA;
        } else if (sortConfig.key === 'percent_change_1h') {
          const percentA = a.quote[selectedCurrency]?.percent_change_1h || 0;
          const percentB = b.quote[selectedCurrency]?.percent_change_1h || 0;
          return sortConfig.direction === 'ascending' ? percentA - percentB : percentB - percentA;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [cryptoData, sortConfig, selectedCurrency]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const getLogoUrl = (id) => {
    return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
  };

  return (
    <div>
      <Header selectedCurrency={selectedCurrency} currencySymbols={currencySymbols}
              handleCurrencyChange={handleCurrencyChange} watchlist={watchlist}
              getLogoUrl={getLogoUrl}
      />

      <div className={`scrollTop ${scrolled ? 'scrolled' : ''}`} onClick={scrollToTop}>
        <button className="up-button">
          <span className="arrow"></span>
        </button>
      </div>

      <div className="parent">
        <div className="container">

          <ul className="crypto-dashboard">
            <li className="crypto-row header">
              <div className="crypto-cell header-cell">#</div>
              <div className="crypto-cell header-cell"><span style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name</span></div>
              <div className="crypto-cell header-cell"><span style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>Price</span></div>
              <div className="crypto-cell header-cell"><span style={{ cursor: 'pointer' }} onClick={() => handleSort('percent_change_1h')}>1h %</span></div>
            </li>
            {sortedData.map((crypto, index) => (
              <li className="crypto-row" key={crypto.id}>
                <div className="crypto-cell">
                  
                  <img onClick={() => addToWatchlist(crypto)} className={isInWatchlist(crypto.id) ? 'star-filled' : 'star'} style={{ width: 13, height: 13, marginRight: 30, cursor: 'pointer' }} src={isInWatchlist(crypto.id) ? 'star-filled.png' : 'star.png'} alt="" />

                  <div>{index + 1}</div>
                </div>
                <div className="crypto-cell">
                  <img src={getLogoUrl(crypto.id)} alt={crypto.name} />
                  <div className="crypto-name">
                    <span>{crypto.name}</span>
                    <span className="symbol">{crypto.symbol}</span>
                  </div>
                </div>
                <div className="crypto-cell">
                  {crypto.quote[selectedCurrency]?.price
                    ? `${currencySymbols[selectedCurrency].symbol}${crypto.quote[selectedCurrency].price.toFixed(2)}`
                    : 'N/A'}
                </div>
                <div className={`crypto-cell ${crypto.quote[selectedCurrency]?.percent_change_1h >= 0 ? 'positive' : 'negative'}`}>
                {crypto.quote[selectedCurrency]?.percent_change_1h >= 0 ? (
                  <svg style={{ marginTop: '2px', transform: 'rotate(180deg)' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                ):  <svg style={{ marginTop: 3 }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
                }
                  {crypto.quote[selectedCurrency]?.percent_change_1h !== undefined ? `${Math.abs(crypto.quote[selectedCurrency].percent_change_1h).toFixed(2)}%` : 'N/A'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;


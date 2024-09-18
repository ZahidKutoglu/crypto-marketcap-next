const getCryptoPrices = async (currency = 'USD') => {
  try {
    const response = await fetch(`/api/crypto?currency=${currency}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default getCryptoPrices;

 

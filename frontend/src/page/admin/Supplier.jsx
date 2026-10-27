
import { useEffect, useState } from 'react';
import { getSupplier } from '../../service/supplierService';

const Supplier = () => {
  const [supplier, setSupplier] = useState([]);

  useEffect(() => {
    getSupplier()
      .then((data) => setSupplier(data))
      .catch((error) => console.error(error));
  }, []);

      console.log(supplier);

  return (
    <div>
      {supplier.map((data) => (
        <div key={data.id}>
          <h3>{data.name}</h3>
          <p>${data.price}</p>
        </div>
      ))}
    </div>


  );
};

export default Supplier;
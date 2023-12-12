import { useState, useEffect } from 'react';

const useDlocalFields = (options) => {
  const [fields, setFields] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFields = () => {
      const dlocalInstance = dlocalApiInstance.create('YOUR_DLOCAL_PUBLIC_KEY', options);
      const fieldsExample1 = dlocalInstance.fields({
        fonts: [{
          cssSrc: 'https://rsms.me/inter/inter-ui.css',
        }],
        locale: 'en',
        country: 'BR',
      });

      setFields(fieldsExample1);
      setIsLoading(false);
    };

    initializeFields();
  }, []);

  if (isLoading) {
    // Return loading state or placeholder content
    return <div>Loading...</div>;
  }

  return fields;
};

export { useDlocalFields };

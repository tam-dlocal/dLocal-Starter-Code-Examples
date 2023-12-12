import { useEffect, useState } from 'react';

const useDlocalFields = () => {
    const [dlocalInstance, setDlocalInstance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeFields = async () => {
            if (!window.dlocalInstance) {
                const script = document.createElement('script');
                script.src = 'https://js-sandbox.dlocal.com';
                script.async = true;

                const loadScript = new Promise((resolve) => {
                    script.onload = resolve;
                });

                document.body.appendChild(script);

                try {
                    await loadScript;
                } catch (error) {
                    console.error('Failed to load DLocal script:', error);
                    setIsLoading(false);
                    return;
                }
            }

            const dlocalInstance = dlocal('YOUR_DLOCAL_PUBLIC_KEY');
            setDlocalInstance(dlocalInstance);
            setIsLoading(false);
        };

        initializeFields();
    }, []);

    return [dlocalInstance, isLoading];
};

export default useDlocalFields;

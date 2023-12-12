import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, Divider, InputLabel, InputAdornment } from '@mui/material';
import Layout from '../components/layout/Layout';
import axios from 'axios'

import hmacSHA512 from 'crypto-js/hmac-sha512';


const Checkout = () => {
    const [dlocalInstance, setDlocalInstance] = useState(null);
    const [smartFieldsInstance, setSmartFields] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [panField, setPanField] = useState(null);
    const [ccvField, setCcvField] = useState(null);
    const [expirationField, setExpirationField] = useState(null);

    const [paymentSuccess, setPaymentSuccess] = useState(false); // New state variable
    const [cardToken, setCardToken] = useState(null); // New state variable

    const [formValues, setFormValues] = useState({
        pan: '',
        ccv: '',
        expiration: '',
        cardHolder: ''
    });

    const today = new Date();
    const month = today.getMonth() + 1;
    const monthStr = month <= 9 ? '0' + month : month.toString();
    const year = (today.getFullYear() + 2).toString().substring(2);

    const panFieldRef = useRef();
    const ccvFieldRef = useRef();
    const expirationFieldRef = useRef();

    useEffect(() => {
        const loadDLocalScript = () => {
            const script = document.createElement('script');
            script.src = 'https://js-sandbox.dlocal.com';
            script.async = true;

            script.addEventListener('load', initializeDLocalInstance);

            document.body.appendChild(script);

            return () => {
                script.removeEventListener('load', initializeDLocalInstance);
                document.body.removeChild(script);
            };
        };

        loadDLocalScript();
    }, []);

    useEffect(() => {
        if (smartFieldsInstance) {
            const panFieldInstance = smartFieldsInstance.create('pan', {
                style: {
                    base: {
                        fontSize: '16px',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        lineHeight: '18px',
                        fontSmoothing: 'antialiased',
                        fontWeight: '500',
                        color: '#666',
                        '::placeholder': {
                            color: '#c1c1c1'
                        },
                        iconColor: '#c1c1c1'
                    },
                    autofilled: {
                        color: '#000000'
                    }
                },
                placeholder: '4111 1111 1111 1111'
            });

            const ccvFieldInstance = smartFieldsInstance.create('cvv', {
                style: {
                    base: {
                        fontSize: '16px',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        lineHeight: '18px',
                        fontSmoothing: 'antialiased',
                        fontWeight: '500',
                        color: '#666',
                        '::placeholder': {
                            color: '#c1c1c1'
                        },
                        iconColor: '#c1c1c1'
                    },
                    autofilled: {
                        color: '#000000'
                    }
                },
                placeholder: '123'
            });

            const expirationFieldInstance = smartFieldsInstance.create('expiration', {
                style: {
                    base: {
                        fontSize: '16px',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        lineHeight: '18px',
                        fontSmoothing: 'antialiased',
                        fontWeight: '500',
                        color: '#666',
                        '::placeholder': {
                            color: '#c1c1c1'
                        },
                        iconColor: '#c1c1c1'
                    },
                    autofilled: {
                        color: '#000000'
                    }
                },
                placeholder: monthStr + '/' + year
            });

            setPanField(panFieldInstance);
            setCcvField(ccvFieldInstance);
            setExpirationField(expirationFieldInstance);

            setTimeout(() => {

                panFieldInstance.mount(panFieldRef.current); //{current: undefined}
                ccvFieldInstance.mount(ccvFieldRef.current);
                expirationFieldInstance.mount(expirationFieldRef.current)

            }, 0);

            setIsLoading(false);
        }
    }, [smartFieldsInstance]);

    const initializeDLocalInstance = () => {
        const publicKey = 'efba0f53-252d-4da2-806c-3cb694a1e2d8'; // Replace with your actual DLocal public key
        const instance = dlocal(publicKey);

        const smartFieldsInstance = instance.fields({
            fonts: [
                {
                    cssSrc: 'https://rsms.me/inter/inter-ui.css'
                }
            ],
            locale: 'en',
            country: 'BR'
        });

        setDlocalInstance(instance);
        setSmartFields(smartFieldsInstance);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        dlocalInstance.createToken(panField, {
            name: `${formValues.cardHolder}`
        }).then(async (result) => {
            setIsLoading(false);

            if (result.token) {
                console.log(result.token);
                setPaymentSuccess(true)
                setCardToken(result.token)
            }
        })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });

        // Access the form input values
        console.log('Form values:', formValues);
    };

    if (isLoading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Typography variant="h2">Loading...</Typography>
                </Box>
            </Layout>
        );
    }

    if (paymentSuccess) { // Render success page if payment is successful
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Typography variant="h2">Payment Token Generated with Sucess</Typography>
                    <Typography variant="h5">Use the Token <span style={{ fontWeight: 'bold' }}>{cardToken}</span> on your payment request.</Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
                <Box sx={{ border: '1px solid #ccc', p: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>Shopping Cart</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src="https://harpersbazaar.com.au/wp-content/uploads/2023/02/sausagelord_330856743_1568387900302190_924598700868142362_n-819x1024.jpg" alt="Red Boots" style={{ width: '80px', height: '80px', marginRight: '10px' }} />
                        <Box>
                            <Typography variant="body1">Red Boots</Typography>
                            <Typography variant="body2">Price: $15.00</Typography>
                            <Typography variant="body2">Quantity: 01</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ m: 2 }}></Divider>
                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>Payment Method</Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', width: '100vh' }}>
                                <Box p={1} style={{ width: '100%', borderRadius: '5px', border: '1px solid #f3f3f3' }}>
                                    <div ref={panFieldRef} style={{ width: '100%' }}></div>
                                    <label htmlFor="panField" style={{ fontSize: '10px' }}>Card Number</label>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                                <Box p={1} style={{ width: '100%', borderRadius: '5px', border: '1px solid #f3f3f3' }}>
                                    <div ref={ccvFieldRef} style={{ width: '100%' }}></div>
                                    <label htmlFor="ccvField" style={{ fontSize: '10px' }}>CCV</label>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                                <Box p={1} style={{ width: '100%', borderRadius: '5px', border: '1px solid #f3f3f3' }}>
                                    <div ref={expirationFieldRef} style={{ width: '100%' }}></div>
                                    <label htmlFor="expirationField" style={{ fontSize: '10px' }}>Expiration Date</label>
                                </Box>
                            </Grid>
                            {dlocalInstance && (
                                <Grid item xs={12}>
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            type="text"
                                            name="cardHolder"
                                            fullWidth
                                            margin="normal"
                                            required
                                            value={formValues.cardHolder}
                                            onChange={(event) => setFormValues({ ...formValues, cardHolder: event.target.value })}
                                            style={{ width: '100%', borderRadius: '5px', border: '1px solid #f3f3f3' }}
                                            InputProps={{
                                                endAdornment: (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            left: '8px',
                                                            bottom: '8px',
                                                            textAlign: 'left',
                                                            fontSize: '10px',
                                                            color: 'gray'
                                                        }}
                                                    >
                                                        Card holder name
                                                    </Box>
                                                )
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }}>
                            Pay
                        </Button>
                    </form>

                </Box>
            </Box>
        </Layout>
    );
};

export default Checkout;
